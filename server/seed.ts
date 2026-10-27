import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ALGERIA_WILAYAS } from './data/wilayas.js';
import { CATEGORIES_DATA } from './data/categories.js';
import { PRODUCTS_SEED } from './data/products.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MyStyle Algerian fashion database...');

  // 1. Seed Wilayas
  console.log('Seeding 58 Wilayas of Algeria...');
  for (const wilaya of ALGERIA_WILAYAS) {
    await prisma.wilaya.upsert({
      where: { code: wilaya.code },
      update: wilaya,
      create: wilaya,
    });
  }

  // 2. Seed Categories
  console.log('Seeding Categories...');
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES_DATA) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 3. Seed Users
  console.log('Seeding Users (Admin, Tailor, Staff, Customer)...');
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const clientHash = await bcrypt.hash('client1234', 10);
  const tailorHash = await bcrypt.hash('tailor1234', 10);
  const staffHash = await bcrypt.hash('staff1234', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mystyle.dz' },
    update: { role: 'admin' },
    create: {
      email: 'admin@mystyle.dz',
      name: 'Yacine Rahmani (Directeur)',
      phone: '0550123456',
      passwordHash,
      role: 'admin',
    },
  });

  const tailorUser = await prisma.user.upsert({
    where: { email: 'tailor@mystyle.dz' },
    update: { role: 'tailor' },
    create: {
      email: 'tailor@mystyle.dz',
      name: 'Maître Amine - Atelier Casbah',
      phone: '0661987654',
      passwordHash: tailorHash,
      role: 'tailor',
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@mystyle.dz' },
    update: { role: 'staff' },
    create: {
      email: 'staff@mystyle.dz',
      name: 'Nadia Benali (Service Client)',
      phone: '0770554433',
      passwordHash: staffHash,
      role: 'staff',
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@mystyle.dz' },
    update: { role: 'customer' },
    create: {
      email: 'client@mystyle.dz',
      name: 'Leila Mansouri',
      phone: '0555778899',
      passwordHash: clientHash,
      role: 'customer',
    },
  });

  // Client Address
  await prisma.address.deleteMany({ where: { userId: clientUser.id } });
  await prisma.address.create({
    data: {
      userId: clientUser.id,
      fullName: 'Leila Mansouri',
      phone: '0555778899',
      wilayaCode: 16,
      wilayaName: 'Alger',
      commune: 'Hydra',
      address: 'Résidence Les Pins, Bâtiment B, Apt 14',
      isDefault: true,
    },
  });

  // 4. Seed Discount Codes
  console.log('Seeding Discount Codes...');
  const discountCodes = [
    { code: 'SAHRA10', type: 'percentage', value: 10, minOrderDzd: 5000, active: true },
    { code: 'BIENVENUE', type: 'fixed', value: 1000, minOrderDzd: 10000, active: true },
    { code: 'EID2026', type: 'percentage', value: 15, minOrderDzd: 15000, active: true },
  ];
  for (const disc of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: disc.code },
      update: disc,
      create: disc,
    });
  }

  // 5. Seed Products & Variants
  console.log(`Seeding ${PRODUCTS_SEED.length} Products and Variants...`);
  for (const p of PRODUCTS_SEED) {
    const categoryId = categoryMap.get(p.categorySlug) || categoryMap.get('women')!;

    // Create product
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        nameFr: p.nameFr,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionFr: p.descriptionFr,
        descriptionAr: p.descriptionAr,
        descriptionEn: p.descriptionEn,
        priceDzd: p.priceDzd,
        originalPriceDzd: p.originalPriceDzd || null,
        categoryId,
        type: p.type,
        originRegion: p.originRegion || null,
        leadTimeDays: p.leadTimeDays || 14,
        isFeatured: p.isFeatured || false,
        isNew: p.isNew || false,
        isTrending: p.isTrending || false,
        images: JSON.stringify(p.images),
      },
      create: {
        slug: p.slug,
        nameFr: p.nameFr,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionFr: p.descriptionFr,
        descriptionAr: p.descriptionAr,
        descriptionEn: p.descriptionEn,
        priceDzd: p.priceDzd,
        originalPriceDzd: p.originalPriceDzd || null,
        categoryId,
        type: p.type,
        originRegion: p.originRegion || null,
        leadTimeDays: p.leadTimeDays || 14,
        isFeatured: p.isFeatured || false,
        isNew: p.isNew || false,
        isTrending: p.isTrending || false,
        images: JSON.stringify(p.images),
      },
    });

    // Delete existing variants and re-create to keep clean
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          colorNameFr: v.colorNameFr,
          colorNameAr: v.colorNameAr,
          colorNameEn: v.colorNameEn,
          colorHex: v.colorHex,
          size: v.size,
          stock: v.stock,
          sku: v.sku,
        },
      });
    }
  }

  // 6. Seed Sample Orders
  console.log('Seeding Sample Orders & History...');
  await prisma.orderItem.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.order.deleteMany({});

  const sampleProduct1 = await prisma.product.findUnique({
    where: { slug: 'burnous-royal-laine-chaoui' },
    include: { variants: true },
  });
  const sampleProduct2 = await prisma.product.findUnique({
    where: { slug: 'chemise-oxford-coton-ajustee' },
    include: { variants: true },
  });
  const sampleProduct3 = await prisma.product.findUnique({
    where: { slug: 'blouza-oranaise-dentelle-cristaux' },
    include: { variants: true },
  });

  if (sampleProduct1 && sampleProduct2) {
    // Order 1: Shipped
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'DZ-2026-08421',
        userId: clientUser.id,
        customerName: 'Leila Mansouri',
        customerPhone: '0555778899',
        wilayaCode: 16,
        wilayaName: 'Alger',
        commune: 'Hydra',
        address: 'Résidence Les Pins, Bâtiment B, Apt 14',
        deliveryType: 'home',
        paymentMethod: 'cod',
        notes: 'Appeler avant de passer svp',
        status: 'shipped',
        subtotalDzd: 36000 + 7800,
        deliveryFeeDzd: 500,
        discountDzd: 1000,
        discountCode: 'BIENVENUE',
        totalDzd: 36000 + 7800 + 500 - 1000,
        items: {
          create: [
            {
              productId: sampleProduct1.id,
              variantId: sampleProduct1.variants[0]?.id,
              title: sampleProduct1.nameFr,
              color: sampleProduct1.variants[0]?.colorNameFr,
              size: sampleProduct1.variants[0]?.size,
              priceDzd: sampleProduct1.priceDzd,
              quantity: 1,
              image: JSON.parse(sampleProduct1.images)[0],
            },
            {
              productId: sampleProduct2.id,
              variantId: sampleProduct2.variants[0]?.id,
              title: sampleProduct2.nameFr,
              color: sampleProduct2.variants[0]?.colorNameFr,
              size: sampleProduct2.variants[0]?.size,
              priceDzd: sampleProduct2.priceDzd,
              quantity: 1,
              image: JSON.parse(sampleProduct2.images)[0],
            },
          ],
        },
        history: {
          create: [
            { status: 'pending', note: 'Commande passée en ligne par le client' },
            { status: 'confirmed', note: 'Commande confirmée par téléphone par Nadia' },
            { status: 'preparing', note: 'Colis emballé avec soin dans notre atelier' },
            { status: 'shipped', note: 'Pris en charge par notre transporteur express Yalidine' },
          ],
        },
      },
    });

    // Order 2: Delivered
    if (sampleProduct3) {
      await prisma.order.create({
        data: {
          orderNumber: 'DZ-2026-07914',
          userId: clientUser.id,
          customerName: 'Leila Mansouri',
          customerPhone: '0555778899',
          wilayaCode: 31,
          wilayaName: 'Oran',
          commune: 'Akid Lotfi',
          address: 'Boulevard Millenium, Villa N° 12',
          deliveryType: 'home',
          paymentMethod: 'cod',
          status: 'delivered',
          subtotalDzd: sampleProduct3.priceDzd,
          deliveryFeeDzd: 750,
          discountDzd: 0,
          totalDzd: sampleProduct3.priceDzd + 750,
          items: {
            create: [
              {
                productId: sampleProduct3.id,
                variantId: sampleProduct3.variants[0]?.id,
                title: sampleProduct3.nameFr,
                color: sampleProduct3.variants[0]?.colorNameFr,
                size: sampleProduct3.variants[0]?.size,
                priceDzd: sampleProduct3.priceDzd,
                quantity: 1,
                image: JSON.parse(sampleProduct3.images)[0],
              },
            ],
          },
          history: {
            create: [
              { status: 'pending', note: 'Commande reçue' },
              { status: 'confirmed', note: 'Confirmation client validée' },
              { status: 'preparing', note: 'Préparation' },
              { status: 'shipped', note: 'Expédié' },
              { status: 'delivered', note: 'Colis remis en main propre et paiement encaissé' },
            ],
          },
        },
      });
    }
  }

  // 7. Seed Sample Tailoring Requests
  console.log('Seeding Sample Made-to-Order Tailoring Requests...');
  await prisma.tailoringRequest.deleteMany({});
  const karakouProduct = await prisma.product.findUnique({
    where: { slug: 'karakou-algerois-royal-majboud' },
  });
  const cheddaProduct = await prisma.product.findUnique({
    where: { slug: 'chedda-tlemcenia-imperiale' },
  });

  if (karakouProduct) {
    await prisma.tailoringRequest.create({
      data: {
        userId: clientUser.id,
        userName: 'Leila Mansouri',
        userEmail: 'client@mystyle.dz',
        userPhone: '0555778899',
        productId: karakouProduct.id,
        productTitle: karakouProduct.nameFr,
        color: 'Bordeaux Impérial',
        embroideryOption: 'Majboud Royal Haute Tradition',
        fabricVariation: 'Velours de Gênes de Soie',
        measurements: JSON.stringify({
          bust: 92,
          waist: 74,
          hips: 98,
          height: 168,
          shoulder: 40,
          sleeve: 60,
        }),
        standardSize: 'Sur-mesure',
        notes: 'Pour mon mariage prévu le 15 août. Souhaite des finitions fil d’or antique.',
        desiredDate: '2026-08-01',
        status: 'quote_sent',
        quotedPriceDzd: 52000,
        estimatedDays: 18,
        adminNotes: 'Devis préparé par Maître Amine avec 2 essayages prévus à Alger.',
      },
    });
  }

  if (cheddaProduct) {
    await prisma.tailoringRequest.create({
      data: {
        userId: clientUser.id,
        userName: 'Amina Cherif',
        userEmail: 'amina.c@gmail.com',
        userPhone: '0662334455',
        productId: cheddaProduct.id,
        productTitle: cheddaProduct.nameFr,
        color: 'Or & Rubis',
        embroideryOption: 'Fetla & Majboud avec Perles Fines',
        standardSize: '40',
        notes: 'Chedda pour fiançailles traditionnelles à Tlemcen.',
        desiredDate: '2026-09-10',
        status: 'in_production',
        quotedPriceDzd: 75000,
        estimatedDays: 25,
        adminNotes: 'Acompte reçu. Découpe des velours et perlage en cours.',
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
