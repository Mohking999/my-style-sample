import { Router } from 'express';
import { prisma } from '../db.js';
import { AuthRequest, requireAuth, requireStaffOrAdmin } from '../middleware/auth.js';

const router = Router();

// Algerian phone validation regex
function isValidAlgerianPhone(phone: string): boolean {
  const clean = phone.replace(/\s+/g, '').replace(/-/g, '');
  // Matches 05..., 06..., 07..., 2135..., +2135..., etc.
  return /^((\+213|213|0)[567][0-9]{8})$/.test(clean);
}

// Generate unique order number (e.g. DZ-2026-XXXXX)
function generateOrderNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `DZ-${new Date().getFullYear()}-${rand}`;
}

// POST /api/orders (Guest or Authenticated Checkout)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      customerName,
      customerPhone,
      wilayaCode,
      commune,
      address,
      deliveryType = 'home',
      paymentMethod = 'cod',
      notes,
      discountCode,
      items, // array of { variantId, quantity }
    } = req.body;

    // 1. Basic validation
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Le nom complet est requis' });
    }
    if (!customerPhone || !isValidAlgerianPhone(customerPhone)) {
      return res.status(400).json({
        error: 'Numéro de téléphone algérien invalide. Veuillez saisir un numéro au format 05, 06, 07 ou +213',
      });
    }
    if (!wilayaCode || !commune || !address) {
      return res.status(400).json({ error: 'Veuillez renseigner l’adresse complète et la wilaya' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Votre panier est vide' });
    }

    // 2. Fetch Wilaya fee
    const wilaya = await prisma.wilaya.findUnique({
      where: { code: Number(wilayaCode) },
    });
    if (!wilaya || !wilaya.active) {
      return res.status(400).json({ error: 'Wilaya sélectionnée non desservie' });
    }
    const deliveryFeeDzd = deliveryType === 'relay' ? wilaya.relayDeliveryFee : wilaya.homeDeliveryFee;

    // 3. Process items and verify stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotalDzd = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error('Un article de votre panier n’est plus disponible');
        }

        const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);
        if (variant.stock < requestedQty) {
          throw new Error(
            `Stock insuffisant pour ${variant.product.nameFr} (${variant.size} - ${variant.colorNameFr}). Restant: ${variant.stock}`
          );
        }

        // Deduct stock to prevent overselling
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: requestedQty } },
        });

        const itemTotal = variant.product.priceDzd * requestedQty;
        subtotalDzd += itemTotal;

        let imgUrl = '';
        try {
          const imgs = JSON.parse(variant.product.images);
          imgUrl = imgs[0] || '';
        } catch {
          imgUrl = variant.product.images;
        }

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          title: variant.product.nameFr,
          color: variant.colorNameFr,
          size: variant.size,
          priceDzd: variant.product.priceDzd,
          quantity: requestedQty,
          image: imgUrl,
        });
      }

      // 4. Calculate discount on server
      let discountDzd = 0;
      let appliedCode: string | null = null;
      if (discountCode) {
        const discountRecord = await tx.discountCode.findUnique({
          where: { code: discountCode.trim().toUpperCase() },
        });
        if (
          discountRecord &&
          discountRecord.active &&
          (!discountRecord.expiresAt || new Date(discountRecord.expiresAt) >= new Date()) &&
          subtotalDzd >= discountRecord.minOrderDzd
        ) {
          appliedCode = discountRecord.code;
          if (discountRecord.type === 'percentage') {
            discountDzd = Math.round((subtotalDzd * discountRecord.value) / 100);
          } else {
            discountDzd = Math.min(discountRecord.value, subtotalDzd);
          }
        }
      }

      const totalDzd = Math.max(0, subtotalDzd - discountDzd + deliveryFeeDzd);
      const orderNumber = generateOrderNumber();

      // 5. Create Order record
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user?.id || null,
          customerName,
          customerPhone,
          wilayaCode: wilaya.code,
          wilayaName: wilaya.nameFr,
          commune,
          address,
          deliveryType,
          paymentMethod,
          notes: notes || null,
          status: 'pending',
          subtotalDzd,
          deliveryFeeDzd,
          discountDzd,
          discountCode: appliedCode,
          totalDzd,
          items: {
            create: orderItemsData,
          },
          history: {
            create: [
              {
                status: 'pending',
                note: req.user
                  ? `Commande enregistrée par le client connecté (${req.user.name})`
                  : 'Commande enregistrée en tant qu’invité',
              },
            ],
          },
        },
        include: {
          items: true,
          history: true,
        },
      });

      return createdOrder;
    });

    return res.status(201).json({
      success: true,
      order,
      message: 'Commande validée avec succès !',
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    return res.status(400).json({ error: err.message || 'Erreur lors de la validation de la commande' });
  }
});

// GET /api/orders (User's own orders or all if Admin/Staff)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const isElevated = req.user?.role === 'admin' || req.user?.role === 'staff';
    const where = isElevated ? {} : { userId: req.user!.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// GET /api/orders/:orderNumber (Public tracking by order number and phone or authenticated user)
router.get('/:orderNumber', async (req: AuthRequest, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Security check: if not admin/staff and not owner, require phone confirmation
    const isStaffOrAdmin = req.user?.role === 'admin' || req.user?.role === 'staff';
    const isOwner = req.user && req.user.id === order.userId;

    if (!isStaffOrAdmin && !isOwner && phone) {
      const cleanReqPhone = (phone as string).replace(/\s+/g, '');
      const cleanOrderPhone = order.customerPhone.replace(/\s+/g, '');
      if (!cleanOrderPhone.endsWith(cleanReqPhone.slice(-8))) {
        return res.status(403).json({ error: 'Le numéro de téléphone ne correspond pas à cette commande' });
      }
    }

    return res.json({ order });
  } catch (err) {
    console.error('Get order detail error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
});

// PATCH /api/orders/:id/status (Admin/Staff update order status)
router.patch('/:id/status', requireStaffOrAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut de commande invalide' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!currentOrder) {
        throw new Error('Commande non trouvée');
      }

      // If cancelled or returned, optionally restock variants
      if ((status === 'cancelled' || status === 'returned') && currentOrder.status !== 'cancelled' && currentOrder.status !== 'returned') {
        for (const item of currentOrder.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }

      const order = await tx.order.update({
        where: { id },
        data: {
          status,
          history: {
            create: {
              status,
              note: note || `Statut mis à jour par ${req.user?.name}`,
            },
          },
        },
        include: {
          items: true,
          history: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return order;
    });

    return res.json({ order: updated });
  } catch (err: any) {
    console.error('Update order status error:', err);
    return res.status(500).json({ error: err.message || 'Erreur lors de la mise à jour' });
  }
});

export default router;
