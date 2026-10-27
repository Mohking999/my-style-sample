import { Hono } from 'hono';
import { cors } from 'hono/cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type Bindings = {
  DB: D1Database;
  IMAGES: R2Bucket;
  JWT_SECRET?: string;
  NODE_ENV?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const DEFAULT_JWT_SECRET = 'mystyle-algeria-super-secret-key-2026-production';

// Helper: parse JWT and get user
async function getUserFromReq(c: any) {
  const authHeader = c.req.header('Authorization');
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookie
    const cookieHeader = c.req.header('Cookie') || '';
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return null;
  try {
    const secret = c.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    const decoded: any = jwt.verify(token, secret);
    return decoded;
  } catch {
    return null;
  }
}

// Helper: format product images
function formatProduct(p: any, variants: any[] = [], category: any = null) {
  let images: string[] = [];
  try {
    images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [];
  } catch {
    images = [p.images];
  }
  return {
    ...p,
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    isTrending: Boolean(p.isTrending),
    isPublished: Boolean(p.isPublished),
    images,
    category,
    variants,
  };
}

// Algerian phone validator
function isValidAlgerianPhone(phone: string): boolean {
  const clean = phone.replace(/\s+/g, '').replace(/-/g, '');
  return /^((\+213|213|0)[567][0-9]{8})$/.test(clean);
}

// -------------------------------------------------------------
// Health / Root
// -------------------------------------------------------------
app.get('/', (c) => {
  return c.json({
    status: 'online',
    service: 'MyStyle Algerian Fashion API (Cloudflare Workers + D1)',
    version: '1.0.0',
    documentation: '/api/products, /api/categories, /api/wilayas, /api/auth, /api/orders',
  });
});

