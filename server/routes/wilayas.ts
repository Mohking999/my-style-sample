import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/wilayas
router.get('/', async (req, res) => {
  try {
    const wilayas = await prisma.wilaya.findMany({
      orderBy: { code: 'asc' },
    });
    return res.json({ wilayas });
  } catch (err) {
    console.error('Get wilayas error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des wilayas' });
  }
});

// PUT /api/wilayas/:code (Admin)
router.put('/:code', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const code = parseInt(req.params.code, 10);
    const { homeDeliveryFee, relayDeliveryFee, active } = req.body;

    const updated = await prisma.wilaya.update({
      where: { code },
      data: {
        ...(homeDeliveryFee !== undefined && { homeDeliveryFee: Number(homeDeliveryFee) }),
        ...(relayDeliveryFee !== undefined && { relayDeliveryFee: Number(relayDeliveryFee) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return res.json({ wilaya: updated });
  } catch (err) {
    console.error('Update wilaya error:', err);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de la wilaya' });
  }
});

export default router;
