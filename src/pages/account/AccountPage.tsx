import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { formatPrice, formatDate } from '@/utils/formatters';
import {
  User,
  Package,
  Scissors,
  LogOut,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Order, TailoringRequest } from '@/types';

export const AccountPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const navigate = useNavigate();
  const { user, logout, isAdmin, isTailor } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'tailoring' | 'profile'>('orders');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/account/login');
    }
  }, [user, navigate]);

  // Fetch customer orders
  const { data: ordersData, refetch: refetchOrders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const token = localStorage.getItem('mystyle_token');
      const res = await fetch('/api/orders', {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      return res.json();
    },
    enabled: Boolean(user),
  });

  // Fetch customer tailoring requests
  const { data: tailoringData, refetch: refetchTailoring } = useQuery({
    queryKey: ['my-tailoring'],
    queryFn: async () => {
      const token = localStorage.getItem('mystyle_token');
      const res = await fetch('/api/tailoring', {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      return res.json();
    },
    enabled: Boolean(user),
  });

  const orders: Order[] = ordersData?.orders || [];
  const tailoringRequests: TailoringRequest[] = tailoringData?.requests || [];

  // Customer quote action (Accept or Decline)
  const handleQuoteAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      const token = localStorage.getItem('mystyle_token');
      const res = await fetch(`/api/tailoring/${id}/customer-action`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        success(data.message);
        refetchTailoring();
      } else {
        toastError(data.error || 'Erreur');
      }
    } catch {
      toastError('Erreur de communication');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start space-y-8">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.account') },
        ]}
      />

      {/* Header with profile summary and role badges */}
      <div className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
            Espace Client MyStyle
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            {user.name}
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="forest" size="sm">
                <ShieldCheck className="w-4 h-4 me-1.5" />
                <span>Panneau Administration</span>
              </Button>
            </Link>
          )}

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5 me-1.5" />
            <span>{t('auth.logout')}</span>
          </Button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-border text-xs uppercase tracking-wider font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 rtl:space-x-reverse ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mes Commandes ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tailoring')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 rtl:space-x-reverse ${
            activeTab === 'tailoring'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <Scissors className="w-4 h-4 text-heritage-gold" />
          <span>Demandes Sur-Mesure ({tailoringRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 rtl:space-x-reverse ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-500 hover:text-primary'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil & Coordonnées</span>
        </button>
      </div>

      {/* Tab 1: Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border bg-white p-8">
              <Package className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
              <p className="font-semibold text-primary text-sm mb-1">Aucune commande enregistrée</p>
              <p className="text-xs text-neutral-500 mb-6">Découvrez nos collections pour passer votre première commande.</p>
              <Link to="/shop">
                <Button variant="primary" size="sm">Faire du shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-border p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-border gap-2">
                    <div>
                      <span className="font-mono text-sm font-bold text-primary">#{ord.orderNumber}</span>
                      <span className="text-xs text-neutral-500 ms-2">
                        Passée le {formatDate(ord.createdAt, lang)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'shipped'
                          ? 'bg-sky-100 text-sky-800'
                          : ord.status === 'cancelled'
                          ? 'bg-neutral-100 text-neutral-600 line-through'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {t(`orders.${ord.status}`)}
                      </span>

                      <Link
                        to={`/orders/track?number=${ord.orderNumber}`}
                        className="text-xs text-forest-700 hover:underline font-semibold inline-flex items-center space-x-1"
                      >
                        <span>Suivre</span>
                        <ExternalLink className="w-3.5 h-3.5 ms-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="divide-y divide-border">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-12 object-cover object-top border border-border"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-primary">{item.title}</p>
                            <p className="text-neutral-500 text-[11px]">
                              Taille: {item.size} {item.color ? `· ${item.color}` : ''} · Qté: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">
                          {formatPrice(item.priceDzd * item.quantity, lang)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row justify-between text-xs text-neutral-500 gap-2">
                    <p>
                      Livraison à {ord.commune}, W.{ord.wilayaName} ({ord.wilayaCode})
                    </p>
                    <div className="font-bold text-primary text-sm">
                      Total : {formatPrice(ord.totalDzd, lang)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Made-to-Order Tailoring Requests Tab */}
      {activeTab === 'tailoring' && (
        <div className="space-y-6">
          {tailoringRequests.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border bg-white p-8">
              <Scissors className="w-10 h-10 mx-auto text-heritage-gold mb-2" />
              <p className="font-semibold text-primary text-sm mb-1">Aucune demande de confection</p>
              <p className="text-xs text-neutral-500 mb-6">
                Personnalisez un Karakou, une Chedda ou un costume artisanal depuis la collection traditionnelle.
              </p>
              <Link to="/shop?category=traditional">
                <Button variant="primary" size="sm">Voir la collection traditionnelle</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tailoringRequests.map((req) => (
                <div key={req.id} className="bg-white border border-border p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-border gap-2">
                    <div>
                      <span className="font-serif text-base font-bold text-primary">{req.productTitle}</span>
                      <span className="text-xs text-neutral-500 block sm:inline sm:ms-2">
                        Demandé le {formatDate(req.createdAt, lang)}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xs ${
                      req.status === 'accepted' || req.status === 'ready' || req.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'quote_sent'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : req.status === 'in_production'
                        ? 'bg-sky-100 text-sky-800'
                        : req.status === 'declined' || req.status === 'cancelled'
                        ? 'bg-neutral-100 text-neutral-600 line-through'
                        : 'bg-purple-100 text-purple-900'
                    }`}>
                      {t(`tailoring.status.${req.status}`)}
                    </span>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Options</span>
                      <p className="text-neutral-700">Broderie : {req.embroideryOption || 'Standard'}</p>
                      <p className="text-neutral-700">Tissu : {req.fabricVariation || 'Classique'}</p>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Taille / Mensurations</span>
                      <p className="text-neutral-700">Taille : {req.standardSize || 'Sur-mesure'}</p>
                      {req.measurements && (
                        <p className="text-neutral-500 text-[11px]">
                          Poitrine: {req.measurements.bust || '-'} · Taille: {req.measurements.waist || '-'} · Hanches: {req.measurements.hips || '-'}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Date souhaitée</span>
                      <p className="text-neutral-700">{req.desiredDate || 'Dès que possible'}</p>
                    </div>
                  </div>

                  {/* Quote Banner & Action Trigger for Customer */}
                  {req.status === 'quote_sent' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-xs space-y-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-amber-900">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>Devis reçu de l'atelier MyStyle :</span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            Montant du devis : {formatPrice(req.quotedPriceDzd || 0, lang)}
                          </p>
                          <p className="text-neutral-600 text-[11px]">
                            Délai estimé : {req.estimatedDays || 14} jours ouvrables
                          </p>
                          {req.adminNotes && (
                            <p className="text-neutral-500 italic text-[11px] mt-1">« {req.adminNotes} »</p>
                          )}
                        </div>

                        <div className="flex space-x-2 rtl:space-x-reverse w-full sm:w-auto">
                          <Button
                            variant="forest"
                            size="sm"
                            onClick={() => handleQuoteAction(req.id, 'accept')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 me-1.5" />
                            <span>{t('tailoring.acceptQuote')}</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuoteAction(req.id, 'decline')}
                          >
                            <XCircle className="w-3.5 h-3.5 me-1.5" />
                            <span>{t('tailoring.declineQuote')}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {req.status === 'in_production' && (
                    <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center space-x-2 rtl:space-x-reverse">
                      <Scissors className="w-4 h-4 text-sky-700" />
                      <span>Votre pièce est en cours de coupe et de broderie dans notre atelier d'Alger.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile & Address */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-border p-6 sm:p-8 max-w-2xl space-y-6">
          <h2 className="font-serif text-lg font-bold text-primary pb-3 border-b border-border">
            Vos Informations Personnelles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px]">Nom complet</span>
              <p className="font-bold text-primary text-sm mt-0.5">{user.name}</p>
            </div>
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px]">Adresse E-mail</span>
              <p className="font-mono text-neutral-800 text-sm mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px]">Téléphone</span>
              <p className="font-mono text-neutral-800 text-sm mt-0.5">{user.phone || 'Non renseigné'}</p>
            </div>
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px]">Statut du compte</span>
              <p className="font-semibold text-forest-700 uppercase mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
