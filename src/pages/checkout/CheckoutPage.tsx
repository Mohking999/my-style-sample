import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { formatPrice, getLocalized } from '@/utils/formatters';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Building2,
  Banknote,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Printer,
} from 'lucide-react';
import { Wilaya } from '@/types';

export const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const navigate = useNavigate();
  const { items, subtotalDzd, discountCode, discountDzd, clearCart } = useCart();
  const { user } = useAuth();
  const { error: toastError } = useToast();

  // Fetch Wilayas from API
  const { data: wilayasData, isLoading: loadingWilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const res = await fetch('/api/wilayas');
      return res.json();
    },
  });

  const wilayas: Wilaya[] = wilayasData?.wilayas || [];

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Default 16: Alger
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'relay'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Success state after order placed
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Selected wilaya record
  const selectedWilaya = wilayas.find((w) => w.code === Number(selectedWilayaCode));
  const deliveryFeeDzd = selectedWilaya
    ? deliveryType === 'relay'
      ? selectedWilaya.relayDeliveryFee
      : selectedWilaya.homeDeliveryFee
    : 500;

  const totalDzd = Math.max(0, subtotalDzd - discountDzd + deliveryFeeDzd);

  useEffect(() => {
    if (placedOrder) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [placedOrder]);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary mb-2">Votre panier est vide</h2>
        <p className="text-xs text-neutral-500 mb-6">Ajoutez des pièces à votre panier avant de finaliser votre commande.</p>
        <Link to="/shop">
          <Button variant="primary" size="sm">Découvrir la boutique</Button>
        </Link>
      </div>
    );
  }

  // Order Confirmation View
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-start space-y-8 animate-in fade-in duration-300">
        <div className="bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">
            {t('orders.orderPlaced')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
            {t('orders.thankYou')} Notre service client vous appellera sous peu pour confirmer l'expédition vers votre wilaya.
          </p>
          <div className="inline-block bg-white px-4 py-2 border border-emerald-300 font-mono text-sm font-bold text-primary">
            N° de commande : {placedOrder.orderNumber}
          </div>
        </div>

        {/* Order Details Slip Box */}
        <div className="bg-white border border-border p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-primary">MYSTYLE</span>
              <span className="block text-[9px] text-neutral-400 font-mono">Bordereau d'expédition · Algérie</span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-600 hover:text-black border border-border px-3 py-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-neutral-400 uppercase font-semibold text-[10px]">Destinataire</p>
              <p className="font-bold text-primary text-sm mt-0.5">{placedOrder.customerName}</p>
              <p className="font-mono text-neutral-600">{placedOrder.customerPhone}</p>
            </div>
            <div>
              <p className="text-neutral-400 uppercase font-semibold text-[10px]">Adresse de livraison</p>
              <p className="text-neutral-800 mt-0.5">{placedOrder.address}</p>
              <p className="text-neutral-800 font-semibold">{placedOrder.commune}, W.{placedOrder.wilayaName} ({placedOrder.wilayaCode})</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Mode : {placedOrder.deliveryType === 'relay' ? 'Point Relais (Stop Desk)' : 'À Domicile'}
              </p>
            </div>
          </div>

          {/* Items summary */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs uppercase font-bold text-neutral-700 mb-3">Articles commandés</h4>
            <div className="divide-y divide-border">
              {placedOrder.items?.map((item: any) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-primary">{item.title}</span>
                    <span className="text-neutral-500 ms-2">({item.size} {item.color ? `· ${item.color}` : ''}) × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(item.priceDzd * item.quantity, lang)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Sous-total articles</span>
              <span>{formatPrice(placedOrder.subtotalDzd, lang)}</span>
            </div>
            {placedOrder.discountDzd > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Remise ({placedOrder.discountCode})</span>
                <span>-{formatPrice(placedOrder.discountDzd, lang)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Frais de livraison</span>
              <span>{formatPrice(placedOrder.deliveryFeeDzd, lang)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-border">
              <span>Montant à régler au livreur</span>
              <span>{formatPrice(placedOrder.totalDzd, lang)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/orders/track?number=${placedOrder.orderNumber}&phone=${encodeURIComponent(placedOrder.customerPhone)}`} className="flex-1">
            <Button variant="primary" size="lg" className="w-full">
              {t('orders.trackOrder')}
            </Button>
          </Link>
          <Link to="/shop" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              {t('cart.continueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle Checkout submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !commune.trim() || !address.trim()) {
      toastError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        wilayaCode: Number(selectedWilayaCode),
        commune,
        address,
        deliveryType,
        paymentMethod,
        notes,
        discountCode,
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setPlacedOrder(data.order);
        clearCart();
      } else {
        toastError(data.error || 'Erreur lors de la validation');
      }
    } catch {
      toastError('Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
    }
  };

  const wilayaOptions = wilayas.map((w) => ({
    value: w.code,
    label: `${String(w.code).padStart(2, '0')} - ${w.nameFr} (${w.nameAr})`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('cart.title'), href: '/cart' },
          { label: t('checkout.title') },
        ]}
        className="mb-6"
      />

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-8 pb-4 border-b border-border">
        {t('checkout.title')}
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Client Information */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-base font-bold text-primary flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-sans">
                  1
                </span>
                <span>{t('checkout.shippingInfo')}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('checkout.fullName')}
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Mourad Belkacem"
                />

                <Input
                  label={t('checkout.phone')}
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="05 / 06 / 07 ..."
                  helperText={t('checkout.phoneHint')}
                />
              </div>

              {/* Wilaya Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label={t('checkout.wilaya')}
                    required
                    options={wilayaOptions}
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                  />
                </div>

                <Input
                  label={t('checkout.commune')}
                  required
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  placeholder="Ex: Bab El Oued, Kouba..."
                />
              </div>

              <Input
                label={t('checkout.address')}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Numéro, rue, bâtiment, étage..."
              />
            </div>

            {/* Step 2: Delivery Mode */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-base font-bold text-primary flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-sans">
                  2
                </span>
                <span>{t('checkout.deliveryType')}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                    deliveryType === 'home'
                      ? 'border-primary bg-surface-subtle ring-1 ring-primary'
                      : 'border-border hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'home'}
                        onChange={() => setDeliveryType('home')}
                        className="accent-primary"
                      />
                      <span className="font-bold text-primary">{t('checkout.homeDelivery')}</span>
                    </div>
                    <Truck className="w-4 h-4 text-neutral-500" />
                  </div>
                  <p className="text-neutral-500 mt-2">
                    Livré directement chez vous par Yalidine Express.
                  </p>
                  <span className="mt-3 font-semibold text-primary">
                    {formatPrice(selectedWilaya?.homeDeliveryFee || 600, lang)}
                  </span>
                </label>

                <label
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                    deliveryType === 'relay'
                      ? 'border-primary bg-surface-subtle ring-1 ring-primary'
                      : 'border-border hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'relay'}
                        onChange={() => setDeliveryType('relay')}
                        className="accent-primary"
                      />
                      <span className="font-bold text-primary">{t('checkout.relayDelivery')}</span>
                    </div>
                    <Building2 className="w-4 h-4 text-neutral-500" />
                  </div>
                  <p className="text-neutral-500 mt-2">
                    Récupération au bureau relais de votre wilaya.
                  </p>
                  <span className="mt-3 font-semibold text-primary">
                    {formatPrice(selectedWilaya?.relayDeliveryFee || 350, lang)}
                  </span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-base font-bold text-primary flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-sans">
                  3
                </span>
                <span>{t('checkout.paymentMethod')}</span>
              </h2>

              <div className="space-y-3 text-xs">
                <label className="p-4 border border-primary bg-surface-subtle ring-1 ring-primary flex items-start space-x-3 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-primary">{t('checkout.cod')}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-xs">
                        Recommandé
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-1">
                      {t('checkout.codDesc')}
                    </p>
                  </div>
                </label>

                <div className="p-4 border border-border bg-neutral-50 opacity-60 flex items-start space-x-3 rtl:space-x-reverse">
                  <input type="radio" disabled className="mt-1" />
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <CreditCard className="w-4 h-4 text-neutral-400" />
                      <span className="font-bold text-neutral-500">{t('checkout.card')}</span>
                      <span className="text-[10px] bg-neutral-200 text-neutral-600 font-bold px-1.5 py-0.5 rounded-xs">
                        Bientôt disponible
                      </span>
                    </div>
                    <p className="text-neutral-400 mt-0.5">
                      Paiement en ligne par carte interbancaire CIB et Edahabia.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                  {t('checkout.orderNotes')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary placeholder-neutral-400"
                  placeholder="Ex: Sonner à l'interphone 14, disponible à partir de 14h..."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Submit (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-subtle border border-border p-6 space-y-6 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-primary pb-3 border-b border-border">
                {t('checkout.orderSummary')}
              </h2>

              {/* Items overview */}
              <div className="divide-y divide-border max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-12 object-cover object-top border border-border shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-primary line-clamp-1">
                          {getLocalized(item.product, 'name', lang)}
                        </p>
                        <p className="text-neutral-500 text-[11px]">
                          {item.variant.size} · Qté: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary shrink-0">
                      {formatPrice(item.product.priceDzd * item.quantity, lang)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-border text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(subtotalDzd, lang)}
                  </span>
                </div>

                {discountDzd > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Remise ({discountCode})</span>
                    <span>-{formatPrice(discountDzd, lang)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>
                    Frais de livraison ({selectedWilaya?.nameFr || 'Wilaya'})
                  </span>
                  <span className="font-semibold text-primary">
                    {formatPrice(deliveryFeeDzd, lang)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-border">
                  <span>{t('cart.total')} (TTC)</span>
                  <span className="text-forest-800 text-lg">
                    {formatPrice(totalDzd, lang)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                variant="forest"
                size="lg"
                className="w-full py-4 text-xs font-bold uppercase tracking-widest"
                isLoading={submitting}
              >
                <span>{submitting ? t('checkout.submitting') : t('checkout.placeOrder')}</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Button>

              <div className="space-y-2 pt-2 border-t border-border text-[11px] text-neutral-500">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vérification du colis avant paiement au livreur</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Truck className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Livraison assurée dans les 58 Wilayas d'Algérie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
