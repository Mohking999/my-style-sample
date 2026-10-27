import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('E2E Purchase Lifecycle Test', () => {
  let testProductId: string;
  let testVariantId: string;
  let testOrderNumber: string;
  let initialStock: number;

  beforeAll(async () => {
    // Find an in-stock variant to test
    const variant = await prisma.productVariant.findFirst({
      where: { stock: { gt: 5 } },
      include: { product: true },
    });

    if (!variant) {
      throw new Error('No test variant available in database');
    }

    testProductId = variant.productId;
    testVariantId = variant.id;
    initialStock = variant.stock;
  });

  afterAll(async () => {
    // Clean up test order if created
    if (testOrderNumber) {
      await prisma.orderItem.deleteMany({ where: { order: { orderNumber: testOrderNumber } } });
      await prisma.orderStatusHistory.deleteMany({ where: { order: { orderNumber: testOrderNumber } } });
      await prisma.order.deleteMany({ where: { orderNumber: testOrderNumber } });
    }
    await prisma.$disconnect();
  });

  it('completes the full purchase cycle from cart checkout to delivery', async () => {
    const buyQuantity = 2;

    // 1. Verify initial stock
    const variantBefore = await prisma.productVariant.findUnique({
      where: { id: testVariantId },
      include: { product: true },
    });
    expect(variantBefore?.stock).toBe(initialStock);

    // 2. Perform purchase transaction (simulating /api/orders)
    const productPrice = variantBefore!.product.priceDzd;
    const subtotal = productPrice * buyQuantity;
    const deliveryFee = 600; // Blida home delivery
    const discount = 1000; // Promo code BIENVENUE
    const total = subtotal - discount + deliveryFee;

    testOrderNumber = `TEST-DZ-${Date.now()}`;

    const order = await prisma.$transaction(async (tx) => {
      // Decrement inventory stock
      await tx.productVariant.update({
        where: { id: testVariantId },
        data: { stock: { decrement: buyQuantity } },
      });

      // Create Order
      return tx.order.create({
        data: {
          orderNumber: testOrderNumber,
          customerName: 'Test Acheteur Algérien',
          customerPhone: '0550998877',
          wilayaCode: 9,
          wilayaName: 'Blida',
          commune: 'Boufarik',
          address: 'Boulevard des Martyrs, Résidence El Bahdja',
          deliveryType: 'home',
          paymentMethod: 'cod',
          subtotalDzd: subtotal,
          deliveryFeeDzd: deliveryFee,
          discountDzd: discount,
          discountCode: 'BIENVENUE',
          totalDzd: total,
          status: 'pending',
          items: {
            create: [
              {
                productId: testProductId,
                variantId: testVariantId,
                title: variantBefore!.product.nameFr,
                color: variantBefore!.colorNameFr,
                size: variantBefore!.size,
                priceDzd: productPrice,
                quantity: buyQuantity,
              },
            ],
          },
          history: {
            create: [
              {
                status: 'pending',
                note: 'Commande enregistrée pour le test E2E',
              },
            ],
          },
        },
        include: {
          items: true,
          history: true,
        },
      });
    });

    expect(order).toBeDefined();
    expect(order.orderNumber).toBe(testOrderNumber);
    expect(order.items.length).toBe(1);
    expect(order.items[0].quantity).toBe(buyQuantity);
    expect(order.totalDzd).toBe(total);

    // 3. Verify stock was strictly decremented
    const variantAfter = await prisma.productVariant.findUnique({
      where: { id: testVariantId },
    });
    expect(variantAfter?.stock).toBe(initialStock - buyQuantity);

    // 4. Progress order through status transitions
    const transitions = [
      { status: 'confirmed', note: 'Confirmation téléphonique client' },
      { status: 'preparing', note: 'Emballage en cours' },
      { status: 'shipped', note: 'Remis au transporteur express' },
      { status: 'delivered', note: 'Colis livré et espèces reçues' },
    ];

    for (const step of transitions) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: step.status,
          history: {
            create: {
              status: step.status,
              note: step.note,
            },
          },
        },
      });
    }

    // 5. Verify final order state with history tracking
    const finalOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        history: { orderBy: { createdAt: 'asc' } },
      },
    });

    expect(finalOrder?.status).toBe('delivered');
    expect(finalOrder?.history.length).toBe(5); // pending + 4 transitions
    expect(finalOrder?.history[4].status).toBe('delivered');
  });
});
