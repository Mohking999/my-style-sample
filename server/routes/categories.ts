import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return res.json({
      categories: categories.map((cat) => ({
        ...cat,
        productCount: cat._count.products,
      })),
    });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;
