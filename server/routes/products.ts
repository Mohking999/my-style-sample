import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to format product output
function formatProduct(product: any) {
  let images: string[] = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
  } catch {
    images = [product.images];
  }
  return {
    ...product,
    images,
  };
}

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      category,
      filter,
      type,
      search,
      sizes,
      colors,
      minPrice,
      maxPrice,
      inStock,
      sort = 'newest',
      page = '1',
      limit = '24',
    } = req.query;

    const where: any = { isPublished: true };

    // Category filter
    if (category && typeof category === 'string' && category !== 'all') {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    // Special filters
    if (filter === 'new') {
      where.isNew = true;
    } else if (filter === 'trending') {
      where.isTrending = true;
    } else if (filter === 'sale') {
      where.originalPriceDzd = { not: null, gt: 0 };
    } else if (filter === 'traditional') {
      const tradCat = await prisma.category.findUnique({ where: { slug: 'traditional' } });
      if (tradCat) where.categoryId = tradCat.id;
    }

    // Type filter
    if (type && typeof type === 'string' && (type === 'ready_to_wear' || type === 'made_to_order')) {
      where.type = type;
    }

    // Search query
    if (search && typeof search === 'string' && search.trim() !== '') {
      const query = search.trim();
      where.OR = [
        { nameFr: { contains: query } },
        { nameAr: { contains: query } },
        { nameEn: { contains: query } },
        { descriptionFr: { contains: query } },
        { originRegion: { contains: query } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      where.priceDzd = {};
      if (minPrice) where.priceDzd.gte = Number(minPrice);
      if (maxPrice) where.priceDzd.lte = Number(maxPrice);
    }

    // Variants filters: size, color, stock
    const variantWhere: any = {};
    if (sizes && typeof sizes === 'string') {
      const sizeList = sizes.split(',').map((s) => s.trim());
      variantWhere.size = { in: sizeList };
    }
    if (colors && typeof colors === 'string') {
      const colorList = colors.split(',').map((c) => c.trim());
      variantWhere.OR = [
        { colorNameFr: { in: colorList } },
        { colorNameAr: { in: colorList } },
        { colorNameEn: { in: colorList } },
      ];
    }
    if (inStock === 'true') {
      variantWhere.stock = { gt: 0 };
    }

    if (Object.keys(variantWhere).length > 0) {
      where.variants = { some: variantWhere };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { priceDzd: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { priceDzd: 'desc' };
    } else if (sort === 'popularity') {
      orderBy = { isTrending: 'desc' };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      products: products.map(formatProduct),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Related products in same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true,
      },
      include: {
        category: true,
        variants: true,
      },
      take: 4,
    });

    return res.json({
      product: formatProduct(product),
      related: related.map(formatProduct),
    });
  } catch (err) {
    console.error('Get product detail error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

// POST /api/products (Admin)
router.post('/', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = req.body;
    const imagesStr = Array.isArray(data.images) ? JSON.stringify(data.images) : data.images;

    const created = await prisma.product.create({
      data: {
        slug: data.slug || data.nameFr.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        nameFr: data.nameFr,
        nameAr: data.nameAr || data.nameFr,
        nameEn: data.nameEn || data.nameFr,
        descriptionFr: data.descriptionFr,
        descriptionAr: data.descriptionAr || data.descriptionFr,
        descriptionEn: data.descriptionEn || data.descriptionFr,
        priceDzd: Number(data.priceDzd),
        originalPriceDzd: data.originalPriceDzd ? Number(data.originalPriceDzd) : null,
        categoryId: data.categoryId,
        type: data.type || 'ready_to_wear',
        originRegion: data.originRegion || null,
        leadTimeDays: data.leadTimeDays ? Number(data.leadTimeDays) : 14,
        isFeatured: Boolean(data.isFeatured),
        isNew: Boolean(data.isNew),
        isTrending: Boolean(data.isTrending),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        images: imagesStr,
        variants: {
          create: (data.variants || []).map((v: any, idx: number) => ({
            colorNameFr: v.colorNameFr,
            colorNameAr: v.colorNameAr || v.colorNameFr,
            colorNameEn: v.colorNameEn || v.colorNameFr,
            colorHex: v.colorHex || '#111111',
            size: v.size || 'Standard',
            stock: Number(v.stock) || 0,
            sku: v.sku || `SKU-${Date.now()}-${idx}`,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return res.status(201).json({ product: formatProduct(created) });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const imagesStr = Array.isArray(data.images) ? JSON.stringify(data.images) : data.images;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nameFr: data.nameFr,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descriptionFr: data.descriptionFr,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        priceDzd: Number(data.priceDzd),
        originalPriceDzd: data.originalPriceDzd ? Number(data.originalPriceDzd) : null,
        categoryId: data.categoryId,
        type: data.type,
        originRegion: data.originRegion,
        leadTimeDays: data.leadTimeDays ? Number(data.leadTimeDays) : null,
        isFeatured: Boolean(data.isFeatured),
        isNew: Boolean(data.isNew),
        isTrending: Boolean(data.isTrending),
        isPublished: Boolean(data.isPublished),
        images: imagesStr,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return res.json({ product: formatProduct(updated) });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
