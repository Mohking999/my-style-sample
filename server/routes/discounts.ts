import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validate discount code against current cart
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotalDzd } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Code promo requis' });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!discount || !discount.active) {
      return res.status(400).json({ valid: false, message: 'Code promotionnel invalide ou inactif' });
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Ce code promotionnel a expiré' });
    }

    if (subtotalDzd < discount.minOrderDzd) {
      return res.status(400).json({
        valid: false,
        message: `Montant minimum de commande requis : ${discount.minOrderDzd} DA`,
      });
    }

    let discountDzd = 0;
    if (discount.type === 'percentage') {
      discountDzd = Math.round((subtotalDzd * discount.value) / 100);
    } else {
      discountDzd = Math.min(discount.value, subtotalDzd);
    }

    return res.json({
      valid: true,
      code: discount.code,
      discountDzd,
      message: `Code promo appliqué (-${discountDzd} DA)`,
    });
  } catch (err) {
    console.error('Validate discount error:', err);
    return res.status(500).json({ valid: false, message: 'Erreur lors de la validation du code' });
  }
});

// Admin endpoints
router.get('/', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ discounts });
  } catch (err) {
    console.error('Get discounts error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des codes promos' });
  }
});

router.post('/', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { code, type, value, minOrderDzd, expiresAt } = req.body;
    const created = await prisma.discountCode.create({
      data: {
        code: code.trim().toUpperCase(),
        type: type || 'percentage',
        value: Number(value),
        minOrderDzd: Number(minOrderDzd) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return res.status(201).json({ discount: created });
  } catch (err) {
    console.error('Create discount error:', err);
    return res.status(500).json({ error: 'Erreur lors de la création du code promo' });
  }
});

export default router;
