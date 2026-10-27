import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice, formatDate } from '@/utils/formatters';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  Printer,
  Calendar,
  MapPin,
} from 'lucide-react';
import { OrderStatus } from '@/types';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'En attente' },
  { status: 'confirmed', label: 'Confirmée' },
  { status: 'preparing', label: 'En préparation' },
  { status: 'shipped', label: 'Expédiée' },
  { status: 'delivered', label: 'Livrée' },
];

export const OrderTrackingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const [searchParams, setSearchParams] = useSearchParams();

  const [orderNumberInput, setOrderNumberInput] = useState(searchParams.get('number') || '');
  const [phoneInput, setPhoneInput] = useState(searchParams.get('phone') || '');

  const activeNumber = searchParams.get('number');
  const activePhone = searchParams.get('phone');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['order', activeNumber, activePhone],
    queryFn: async () => {
      if (!activeNumber) return null;
      const url = `/api/orders/${activeNumber}${activePhone ? `?phone=${encodeURIComponent(activePhone)}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Commande non trouvée');
      return res.json();
    },
    enabled: Boolean(activeNumber),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;
    setSearchParams({
      number: orderNumberInput.trim().toUpperCase(),
      ...(phoneInput.trim() && { phone: phoneInput.trim() }),
    });
  };

  const order = data?.order;

  // Determine current step index
  const currentStepIndex = order ? STEPS.findIndex((s) => s.status === order.status) : -1;
  const isCancelled = order?.status === 'cancelled';
  const isReturned = order?.status === 'returned';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start space-y-8">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: 'Suivi de commande' },
        ]}
      />

      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
          {t('orders.tracking')}
        </h1>
        <p className="text-xs text-neutral-500">
          Suivez l'état de préparation et d'expédition de votre colis en temps réel à travers l'Algérie.
        </p>
      </div>

      {/* Tracking Search Input Card */}
      <div className="bg-white border border-border p-6 shadow-xs">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <Input
            label="N° de Commande"
            required
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            placeholder="Ex: DZ-2026-08421"
          />
          <Input
            label="Numéro de téléphone"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="05 / 06 / 07 ..."
          />
          <Button type="submit" variant="primary" className="py-2.5">
            <Search className="w-4 h-4 me-2" />
            <span>Suivre mon colis</span>
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-xs text-neutral-500">
          Recherche de la commande en cours...
        </div>
      )}

      {isError && (
        <div className="p-6 bg-algerian-50 border border-algerian-200 text-algerian-800 text-xs text-center space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto text-algerian-600" />
          <p className="font-semibold">Commande introuvable</p>
          <p>
            Vérifiez le numéro de commande ou le numéro de téléphone saisi.
          </p>
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Tracking Status Card */}
          <div className="bg-white border border-border p-6 sm:p-8 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border gap-4">
              <div>
                <span className="text-[11px] font-mono text-neutral-500 block uppercase">
                  Commande #{order.orderNumber}
                </span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Enregistrée le {formatDate(order.createdAt, lang)}
                </p>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className={`text-xs px-3 py-1 font-bold uppercase tracking-wider ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'shipped'
                    ? 'bg-sky-100 text-sky-800'
                    : order.status === 'cancelled'
                    ? 'bg-neutral-200 text-neutral-700 line-through'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {t(`orders.${order.status}`)}
                </span>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 border border-border text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                  title="Imprimer le bordereau"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper (for normal statuses) */}
            {!isCancelled && !isReturned && (
              <div className="relative py-4">
                <div className="hidden sm:block absolute top-7 inset-x-8 h-0.5 bg-neutral-200 z-0">
                  <div
                    className="h-full bg-forest-700 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10 text-center">
                  {STEPS.map((step, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                            isCurrent
                              ? 'bg-forest-800 text-white ring-4 ring-forest-100'
                              : isDone
                              ? 'bg-forest-700 text-white'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-forest-900 font-bold'
                              : isDone
                              ? 'text-primary'
                              : 'text-neutral-400'
                          }`}
                        >
                          {t(`orders.${step.status}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History timeline log */}
            {order.history && order.history.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-4">
                  Historique d'expédition
                </h3>
                <div className="space-y-3">
                  {order.history.map((hist: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse text-xs">
                      <div className="w-2 h-2 rounded-full bg-forest-700 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-primary uppercase text-[11px]">
                          {t(`orders.${hist.status}`)}
                        </span>
                        {hist.note && (
                          <p className="text-neutral-600 mt-0.5">{hist.note}</p>
                        )}
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatDate(hist.createdAt, lang)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Details */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-serif text-base font-bold text-primary pb-2 border-b border-border flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-forest-700" />
                <span>{t('orders.deliveryAddress')}</span>
              </h3>
              <p className="font-bold text-primary text-sm">{order.customerName}</p>
              <p className="font-mono text-neutral-600">{order.customerPhone}</p>
              <p className="text-neutral-800">{order.address}</p>
              <p className="font-semibold text-primary">
                {order.commune}, Wilaya de {order.wilayaName} ({order.wilayaCode})
              </p>
              <p className="text-neutral-500 pt-1">
                Mode de livraison : <span className="font-semibold text-primary">{order.deliveryType === 'relay' ? 'Point Relais (Stop Desk)' : 'Livraison à Domicile'}</span>
              </p>
            </div>

            {/* Total Payment Details */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-serif text-base font-bold text-primary pb-2 border-b border-border flex items-center space-x-2 rtl:space-x-reverse">
                <Truck className="w-4 h-4 text-forest-700" />
                <span>Paiement & Montant</span>
              </h3>
              <div className="flex justify-between text-neutral-600">
                <span>Sous-total articles</span>
                <span>{formatPrice(order.subtotalDzd, lang)}</span>
              </div>
              {order.discountDzd > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Remise appliquée</span>
                  <span>-{formatPrice(order.discountDzd, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Frais de livraison</span>
                <span>{formatPrice(order.deliveryFeeDzd, lang)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-primary pt-2 border-t border-border">
                <span>Total à régler</span>
                <span className="text-forest-800">{formatPrice(order.totalDzd, lang)}</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                Mode : Paiement en espèces à la livraison (Cash on Delivery)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