// -------------------------------------------------------------
// Categories
// -------------------------------------------------------------
app.get('/api/categories', async (c) => {
  try {
    const query = `
      SELECT c.*, COUNT(p.id) as productCount 
      FROM Category c 
      LEFT JOIN Product p ON c.id = p.categoryId AND p.isPublished = 1
      GROUP BY c.id 
      ORDER BY c."order" ASC
    `;
    const res = await c.env.DB.prepare(query).all();
    return c.json(res.results || []);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Wilayas (All 58 Algerian wilayas)
// -------------------------------------------------------------
app.get('/api/wilayas', async (c) => {
  try {
    const res = await c.env.DB.prepare('SELECT * FROM Wilaya ORDER BY code ASC').all();
    const wilayas = (res.results || []).map((w: any) => ({
      ...w,
      active: Boolean(w.active),
    }));
    return c.json(wilayas);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Products
// -------------------------------------------------------------
app.get('/api/products', async (c) => {
  try {
    const url = new URL(c.req.url);
    const category = url.searchParams.get('category');
    const filter = url.searchParams.get('filter');
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');
    const sizes = url.searchParams.get('sizes');
    const colors = url.searchParams.get('colors');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const inStock = url.searchParams.get('inStock');
    const sort = url.searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '24', 10)));
    const offset = (page - 1) * limit;

    let whereClauses = ['p.isPublished = 1'];
    let params: any[] = [];

    if (category && category !== 'all') {
      whereClauses.push('c.slug = ?');
      params.push(category);
    }

    if (filter === 'new') {
      whereClauses.push('p.isNew = 1');
    } else if (filter === 'trending') {
      whereClauses.push('p.isTrending = 1');
    } else if (filter === 'sale') {
      whereClauses.push('p.originalPriceDzd IS NOT NULL AND p.originalPriceDzd > p.priceDzd');
    } else if (filter === 'traditional') {
      whereClauses.push('c.slug = ?');
      params.push('traditional');
    }

    if (type && (type === 'ready_to_wear' || type === 'made_to_order')) {
      whereClauses.push('p.type = ?');
      params.push(type);
    }

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      whereClauses.push('(p.nameFr LIKE ? OR p.nameAr LIKE ? OR p.nameEn LIKE ? OR p.descriptionFr LIKE ? OR p.originRegion LIKE ?)');
      params.push(q, q, q, q, q);
    }

    if (minPrice) {
      whereClauses.push('p.priceDzd >= ?');
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      whereClauses.push('p.priceDzd <= ?');
      params.push(Number(maxPrice));
    }

    if (sizes || colors || inStock === 'true') {
      let vWhere = ['pv.productId = p.id'];
      if (sizes) {
        const sList = sizes.split(',').map((s) => s.trim());
        const placeholders = sList.map(() => '?').join(',');
        vWhere.push(`pv.size IN (${placeholders})`);
        params.push(...sList);
      }
      if (colors) {
        const cList = colors.split(',').map((cl) => cl.trim());
        const placeholders = cList.map(() => '?').join(',');
        vWhere.push(`(pv.colorNameFr IN (${placeholders}) OR pv.colorNameAr IN (${placeholders}) OR pv.colorNameEn IN (${placeholders}))`);
        params.push(...cList, ...cList, ...cList);
      }
      if (inStock === 'true') {
        vWhere.push('pv.stock > 0');
      }
      whereClauses.push(`EXISTS (SELECT 1 FROM ProductVariant pv WHERE ${vWhere.join(' AND ')})`);
    }

    let orderBy = 'p.createdAt DESC';
    if (sort === 'price_asc') {
      orderBy = 'p.priceDzd ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'p.priceDzd DESC';
    } else if (sort === 'popularity') {
      orderBy = 'p.isTrending DESC, p.createdAt DESC';
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count query
    const countSql = `SELECT COUNT(DISTINCT p.id) as total FROM Product p LEFT JOIN Category c ON p.categoryId = c.id ${whereStr}`;
    const countRes = await c.env.DB.prepare(countSql).bind(...params).first<{ total: number }>();
    const total = countRes?.total || 0;

    // Fetch products
    const fetchSql = `
      SELECT p.*, c.id as cat_id, c.slug as cat_slug, c.nameFr as cat_nameFr, c.nameAr as cat_nameAr, c.nameEn as cat_nameEn
      FROM Product p 
      LEFT JOIN Category c ON p.categoryId = c.id 
      ${whereStr} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `;
    const fetchParams = [...params, limit, offset];
    const productsRes = await c.env.DB.prepare(fetchSql).bind(...fetchParams).all();
    const rawProducts = productsRes.results || [];

    // Fetch variants for these products
    const productIds = rawProducts.map((p: any) => p.id);
    let variantsByProduct: Record<string, any[]> = {};
    if (productIds.length > 0) {
      const pPlaceholders = productIds.map(() => '?').join(',');
      const varRes = await c.env.DB.prepare(
        `SELECT * FROM ProductVariant WHERE productId IN (${pPlaceholders})`
      ).bind(...productIds).all();

      (varRes.results || []).forEach((v: any) => {
        if (!variantsByProduct[v.productId]) variantsByProduct[v.productId] = [];
        variantsByProduct[v.productId].push(v);
      });
    }

    const products = rawProducts.map((p: any) => {
      const categoryObj = p.cat_id ? {
        id: p.cat_id,
        slug: p.cat_slug,
        nameFr: p.cat_nameFr,
        nameAr: p.cat_nameAr,
        nameEn: p.cat_nameEn,
      } : null;
      return formatProduct(p, variantsByProduct[p.id] || [], categoryObj);
    });

    return c.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('API products error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/products/:slug
app.get('/api/products/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const p: any = await c.env.DB.prepare(
      `SELECT p.*, c.id as cat_id, c.slug as cat_slug, c.nameFr as cat_nameFr, c.nameAr as cat_nameAr, c.nameEn as cat_nameEn
       FROM Product p 
       LEFT JOIN Category c ON p.categoryId = c.id 
       WHERE p.slug = ?`
    ).bind(slug).first();

    if (!p) {
      return c.json({ error: 'Produit non trouvé' }, 404);
    }

    const varRes = await c.env.DB.prepare('SELECT * FROM ProductVariant WHERE productId = ?').bind(p.id).all();
    const variants = varRes.results || [];

    // Related products in same category
    const relRes = await c.env.DB.prepare(
      `SELECT * FROM Product WHERE categoryId = ? AND id != ? AND isPublished = 1 LIMIT 4`
    ).bind(p.categoryId, p.id).all();

    const related = (relRes.results || []).map((rp: any) => formatProduct(rp, []));

    const categoryObj = p.cat_id ? {
      id: p.cat_id,
      slug: p.cat_slug,
      nameFr: p.cat_nameFr,
      nameAr: p.cat_nameAr,
      nameEn: p.cat_nameEn,
    } : null;

    const formatted = formatProduct(p, variants, categoryObj);

    return c.json({
      ...formatted,
      related,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Discounts
// -------------------------------------------------------------
app.post('/api/discounts/validate', async (c) => {
  try {
    const { code, subtotalDzd } = await c.req.json();
    if (!code || typeof code !== 'string') {
      return c.json({ valid: false, error: 'Code promo requis' }, 400);
    }

    const discount: any = await c.env.DB.prepare(
      'SELECT * FROM DiscountCode WHERE code = ? AND active = 1'
    ).bind(code.toUpperCase().trim()).first();

    if (!discount) {
      return c.json({ valid: false, error: 'Code promo invalide ou expiré' }, 400);
    }

    const subtotal = Number(subtotalDzd) || 0;
    if (subtotal < discount.minOrderDzd) {
      return c.json({
        valid: false,
        error: `Montant minimum requis de ${discount.minOrderDzd} DA pour utiliser ce code`,
      }, 400);
    }

    let discountDzd = 0;
    if (discount.type === 'percentage') {
      discountDzd = Math.round((subtotal * discount.value) / 100);
    } else {
      discountDzd = Math.min(subtotal, discount.value);
    }

    return c.json({
      valid: true,
      discountDzd,
      code: discount.code,
      message: `Code promo appliqué (-${discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} DA`})`,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Orders (Checkout)
// -------------------------------------------------------------
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
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
      items,
    } = body;

    // Validation
    if (!customerName || customerName.trim().length < 2) {
      return c.json({ error: 'Le nom complet est requis' }, 400);
    }
    if (!customerPhone || !isValidAlgerianPhone(customerPhone)) {
      return c.json({
        error: 'Numéro de téléphone algérien invalide (format: 05, 06, 07 ou +213)',
      }, 400);
    }
    if (!wilayaCode || !commune || !address) {
      return c.json({ error: 'Adresse et wilaya requises' }, 400);
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'Panier vide' }, 400);
    }

    // Wilaya fee
    const wilaya: any = await c.env.DB.prepare('SELECT * FROM Wilaya WHERE code = ?').bind(Number(wilayaCode)).first();
    if (!wilaya || !wilaya.active) {
      return c.json({ error: 'Wilaya non desservie' }, 400);
    }
    const deliveryFeeDzd = deliveryType === 'relay' ? wilaya.relayDeliveryFee : wilaya.homeDeliveryFee;

    // Verify stock & compute subtotal
    let subtotalDzd = 0;
    const verifiedItems: any[] = [];
    const stockUpdates: any[] = [];

    for (const item of items) {
      const v: any = await c.env.DB.prepare(
        `SELECT pv.*, p.nameFr, p.priceDzd, p.images 
         FROM ProductVariant pv 
         JOIN Product p ON pv.productId = p.id 
         WHERE pv.id = ?`
      ).bind(item.variantId).first();

      if (!v) {
        return c.json({ error: 'Un article n’est plus disponible' }, 400);
      }

      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (v.stock < requestedQty) {
        return c.json({
          error: `Stock insuffisant pour ${v.nameFr} (${v.size} - ${v.colorNameFr}). Restant: ${v.stock}`,
        }, 400);
      }

      subtotalDzd += v.priceDzd * requestedQty;

      let imgUrl = '';
      try {
        const imgs = JSON.parse(v.images);
        imgUrl = imgs[0] || '';
      } catch {
        imgUrl = v.images;
      }

      verifiedItems.push({
        id: crypto.randomUUID(),
        productId: v.productId,
        variantId: v.id,
        title: v.nameFr,
        color: v.colorNameFr,
        size: v.size,
        priceDzd: v.priceDzd,
        quantity: requestedQty,
        image: imgUrl,
      });

      stockUpdates.push({
        variantId: v.id,
        newStock: v.stock - requestedQty,
      });
    }

    // Apply discount
    let discountDzd = 0;
    let validDiscountCode = null;
    if (discountCode) {
      const d: any = await c.env.DB.prepare(
        'SELECT * FROM DiscountCode WHERE code = ? AND active = 1'
      ).bind(discountCode.toUpperCase().trim()).first();

      if (d && subtotalDzd >= d.minOrderDzd) {
        validDiscountCode = d.code;
        if (d.type === 'percentage') {
          discountDzd = Math.round((subtotalDzd * d.value) / 100);
        } else {
          discountDzd = Math.min(subtotalDzd, d.value);
        }
      }
    }

    const totalDzd = subtotalDzd + deliveryFeeDzd - discountDzd;
    const rand = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DZ-${new Date().getFullYear()}-${rand}`;
    const orderId = crypto.randomUUID();
    const user = await getUserFromReq(c);
    const now = Date.now();

    // D1 batch execution (atomic operations)
    const batchStatements: any[] = [];

    // Decrement stocks
    for (const su of stockUpdates) {
      batchStatements.push(
        c.env.DB.prepare('UPDATE ProductVariant SET stock = ? WHERE id = ?').bind(su.newStock, su.variantId)
      );
    }

    // Insert order
    batchStatements.push(
      c.env.DB.prepare(`
        INSERT INTO "Order" (
          id, orderNumber, userId, customerName, customerPhone, wilayaCode, wilayaName,
          commune, address, deliveryType, paymentMethod, notes, status,
          subtotalDzd, deliveryFeeDzd, discountDzd, discountCode, totalDzd, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId, orderNumber, user?.id || null, customerName, customerPhone,
        Number(wilayaCode), wilaya.nameFr, commune, address, deliveryType,
        paymentMethod, notes || null, 'pending', subtotalDzd, deliveryFeeDzd,
        discountDzd, validDiscountCode, totalDzd, now, now
      )
    );

    // Insert order items
    for (const vi of verifiedItems) {
      batchStatements.push(
        c.env.DB.prepare(`
          INSERT INTO OrderItem (id, orderId, productId, variantId, title, color, size, priceDzd, quantity, image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          vi.id, orderId, vi.productId, vi.variantId, vi.title, vi.color, vi.size, vi.priceDzd, vi.quantity, vi.image
        )
      );
    }

    // Insert order history
    batchStatements.push(
      c.env.DB.prepare(`
        INSERT INTO OrderStatusHistory (id, orderId, status, note, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), orderId, 'pending', 'Commande créée via le site', now
      )
    );

    await c.env.DB.batch(batchStatements);

    return c.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        customerName,
        customerPhone,
        wilayaName: wilaya.nameFr,
        totalDzd,
        status: 'pending',
        items: verifiedItems,
      },
    }, 201);
  } catch (err: any) {
    console.error('Order error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/orders/:orderNumber (Tracking)
app.get('/api/orders/:orderNumber', async (c) => {
  try {
    const orderNumber = c.req.param('orderNumber');
    const order: any = await c.env.DB.prepare('SELECT * FROM "Order" WHERE orderNumber = ?').bind(orderNumber).first();
    if (!order) {
      return c.json({ error: 'Commande introuvable' }, 404);
    }

    const itemsRes = await c.env.DB.prepare('SELECT * FROM OrderItem WHERE orderId = ?').bind(order.id).all();
    const historyRes = await c.env.DB.prepare('SELECT * FROM OrderStatusHistory WHERE orderId = ? ORDER BY createdAt ASC').bind(order.id).all();

    return c.json({
      ...order,
      items: itemsRes.results || [],
      history: historyRes.results || [],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/orders/user/:userId
app.get('/api/orders/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const ordersRes = await c.env.DB.prepare(
      'SELECT * FROM "Order" WHERE userId = ? ORDER BY createdAt DESC'
    ).bind(userId).all();

    const orders = ordersRes.results || [];
    for (let o of orders as any[]) {
      const items = await c.env.DB.prepare('SELECT * FROM OrderItem WHERE orderId = ?').bind(o.id).all();
      o.items = items.results || [];
    }

    return c.json(orders);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Tailoring Requests (Made-to-Order)
// -------------------------------------------------------------
app.post('/api/tailoring', async (c) => {
  try {
    const body = await c.req.json();
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
    } = body;

    if (!productId || !userName || !userPhone) {
      return c.json({ error: 'Coordonnées et produit requis' }, 400);
    }

    const product: any = await c.env.DB.prepare('SELECT * FROM Product WHERE id = ?').bind(productId).first();
    if (!product) {
      return c.json({ error: 'Produit introuvable' }, 404);
    }

    const id = crypto.randomUUID();
    const user = await getUserFromReq(c);
    const now = Date.now();
    const measurementsStr = measurements ? JSON.stringify(measurements) : null;

    await c.env.DB.prepare(`
      INSERT INTO TailoringRequest (
        id, userId, userName, userEmail, userPhone, productId, productTitle,
        measurements, standardSize, color, embroideryOption, fabricVariation,
        notes, desiredDate, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, user?.id || null, userName, userEmail || user?.email || null, userPhone,
      productId, product.nameFr, measurementsStr, standardSize || null, color || null,
      embroideryOption || null, fabricVariation || null, notes || null, desiredDate || null,
      'submitted', now, now
    ).run();

    const reqData = await c.env.DB.prepare('SELECT * FROM TailoringRequest WHERE id = ?').bind(id).first();

    return c.json({
      success: true,
      request: reqData,
      message: 'Demande transmise avec succès à l’atelier.',
    }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/tailoring/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const res = await c.env.DB.prepare(
      `SELECT tr.*, p.slug as productSlug, p.images as productImages 
       FROM TailoringRequest tr 
       JOIN Product p ON tr.productId = p.id 
       WHERE tr.userId = ? 
       ORDER BY tr.createdAt DESC`
    ).bind(userId).all();

    const requests = (res.results || []).map((tr: any) => {
      let imgs = [];
      try { imgs = JSON.parse(tr.productImages); } catch { imgs = [tr.productImages]; }
      return {
        ...tr,
        product: {
          nameFr: tr.productTitle,
          slug: tr.productSlug,
          images: imgs,
        },
      };
    });

    return c.json(requests);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/tailoring/:id/respond', async (c) => {
  try {
    const id = c.req.param('id');
    const { action } = await c.req.json();
    if (action !== 'accept' && action !== 'decline') {
      return c.json({ error: 'Action invalide' }, 400);
    }
    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    await c.env.DB.prepare('UPDATE TailoringRequest SET status = ?, updatedAt = ? WHERE id = ?').bind(newStatus, Date.now(), id).run();
    const updated = await c.env.DB.prepare('SELECT * FROM TailoringRequest WHERE id = ?').bind(id).first();
    return c.json({ success: true, request: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Authentication
// -------------------------------------------------------------
app.post('/api/auth/register', async (c) => {
  try {
    const { name, email, password, phone } = await c.req.json();
    if (!name || !email || !password || password.length < 6) {
      return c.json({ error: 'Données invalides (mot de passe min 6 caractères)' }, 400);
    }

    const existing: any = await c.env.DB.prepare('SELECT id FROM "User" WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) {
      return c.json({ error: 'Un compte existe déjà avec cette adresse email' }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const now = Date.now();

    await c.env.DB.prepare(`
      INSERT INTO "User" (id, email, passwordHash, name, phone, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, email.toLowerCase(), passwordHash, name, phone || null, 'customer', now, now).run();

    const user = { id, name, email: email.toLowerCase(), phone: phone || null, role: 'customer' };
    const secret = c.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    const token = jwt.sign(user, secret, { expiresIn: '7d' });

    return c.json({ user, token }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email et mot de passe requis' }, 400);
    }

    const user: any = await c.env.DB.prepare('SELECT * FROM "User" WHERE email = ?').bind(email.toLowerCase()).first();
    if (!user) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401);
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const secret = c.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    const token = jwt.sign(userPayload, secret, { expiresIn: '7d' });

    return c.json({ user: userPayload, token });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/auth/me', async (c) => {
  try {
    const user = await getUserFromReq(c);
    if (!user) {
      return c.json({ user: null });
    }
    const dbUser: any = await c.env.DB.prepare('SELECT id, name, email, phone, role FROM "User" WHERE id = ?').bind(user.id).first();
    return c.json({ user: dbUser || null });
  } catch (err: any) {
    return c.json({ user: null });
  }
});

app.post('/api/auth/logout', (c) => {
  return c.json({ message: 'Déconnecté' });
});

// -------------------------------------------------------------
// Admin & Staff Operations
// -------------------------------------------------------------
app.get('/api/admin/overview', async (c) => {
  try {
    const ordersRes = await c.env.DB.prepare('SELECT status, totalDzd FROM "Order"').all();
    const orders = ordersRes.results || [];

    let totalRevenueDzd = 0;
    const ordersByStatus: Record<string, number> = {
      pending: 0, confirmed: 0, preparing: 0, shipped: 0, delivered: 0, cancelled: 0, returned: 0,
    };

    orders.forEach((o: any) => {
      if (ordersByStatus[o.status] !== undefined) ordersByStatus[o.status]++;
      if (o.status !== 'cancelled' && o.status !== 'returned') totalRevenueDzd += o.totalDzd;
    });

    const [custRes, prodRes, lowStockRes, recentTailoringRes] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as c FROM "User" WHERE role = "customer"').first<{ c: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as c FROM Product').first<{ c: number }>(),
      c.env.DB.prepare(`
        SELECT pv.*, p.nameFr, p.slug 
        FROM ProductVariant pv 
        JOIN Product p ON pv.productId = p.id 
        WHERE pv.stock <= 5 
        ORDER BY pv.stock ASC 
        LIMIT 10
      `).all(),
      c.env.DB.prepare('SELECT * FROM TailoringRequest ORDER BY createdAt DESC LIMIT 5').all(),
    ]);

    return c.json({
      metrics: {
        totalRevenueDzd,
        totalOrders: orders.length,
        totalCustomers: custRes?.c || 0,
        productsCount: prodRes?.c || 0,
        ordersByStatus,
      },
      lowStockVariants: (lowStockRes.results || []).map((v: any) => ({
        ...v,
        product: { nameFr: v.nameFr, slug: v.slug },
      })),
      recentTailoring: recentTailoringRes.results || [],
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/admin/orders', async (c) => {
  try {
    const ordersRes = await c.env.DB.prepare('SELECT * FROM "Order" ORDER BY createdAt DESC').all();
    const orders = ordersRes.results || [];
    for (let o of orders as any[]) {
      const items = await c.env.DB.prepare('SELECT * FROM OrderItem WHERE orderId = ?').bind(o.id).all();
      const history = await c.env.DB.prepare('SELECT * FROM OrderStatusHistory WHERE orderId = ? ORDER BY createdAt ASC').bind(o.id).all();
      o.items = items.results || [];
      o.history = history.results || [];
    }
    return c.json(orders);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.patch('/api/admin/orders/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, note } = await c.req.json();
    const now = Date.now();

    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE "Order" SET status = ?, updatedAt = ? WHERE id = ?').bind(status, now, id),
      c.env.DB.prepare('INSERT INTO OrderStatusHistory (id, orderId, status, note, createdAt) VALUES (?, ?, ?, ?, ?)').bind(
        crypto.randomUUID(), id, status, note || `Statut mis à jour vers ${status}`, now
      ),
    ]);

    return c.json({ success: true, status });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/admin/tailoring', async (c) => {
  try {
    const res = await c.env.DB.prepare('SELECT * FROM TailoringRequest ORDER BY createdAt DESC').all();
    return c.json(res.results || []);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.patch('/api/admin/tailoring/:id/quote', async (c) => {
  try {
    const id = c.req.param('id');
    const { quotedPriceDzd, estimatedDays, adminNotes } = await c.req.json();
    const now = Date.now();

    await c.env.DB.prepare(`
      UPDATE TailoringRequest 
      SET quotedPriceDzd = ?, estimatedDays = ?, adminNotes = ?, status = 'quote_sent', updatedAt = ?
      WHERE id = ?
    `).bind(Number(quotedPriceDzd), Number(estimatedDays), adminNotes || null, now, id).run();

    const updated = await c.env.DB.prepare('SELECT * FROM TailoringRequest WHERE id = ?').bind(id).first();
    return c.json({ success: true, request: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.patch('/api/admin/tailoring/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, adminNotes } = await c.req.json();
    const now = Date.now();

    await c.env.DB.prepare(`
      UPDATE TailoringRequest 
      SET status = ?, adminNotes = COALESCE(?, adminNotes), updatedAt = ?
      WHERE id = ?
    `).bind(status, adminNotes || null, now, id).run();

    const updated = await c.env.DB.prepare('SELECT * FROM TailoringRequest WHERE id = ?').bind(id).first();
    return c.json({ success: true, request: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/admin/stock', async (c) => {
  try {
    const res = await c.env.DB.prepare(`
      SELECT pv.*, p.nameFr, p.slug 
      FROM ProductVariant pv 
      JOIN Product p ON pv.productId = p.id 
      ORDER BY pv.stock ASC
    `).all();

    const variants = (res.results || []).map((v: any) => ({
      ...v,
      product: { nameFr: v.nameFr, slug: v.slug },
    }));

    return c.json(variants);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.patch('/api/admin/stock/:variantId', async (c) => {
  try {
    const variantId = c.req.param('variantId');
    const { stock } = await c.req.json();
    await c.env.DB.prepare('UPDATE ProductVariant SET stock = ? WHERE id = ?').bind(Number(stock), variantId).run();
    return c.json({ success: true, variantId, stock: Number(stock) });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/admin/customers', async (c) => {
  try {
    const res = await c.env.DB.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.createdAt,
             COUNT(o.id) as orderCount,
             COALESCE(SUM(o.totalDzd), 0) as totalSpentDzd
      FROM "User" u
      LEFT JOIN "Order" o ON u.id = o.userId AND o.status != 'cancelled'
      GROUP BY u.id
      ORDER BY totalSpentDzd DESC
    `).all();

    return c.json(res.results || []);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.patch('/api/admin/wilayas/:code', async (c) => {
  try {
    const code = Number(c.req.param('code'));
    const { homeDeliveryFee, relayDeliveryFee, active } = await c.req.json();
    await c.env.DB.prepare(`
      UPDATE Wilaya 
      SET homeDeliveryFee = COALESCE(?, homeDeliveryFee),
          relayDeliveryFee = COALESCE(?, relayDeliveryFee),
          active = COALESCE(?, active)
      WHERE code = ?
    `).bind(
      homeDeliveryFee !== undefined ? Number(homeDeliveryFee) : null,
      relayDeliveryFee !== undefined ? Number(relayDeliveryFee) : null,
      active !== undefined ? (active ? 1 : 0) : null,
      code
    ).run();

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/admin/discounts', async (c) => {
  try {
    const { code, type, value, minOrderDzd } = await c.req.json();
    const id = crypto.randomUUID();
    const now = Date.now();

    await c.env.DB.prepare(`
      INSERT INTO DiscountCode (id, code, type, value, minOrderDzd, active, createdAt)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).bind(id, code.toUpperCase().trim(), type || 'percentage', Number(value), Number(minOrderDzd) || 0, now).run();

    return c.json({ success: true, code });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/admin/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM Product WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// -------------------------------------------------------------
// Cloudflare R2 Object Storage (Product Images - Admin Only)
// -------------------------------------------------------------
app.post('/api/upload', async (c) => {
  try {
    const user = await getUserFromReq(c);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return c.json({ error: 'Accès réservé aux administrateurs' }, 403);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return c.json({ error: 'Aucun fichier fourni' }, 400);
    }

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedMime.includes(file.type)) {
      return c.json({ error: 'Format non supporté (seuls JPG, PNG, WEBP, AVIF sont acceptés)' }, 400);
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    await c.env.IMAGES.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
      customMetadata: {
        originalName: cleanName,
        uploadedBy: user.email,
        uploadedAt: new Date().toISOString(),
      },
    });

    const publicUrl = `/api/images/${key}`;

    return c.json({
      success: true,
      key,
      url: publicUrl,
      size: file.size,
      contentType: file.type,
      message: 'Image téléversée avec succès sur Cloudflare R2',
    });
  } catch (err: any) {
    console.error('R2 upload error:', err);
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/images/* - Serve images from Cloudflare R2
app.get('/api/images/:key{.*}', async (c) => {
  try {
    const key = c.req.param('key');
    if (!key) {
      return c.json({ error: 'Clé d’image manquante' }, 400);
    }

    const object = await c.env.IMAGES.get(key);
    if (!object) {
      return c.json({ error: 'Image introuvable dans R2' }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'image/jpeg');
    }

    return new Response(object.body, { headers });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /api/images/* - Delete an image from Cloudflare R2 (Admin only)
app.delete('/api/images/:key{.*}', async (c) => {
  try {
    const user = await getUserFromReq(c);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return c.json({ error: 'Accès réservé aux administrateurs' }, 403);
    }

    const key = c.req.param('key');
    await c.env.IMAGES.delete(key);
    return c.json({ success: true, message: 'Image supprimée de Cloudflare R2' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/admin/r2/sync-catalog-photos - Populate Cloudflare R2 with all product and category photos
app.post('/api/admin/r2/sync-catalog-photos', async (c) => {
  try {
    const user = await getUserFromReq(c);
    if (!user || user.role !== 'admin') {
      return c.json({ error: 'Accès réservé aux administrateurs' }, 403);
    }

    // 1. Sync Product Photos
    const { results } = await c.env.DB.prepare('SELECT id, slug, images FROM Product').all();
    const products = results || [];

    let syncedCount = 0;
    const syncedDetails: any[] = [];

    for (const p of products as any[]) {
      let imgs: string[] = [];
      try {
        imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [];
      } catch {
        imgs = [p.images];
      }

      let modified = false;
      const newImgs: string[] = [];

      for (let i = 0; i < imgs.length; i++) {
        const url = imgs[i];
        if (url.startsWith('/api/images/')) {
          newImgs.push(url);
          continue;
        }

        const ext = 'jpg';
        const key = `products/${p.slug}-${i + 1}.${ext}`;
        try {
          const fetchRes = await fetch(url);
          if (fetchRes.ok) {
            const buffer = await fetchRes.arrayBuffer();
            const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
            await c.env.IMAGES.put(key, buffer, {
              httpMetadata: { contentType },
              customMetadata: {
                productSlug: p.slug,
                originalUrl: url,
                syncedAt: new Date().toISOString(),
              },
            });
            const r2Url = `/api/images/${key}`;
            newImgs.push(r2Url);
            modified = true;
          } else {
            newImgs.push(url);
          }
        } catch (e: any) {
          console.error(`Error syncing image ${url} for ${p.slug}:`, e);
          newImgs.push(url);
        }
      }

      if (modified) {
        await c.env.DB.prepare('UPDATE Product SET images = ? WHERE id = ?')
          .bind(JSON.stringify(newImgs), p.id)
          .run();
        syncedCount++;
        syncedDetails.push({ slug: p.slug, images: newImgs });
      }
    }

    // 2. Sync Category Photos
    const catRes = await c.env.DB.prepare('SELECT id, slug, image FROM Category').all();
    for (const cat of (catRes.results || []) as any[]) {
      if (cat.image && !cat.image.startsWith('/api/images/')) {
        const key = `categories/${cat.slug}.jpg`;
        try {
          const fetchRes = await fetch(cat.image);
          if (fetchRes.ok) {
            const buffer = await fetchRes.arrayBuffer();
            const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
            await c.env.IMAGES.put(key, buffer, {
              httpMetadata: { contentType },
              customMetadata: { categorySlug: cat.slug, syncedAt: new Date().toISOString() },
            });
            await c.env.DB.prepare('UPDATE Category SET image = ? WHERE id = ?')
              .bind(`/api/images/${key}`, cat.id)
              .run();
          }
        } catch {}
      }
    }

    return c.json({
      success: true,
      message: `${syncedCount} produits et leurs photos sont désormais hébergés sur Cloudflare R2`,
      syncedCount,
      details: syncedDetails,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;

