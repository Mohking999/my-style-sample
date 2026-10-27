import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/context/CartContext';
import { formatPrice, getLocalized } from '@/utils/formatters';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeItem,
    updateQuantity,
    subtotalDzd,
  } = useCart();

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => setIsCartDrawerOpen(false)}
      title={`${t('cart.title')} (${items.reduce((s, i) => s + i.quantity, 0)})`}
      position="end"
      width="md"
    >
      <div className="flex flex-col h-full justify-between">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-auto py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-primary mb-1">
              {t('cart.empty')}
            </p>
            <p className="text-xs text-neutral-500 mb-6 max-w-xs">
              {t('cart.emptyPrompt')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartDrawerOpen(false)}
            >
              {t('cart.continueShopping')}
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="divide-y divide-border overflow-y-auto pr-1 -mr-1 flex-1">
              {items.map((item) => {
                const title = getLocalized(item.product, 'name', lang);
                const color = getLocalized(item.variant, 'colorName', lang);
                const image = item.product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400';

                return (
                  <div key={item.variantId} className="py-4 flex space-x-4 rtl:space-x-reverse">
                    <img
                      src={image}
                      alt={title}
                      className="w-20 h-24 object-cover object-top border border-border shrink-0 bg-neutral-100"
                    />
                    <div className="flex-1 flex flex-col justify-between text-start">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline line-clamp-1"
                          >
                            {title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="text-neutral-400 hover:text-algerian-600 transition-colors p-1 -mt-1 -mr-1"
                            aria-label={t('cart.remove')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          {t('product.selectSize')}: <span className="font-medium text-primary">{item.variant.size}</span>
                          {color && (
                            <>
                              {' '}· {color}
                            </>
                          )}
                        </p>
                        <p className="text-xs font-semibold text-primary mt-1">
                          {formatPrice(item.product.priceDzd, lang)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-border">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          max={item.variant.stock || 10}
                          onChange={(qty) => updateQuantity(item.variantId, qty)}
                        />
                        <span className="text-xs font-bold text-primary">
                          {formatPrice(item.product.priceDzd * item.quantity, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom footer */}
            <div className="pt-4 border-t border-border mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-500">{t('cart.subtotal')}</span>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(subtotalDzd, lang)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-4">
                {t('cart.shipping')} : {t('cart.calculatedAtCheckout')}
              </p>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full inline-flex items-center justify-center bg-primary text-white py-3 px-4 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full inline-flex items-center justify-center border border-border text-primary py-2.5 px-4 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                >
                  {t('cart.title')}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
