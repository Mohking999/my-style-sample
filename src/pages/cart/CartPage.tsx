import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { formatPrice, getLocalized } from '@/utils/formatters';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, X } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotalDzd,
    discountCode,
    discountDzd,
    applyDiscountCode,
    removeDiscountCode,
  } = useCart();
  const { success, error: toastError } = useToast();

  const [inputCode, setInputCode] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setApplyingCode(true);
    const result = await applyDiscountCode(inputCode);
    setApplyingCode(false);
    if (result.success) {
      success(result.message);
      setInputCode('');
    } else {
      toastError(result.message);
    }
  };

  const finalTotalDzd = Math.max(0, subtotalDzd - discountDzd);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-primary mb-2">
          {t('cart.empty')}
        </h1>
        <p className="text-xs text-neutral-500 mb-8 max-w-sm mx-auto">
          {t('cart.emptyPrompt')}
        </p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('cart.continueShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('cart.title') },
        ]}
        className="mb-6"
      />

      <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-border">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          {t('cart.title')} ({items.reduce((sum, i) => sum + i.quantity, 0)})
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-algerian-600 transition-colors"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-border border-b border-border">
            {items.map((item) => {
              const title = getLocalized(item.product, 'name', lang);
              const color = getLocalized(item.variant, 'colorName', lang);
              const image = item.product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';

              return (
                <div key={item.variantId} className="py-6 flex space-x-4 sm:space-x-6 rtl:space-x-reverse">
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <img
                      src={image}
                      alt={title}
                      className="w-24 sm:w-28 aspect-product object-cover object-top border border-border"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-serif text-sm sm:text-base font-bold text-primary hover:underline line-clamp-1"
                        >
                          {title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-neutral-400 hover:text-algerian-600 transition-colors p-1"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-neutral-500 space-y-0.5 mt-1">
                        <p>
                          {t('product.selectSize')} : <span className="font-semibold text-primary">{item.variant.size}</span>
                        </p>
                        {color && (
                          <p>
                            {t('product.selectColor')} : <span className="font-semibold text-primary">{color}</span>
                          </p>
                        )}
                        <p className="font-mono text-neutral-400 text-[11px]">
                          Réf: {item.variant.sku}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-border">
                      <QuantityStepper
                        value={item.quantity}
                        max={item.variant.stock || 10}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                      />
                      <div className="text-end">
                        <span className="text-sm sm:text-base font-bold text-primary">
                          {formatPrice(item.product.priceDzd * item.quantity, lang)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[11px] text-neutral-400">
                            {formatPrice(item.product.priceDzd, lang)} / unité
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-semibold text-primary hover:underline inline-flex items-center"
            >
              ← {t('cart.continueShopping')}
            </Link>
          </div>
        </div>

        {/* Right: Order Summary & Checkout Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-surface-subtle border border-border p-6 space-y-5 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-primary pb-3 border-b border-border">
              {t('checkout.orderSummary')}
            </h2>

            {/* Promo Code Form */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Code Promotionnel
              </label>
              {discountCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">{discountCode}</span>
                    <span>(-{formatPrice(discountDzd, lang)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-emerald-700 hover:text-emerald-900 p-1"
                    aria-label="Remove code"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Ex: SAHRA10"
                    className="flex-1 bg-white border border-border px-3 py-2 text-xs uppercase focus:outline-none focus:border-primary"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={applyingCode}
                  >
                    {t('cart.applyDiscount')}
                  </Button>
                </form>
              )}
              <p className="text-[10px] text-neutral-400 mt-1">Codes disponibles : SAHRA10 (-10%), BIENVENUE (-1 000 DA)</p>
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-border text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-primary">
                  {formatPrice(subtotalDzd, lang)}
                </span>
              </div>

              {discountDzd > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Remise code promo</span>
                  <span>-{formatPrice(discountDzd, lang)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.shipping')}</span>
                <span className="text-neutral-500 italic">
                  {t('cart.calculatedAtCheckout')}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-border">
                <span>{t('cart.total')} (HT Livraison)</span>
                <span>{formatPrice(finalTotalDzd, lang)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/checkout')}
              >
                <span>{t('cart.checkout')}</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px] text-neutral-500 pt-2 border-t border-border">
              <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
              <span>Paiement à la livraison après vérification du colis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
