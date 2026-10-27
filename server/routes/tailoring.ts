import { Router } from 'express';
import { prisma } from '../db.js';
import { AuthRequest, requireAuth, requireTailorOrAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/tailoring - Customer submits a request
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      productId,
      userName,
      userEmail,
      userPhone,
      standardSize,
      measurements,
      color,
      embroideryOption,
      fabricVariation,
      notes,
      desiredDate,
    } = req.body;

    if (!productId || !userName || !userPhone) {
      return res.status(400).json({ error: 'Veuillez renseigner vos coordonnées et le vêtement souhaité' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }

    const measurementsStr = measurements ? JSON.stringify(measurements) : null;

    const request = await prisma.tailoringRequest.create({
      data: {
        userId: req.user?.id || null,
        userName,
        userEmail: userEmail || req.user?.email || null,
        userPhone,
        productId,
        productTitle: product.nameFr,
        standardSize: standardSize || null,
        measurements: measurementsStr,
        color: color || null,
        embroideryOption: embroideryOption || null,
        fabricVariation: fabricVariation || null,
        notes: notes || null,
        desiredDate: desiredDate || null,
        status: 'submitted',
      },
      include: {
        product: true,
      },
    });

    return res.status(201).json({
      success: true,
      request,
      message: 'Votre demande de confection a été transmise à nos maîtres tailleurs.',
    });
  } catch (err) {
    console.error('Create tailoring request error:', err);
    return res.status(500).json({ error: 'Erreur lors de l’envoi de votre demande' });
  }
});

// GET /api/tailoring - Get list of requests
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const isTailorOrAdmin = req.user?.role === 'admin' || req.user?.role === 'tailor';
    const where = isTailorOrAdmin ? {} : { userId: req.user!.id };

    const requests = await prisma.tailoringRequest.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      requests: requests.map((r) => {
        let measurementsObj = null;
        try {
          if (r.measurements) measurementsObj = JSON.parse(r.measurements);
        } catch {}
        return {
          ...r,
          measurements: measurementsObj,
        };
      }),
    });
  } catch (err) {
    console.error('Get tailoring requests error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
});

// PATCH /api/tailoring/:id/quote (Tailor/Admin sets quoted price & lead time)
router.patch('/:id/quote', requireTailorOrAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quotedPriceDzd, estimatedDays, adminNotes } = req.body;

    if (!quotedPriceDzd || quotedPriceDzd <= 0) {
      return res.status(400).json({ error: 'Le prix du devis doit être supérieur à zéro' });
    }

    const updated = await prisma.tailoringRequest.update({
      where: { id },
      data: {
        status: 'quote_sent',
        quotedPriceDzd: Number(quotedPriceDzd),
        estimatedDays: estimatedDays ? Number(estimatedDays) : 14,
        adminNotes: adminNotes || null,
      },
      include: { product: true },
    });

    return res.json({ request: updated, message: 'Devis envoyé au client avec succès' });
  } catch (err) {
    console.error('Send quote error:', err);
    return res.status(500).json({ error: 'Erreur lors de l’envoi du devis' });
  }
});

// PATCH /api/tailoring/:id/customer-action (Customer accepts or declines quote)
router.patch('/:id/customer-action', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'decline'

    const existing = await prisma.tailoringRequest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    if (existing.status !== 'quote_sent') {
      return res.status(400).json({ error: 'Action impossible sur ce statut de devis' });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    const updated = await prisma.tailoringRequest.update({
      where: { id },
      data: { status: newStatus },
      include: { product: true },
    });

    return res.json({
      request: updated,
      message: action === 'accept' ? 'Devis accepté ! Nos ateliers vont débuter la confection.' : 'Devis décliné.',
    });
  } catch (err) {
    console.error('Customer quote action error:', err);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// PATCH /api/tailoring/:id/status (Tailor/Admin updates production status)
router.patch('/:id/status', requireTailorOrAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const valid = [
      'submitted',
      'quote_sent',
      'accepted',
      'in_production',
      'ready',
      'shipped',
      'delivered',
      'declined',
      'cancelled',
    ];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const updated = await prisma.tailoringRequest.update({
      where: { id },
      data: {
        status,
        ...(adminNotes && { adminNotes }),
      },
      include: { product: true },
    });

    return res.json({ request: updated });
  } catch (err) {
    console.error('Update tailoring status error:', err);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

export default router;
