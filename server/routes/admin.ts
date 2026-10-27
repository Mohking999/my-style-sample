import { Router } from 'express';
import { prisma } from '../db.js';
import { requireStaffOrAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/overview
router.get('/overview', requireStaffOrAdmin, async (req: AuthRequest, res) => {
  try {
    const [
      totalOrders,
      orders,
      totalCustomers,
      productsCount,
      lowStockVariants,
      recentTailoring,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        select: {
          id: true,
          status: true,
          totalDzd: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.product.count(),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        include: {
          product: {
            select: { nameFr: true, slug: true, images: true },
          },
        },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
      prisma.tailoringRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { product: true },
      }),
    ]);

    // Calculate total revenue and counts by status
    let totalRevenueDzd = 0;
    const ordersByStatus: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };

    orders.forEach((o) => {
      if (ordersByStatus[o.status] !== undefined) {
        ordersByStatus[o.status]++;
      }
      if (o.status !== 'cancelled' && o.status !== 'returned') {
        totalRevenueDzd += o.totalDzd;
      }
    });

    // Top selling products by order count
    const topItems = await prisma.orderItem.groupBy({
      by: ['productId', 'title'],
      _sum: { quantity: true, priceDzd: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    return res.json({
      metrics: {
        totalRevenueDzd,
        totalOrders,
        totalCustomers,
        productsCount,
      },
      ordersByStatus,
      lowStockVariants,
      topItems,
      recentTailoring,
    });
  } catch (err) {
    console.error('Get admin overview error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// GET /api/admin/customers
router.get('/customers', requireStaffOrAdmin, async (req: AuthRequest, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { orders: true, tailoringRequests: true },
        },
        orders: {
          select: { totalDzd: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const totalSpentDzd = c.orders
        .filter((o) => o.status !== 'cancelled' && o.status !== 'returned')
        .reduce((sum, o) => sum + o.totalDzd, 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        ordersCount: c._count.orders,
        tailoringCount: c._count.tailoringRequests,
        totalSpentDzd,
      };
    });

    return res.json({ customers: formatted });
  } catch (err) {
    console.error('Get admin customers error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// GET /api/admin/stock
router.get('/stock', requireStaffOrAdmin, async (req: AuthRequest, res) => {
  try {
    const { lowStock } = req.query;
    const where: any = {};
    if (lowStock === 'true') {
      where.stock = { lte: 5 };
    }

    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: {
          select: { id: true, nameFr: true, slug: true, priceDzd: true, images: true },
        },
      },
      orderBy: [{ stock: 'asc' }, { productId: 'asc' }],
    });

    return res.json({ variants });
  } catch (err) {
    console.error('Get admin stock error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération du stock' });
  }
});

// PUT /api/admin/stock/:variantId
router.put('/stock/:variantId', requireStaffOrAdmin, async (req: AuthRequest, res) => {
  try {
    const { variantId } = req.params;
    const { stock } = req.body;

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, parseInt(stock, 10) || 0) },
      include: { product: true },
    });

    return res.json({ variant: updated });
  } catch (err) {
    console.error('Update variant stock error:', err);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
  }
});

export default router;
