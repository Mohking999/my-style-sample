import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/utils/formatters';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Scissors,
  Users,
  AlertTriangle,
  MapPin,
  Tag,
  ArrowLeft,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  TrendingUp,
  DollarSign,
  Truck,
  Eye,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Product, Order, TailoringRequest, Wilaya, DiscountCode } from '@/types';

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'tailoring'
  | 'stock'
  | 'customers'
  | 'wilayas'
  | 'discounts';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, isTailor, isStaff } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Enforce access control
  React.useEffect(() => {
    if (!user || (!isAdmin && !isStaff && !isTailor)) {
      navigate('/account/login');
    }
  }, [user, isAdmin, isStaff, isTailor, navigate]);

  // Auth token helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('mystyle_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // 1. Fetch Overview Data
  const { data: overviewData, refetch: refetchOverview } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await fetch('/api/admin/overview', { headers: getAuthHeaders() });
      return res.json();
    },
    enabled: Boolean(user && (isAdmin || isStaff)),
  });

  // 2. Fetch Products Data
  const { data: productsData, refetch: refetchProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100');
      return res.json();
    },
  });

  // 3. Fetch Orders Data
  const { data: ordersData, refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders', { headers: getAuthHeaders() });
      return res.json();
    },
    enabled: Boolean(user && (isAdmin || isStaff)),
  });

  // 4. Fetch Tailoring Data
  const { data: tailoringData, refetch: refetchTailoring } = useQuery({
    queryKey: ['admin-tailoring'],
    queryFn: async () => {
      const res = await fetch('/api/tailoring', { headers: getAuthHeaders() });
      return res.json();
    },
    enabled: Boolean(user && (isAdmin || isTailor)),
  });

  // 5. Fetch Customers Data
  const { data: customersData } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await fetch('/api/admin/customers', { headers: getAuthHeaders() });
      return res.json();
    },
    enabled: Boolean(user && isAdmin),
  });

  // 6. Fetch Wilayas Data
  const { data: wilayasData, refetch: refetchWilayas } = useQuery({
    queryKey: ['admin-wilayas'],
    queryFn: async () => {
      const res = await fetch('/api/wilayas');
      return res.json();
    },
  });

  // 7. Fetch Discounts Data
  const { data: discountsData, refetch: refetchDiscounts } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: async () => {
      const res = await fetch('/api/discounts', { headers: getAuthHeaders() });
      return res.json();
    },
    enabled: Boolean(user && isAdmin),
  });

  // 8. Fetch Stock Data
  const [stockFilterLow, setStockFilterLow] = useState(false);
  const { data: stockData, refetch: refetchStock } = useQuery({
    queryKey: ['admin-stock', stockFilterLow],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stock${stockFilterLow ? '?lowStock=true' : ''}`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    },
  });

  // ================= MODALS & ACTIONS ================= //

  // Order status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderNewStatus, setOrderNewStatus] = useState<string>('pending');
  const [orderStatusNote, setOrderStatusNote] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);

  // Quote modal
  const [selectedTailoring, setSelectedTailoring] = useState<TailoringRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDays, setQuoteDays] = useState('14');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // New product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [newProdNameFr, setNewProdNameFr] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdType, setNewProdType] = useState('ready_to_wear');
  const [newProdRegion, setNewProdRegion] = useState('Alger');
  const [newProdDescFr, setNewProdDescFr] = useState('');
  const [newProdImages, setNewProdImages] = useState('');
  const [newProdSizes, setNewProdSizes] = useState('S, M, L, XL');
  const [newProdColor, setNewProdColor] = useState('Noir');
  const [newProdHex, setNewProdHex] = useState('#111111');
  const [newProdStock, setNewProdStock] = useState('10');

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: orderNewStatus, note: orderStatusNote }),
      });
      if (res.ok) {
        success('Statut de commande mis à jour avec succès');
        setOrderModalOpen(false);
        refetchOrders();
        refetchOverview();
      } else {
        toastError('Erreur lors de la mise à jour');
      }
    } catch {
      toastError('Erreur de communication');
    }
  };

  // Handle Send Quote
  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTailoring) return;
    try {
      const res = await fetch(`/api/tailoring/${selectedTailoring.id}/quote`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          quotedPriceDzd: Number(quotePrice),
          estimatedDays: Number(quoteDays),
          adminNotes: quoteNotes,
        }),
      });
      if (res.ok) {
        success('Devis envoyé au client avec succès');
        setQuoteModalOpen(false);
        refetchTailoring();
        refetchOverview();
      } else {
        toastError('Erreur lors de l’envoi');
      }
    } catch {
      toastError('Erreur de communication');
    }
  };

  // Handle Quick Stock Update
  const handleUpdateStock = async (variantId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/admin/stock/${variantId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        refetchStock();
        refetchOverview();
      }
    } catch {}
  };

  // Handle Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameFr || !newProdPrice) {
      toastError('Veuillez remplir les informations obligatoires');
      return;
    }

    const sizesArr = newProdSizes.split(',').map((s) => s.trim());
    const variants = sizesArr.map((size, idx) => ({
      colorNameFr: newProdColor,
      colorNameAr: newProdColor,
      colorNameEn: newProdColor,
      colorHex: newProdHex,
      size,
      stock: Number(newProdStock) || 5,
      sku: `PROD-${Date.now().toString().slice(-4)}-${size}`,
    }));

    const imagesArr = newProdImages.trim()
      ? newProdImages.split('\n').map((url) => url.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900'];

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nameFr: newProdNameFr,
          nameAr: newProdNameAr || newProdNameFr,
          nameEn: newProdNameFr,
          descriptionFr: newProdDescFr || 'Création MyStyle confectionnée avec rigueur et élégance.',
          priceDzd: Number(newProdPrice),
          originalPriceDzd: newProdOrigPrice ? Number(newProdOrigPrice) : null,
          categoryId: newProdCategory || productsData?.products?.[0]?.categoryId,
          type: newProdType,
          originRegion: newProdRegion,
          leadTimeDays: newProdType === 'made_to_order' ? 18 : null,
          images: imagesArr,
          variants,
        }),
      });

      if (res.ok) {
        success('Nouveau produit créé et publié avec succès !');
        setProductModalOpen(false);
        refetchProducts();
        refetchOverview();
      } else {
        toastError('Erreur lors de la création');
      }
    } catch {
      toastError('Erreur de communication');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col text-start">
      {/* Top Admin Header */}
      <header className="bg-neutral-900 text-white border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>Boutique</span>
          </Link>
          <div className="h-4 w-px bg-neutral-700" />
          <span className="font-serif font-bold text-lg tracking-wider text-white">
            MYSTYLE ADMIN
          </span>
          <span className="text-[10px] bg-forest-800 text-heritage-gold px-2 py-0.5 font-mono uppercase font-bold rounded-xs">
            {user?.role}
          </span>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-neutral-300">
          <span>Connecté : <strong className="text-white">{user?.name}</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="bg-white border border-border p-2 flex flex-wrap gap-1 text-xs uppercase tracking-wider font-semibold shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes ({ordersData?.orders?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tailoring')}
            className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
              activeTab === 'tailoring'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Scissors className="w-4 h-4 text-heritage-gold" />
            <span>Sur-Mesure ({tailoringData?.requests?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue ({productsData?.pagination?.total || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
              activeTab === 'stock'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Stock & Alertes</span>
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
                  activeTab === 'customers'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clients</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wilayas')}
                className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
                  activeTab === 'wilayas'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Tarifs 58 Wilayas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('discounts')}
                className={`px-4 py-2.5 flex items-center space-x-2 rtl:space-x-reverse transition-colors ${
                  activeTab === 'discounts'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Codes Promo</span>
              </button>
            </>
          )}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-border p-6 shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
                  Chiffre d'Affaires Réalisé
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-800">
                  {formatPrice(overviewData?.metrics?.totalRevenueDzd || 0, lang)}
                </p>
                <p className="text-[11px] text-neutral-400">Paiements encaissés / en cours</p>
              </div>

              <div className="bg-white border border-border p-6 shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
                  Commandes Enregistrées
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {overviewData?.metrics?.totalOrders || 0}
                </p>
                <p className="text-[11px] text-neutral-400">À travers les 58 wilayas</p>
              </div>

              <div className="bg-white border border-border p-6 shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
                  Articles au Catalogue
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {overviewData?.metrics?.productsCount || 0}
                </p>
                <p className="text-[11px] text-neutral-400">Prêt-à-porter & Traditionnel</p>
              </div>

              <div className="bg-white border border-border p-6 shadow-xs space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
                  Clients Inscrits
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {overviewData?.metrics?.totalCustomers || 0}
                </p>
                <p className="text-[11px] text-neutral-400">Comptes actifs</p>
              </div>
            </div>

            {/* Orders Status Grid */}
            <div className="bg-white border border-border p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-primary">
                Répartition des Commandes par Statut
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                {[
                  { status: 'pending', label: 'En attente', count: overviewData?.ordersByStatus?.pending || 0, bg: 'bg-amber-50 text-amber-900 border-amber-200' },
                  { status: 'confirmed', label: 'Confirmées', count: overviewData?.ordersByStatus?.confirmed || 0, bg: 'bg-blue-50 text-blue-900 border-blue-200' },
                  { status: 'preparing', label: 'En atelier', count: overviewData?.ordersByStatus?.preparing || 0, bg: 'bg-purple-50 text-purple-900 border-purple-200' },
                  { status: 'shipped', label: 'Expédiées', count: overviewData?.ordersByStatus?.shipped || 0, bg: 'bg-sky-50 text-sky-900 border-sky-200' },
                  { status: 'delivered', label: 'Livrées', count: overviewData?.ordersByStatus?.delivered || 0, bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
                  { status: 'cancelled', label: 'Annulées', count: overviewData?.ordersByStatus?.cancelled || 0, bg: 'bg-neutral-50 text-neutral-700 border-neutral-200' },
                  { status: 'returned', label: 'Retournées', count: overviewData?.ordersByStatus?.returned || 0, bg: 'bg-red-50 text-red-900 border-red-200' },
                ].map((s) => (
                  <button
                    key={s.status}
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`p-3 border rounded-xs transition-transform hover:scale-102 ${s.bg}`}
                  >
                    <span className="font-mono text-xl font-bold block">{s.count}</span>
                    <span className="text-[11px] font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Low Stock Alert and Recent Tailoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Low stock alerts */}
              <div className="bg-white border border-border p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <h3 className="font-serif text-base font-bold text-primary flex items-center space-x-2 rtl:space-x-reverse">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Alerte Stock Faible (≤ 5 pièces)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stock')}
                    className="text-xs text-forest-700 hover:underline font-semibold"
                  >
                    Gérer
                  </button>
                </div>

                <div className="divide-y divide-border text-xs">
                  {overviewData?.lowStockVariants?.length === 0 ? (
                    <p className="py-4 text-center text-neutral-400">Aucun article en stock critique</p>
                  ) : (
                    overviewData?.lowStockVariants?.map((v: any) => (
                      <div key={v.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-primary">{v.product.nameFr}</p>
                          <p className="text-neutral-500 text-[11px]">
                            Taille: {v.size} · Couleur: {v.colorNameFr} · SKU: {v.sku}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                          {v.stock} restant(s)
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Tailoring Requests */}
              <div className="bg-white border border-border p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <h3 className="font-serif text-base font-bold text-primary flex items-center space-x-2 rtl:space-x-reverse">
                    <Scissors className="w-4 h-4 text-heritage-gold" />
                    <span>Dernières Demandes Sur-Mesure</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tailoring')}
                    className="text-xs text-forest-700 hover:underline font-semibold"
                  >
                    Voir tout
                  </button>
                </div>

                <div className="divide-y divide-border text-xs">
                  {overviewData?.recentTailoring?.length === 0 ? (
                    <p className="py-4 text-center text-neutral-400">Aucune demande en attente</p>
                  ) : (
                    overviewData?.recentTailoring?.map((r: any) => (
                      <div key={r.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-primary">{r.productTitle}</p>
                          <p className="text-neutral-500 text-[11px]">
                            Client : {r.userName} ({r.userPhone})
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700">
                          {t(`tailoring.status.${r.status}`)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">Gestion des Commandes</h2>
                <p className="text-xs text-neutral-500">Mise à jour des statuts et impression des bordereaux de livraison.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
                <RefreshCw className="w-3.5 h-3.5 me-1.5" />
                <span>Actualiser</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-3 px-4 text-start">N° Commande</th>
                    <th className="py-3 px-4 text-start">Date</th>
                    <th className="py-3 px-4 text-start">Client</th>
                    <th className="py-3 px-4 text-start">Destination</th>
                    <th className="py-3 px-4 text-end">Montant Total</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ordersData?.orders?.map((ord: Order) => (
                    <tr key={ord.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-neutral-500">
                        {formatDate(ord.createdAt, lang)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary block">{ord.customerName}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="block font-medium text-neutral-800">{ord.commune}</span>
                        <span className="text-neutral-500 text-[11px]">W.{ord.wilayaName} ({ord.wilayaCode})</span>
                      </td>
                      <td className="py-3 px-4 text-end font-bold text-primary">
                        {formatPrice(ord.totalDzd, lang)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : ord.status === 'cancelled'
                            ? 'bg-neutral-200 text-neutral-700 line-through'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {t(`orders.${ord.status}`)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end space-x-2 rtl:space-x-reverse">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(ord);
                            setOrderNewStatus(ord.status);
                            setOrderStatusNote('');
                            setOrderModalOpen(true);
                          }}
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-primary font-medium rounded-xs transition-colors"
                        >
                          Changer statut
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlipOrder(ord)}
                          className="p-1 text-neutral-600 hover:text-black"
                          title="Voir le bordereau"
                        >
                          <Printer className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TAILORING REQUESTS MANAGEMENT */}
        {activeTab === 'tailoring' && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">Atelier & Confection Sur-Mesure</h2>
                <p className="text-xs text-neutral-500">Demandes de devis, validation des confections et suivi d'atelier.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchTailoring()}>
                <RefreshCw className="w-3.5 h-3.5 me-1.5" />
                <span>Actualiser</span>
              </Button>
            </div>

            <div className="divide-y divide-border">
              {tailoringData?.requests?.map((req: TailoringRequest) => (
                <div key={req.id} className="py-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-serif text-base font-bold text-primary">{req.productTitle}</span>
                      <span className="text-xs text-neutral-500 ms-2">
                        Demandé le {formatDate(req.createdAt, lang)} par <strong>{req.userName}</strong> ({req.userPhone})
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="text-xs px-2.5 py-0.5 uppercase tracking-wider font-bold bg-neutral-100 text-neutral-800">
                        {t(`tailoring.status.${req.status}`)}
                      </span>

                      {req.status === 'submitted' && (
                        <Button
                          variant="forest"
                          size="sm"
                          onClick={() => {
                            setSelectedTailoring(req);
                            setQuotePrice('45000');
                            setQuoteDays('18');
                            setQuoteNotes('Devis avec 2 essayages inclus');
                            setQuoteModalOpen(true);
                          }}
                        >
                          Établir devis
                        </Button>
                      )}

                      {req.status === 'accepted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={async () => {
                            await fetch(`/api/tailoring/${req.id}/status`, {
                              method: 'PATCH',
                              headers: getAuthHeaders(),
                              body: JSON.stringify({ status: 'in_production' }),
                            });
                            refetchTailoring();
                          }}
                        >
                          Lancer confection
                        </Button>
                      )}

                      {req.status === 'in_production' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={async () => {
                            await fetch(`/api/tailoring/${req.id}/status`, {
                              method: 'PATCH',
                              headers: getAuthHeaders(),
                              body: JSON.stringify({ status: 'ready' }),
                            });
                            refetchTailoring();
                          }}
                        >
                          Marquer Prêt
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Request specifications */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-neutral-500 font-bold block text-[10px] uppercase">Détails demandés</span>
                      <p>Broderie : {req.embroideryOption || 'Classique'}</p>
                      <p>Tissu : {req.fabricVariation || 'Velours'}</p>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold block text-[10px] uppercase">Mensurations</span>
                      <p>Taille : {req.standardSize || 'Sur-mesure'}</p>
                      {req.measurements && (
                        <p className="text-[11px] text-neutral-600">
                          P: {req.measurements.bust || '-'} · T: {req.measurements.waist || '-'} · H: {req.measurements.hips || '-'} · L: {req.measurements.height || '-'}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold block text-[10px] uppercase">Date & Notes</span>
                      <p>Date souhaitée : {req.desiredDate || 'Flexible'}</p>
                      {req.notes && <p className="italic text-neutral-600">« {req.notes} »</p>}
                    </div>

                    <div>
                      <span className="text-neutral-500 font-bold block text-[10px] uppercase">Devis Établi</span>
                      {req.quotedPriceDzd ? (
                        <>
                          <p className="font-bold text-forest-800">{formatPrice(req.quotedPriceDzd, lang)}</p>
                          <p className="text-[11px] text-neutral-500">Délai : {req.estimatedDays} jours</p>
                        </>
                      ) : (
                        <p className="text-neutral-400 italic">Pas encore de devis</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">Catalogue & Produits</h2>
                <p className="text-xs text-neutral-500">Ajout, modification et gestion des articles et variantes.</p>
              </div>

              {isAdmin && (
                <Button variant="primary" size="sm" onClick={() => setProductModalOpen(true)}>
                  <Plus className="w-4 h-4 me-1.5" />
                  <span>Nouveau Produit</span>
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-3 px-4 text-start">Visuel</th>
                    <th className="py-3 px-4 text-start">Désignation</th>
                    <th className="py-3 px-4 text-start">Type</th>
                    <th className="py-3 px-4 text-start">Région</th>
                    <th className="py-3 px-4 text-end">Prix DZD</th>
                    <th className="py-3 px-4 text-center">Variantes</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productsData?.products?.map((p: Product) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-4">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover object-top border border-border"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-primary">
                        <Link to={`/product/${p.slug}`} className="hover:underline">
                          {p.nameFr}
                        </Link>
                        <span className="block text-[11px] text-neutral-400 font-normal">
                          {p.category?.nameFr}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800">
                          {p.type === 'made_to_order' ? 'Sur-Mesure' : 'Prêt-à-porter'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {p.originRegion || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-end font-bold text-primary">
                        {formatPrice(p.priceDzd, lang)}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono">
                        {p.variants.length} variante(s)
                      </td>
                      <td className="py-2.5 px-4 text-end space-x-2 rtl:space-x-reverse">
                        <Link
                          to={`/product/${p.slug}`}
                          className="p-1 text-neutral-500 hover:text-black inline-block"
                          title="Voir sur le site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Confirmer la suppression de ce produit ?')) {
                                await fetch(`/api/products/${p.id}`, {
                                  method: 'DELETE',
                                  headers: getAuthHeaders(),
                                });
                                refetchProducts();
                                refetchOverview();
                              }
                            }}
                            className="p-1 text-algerian-600 hover:text-algerian-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STOCK & ALERTES */}
        {activeTab === 'stock' && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">État des Stocks par Variante</h2>
                <p className="text-xs text-neutral-500">Mise à jour directe du stock pour éviter tout survente.</p>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs">
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stockFilterLow}
                    onChange={(e) => setStockFilterLow(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="font-semibold text-amber-800">
                    Afficher uniquement stock critique (≤ 5 pièces)
                  </span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-3 px-4 text-start">SKU</th>
                    <th className="py-3 px-4 text-start">Produit</th>
                    <th className="py-3 px-4 text-start">Couleur</th>
                    <th className="py-3 px-4 text-center">Taille</th>
                    <th className="py-3 px-4 text-center">Niveau de Stock</th>
                    <th className="py-3 px-4 text-end">Ajustement Rapide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stockData?.variants?.map((v: any) => (
                    <tr key={v.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-mono font-medium text-neutral-500">
                        {v.sku}
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        {v.product.nameFr}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span>{v.colorNameFr}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {v.size}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-bold px-2.5 py-1 rounded-xs ${
                          v.stock > 5
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : v.stock > 0
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {v.stock} en stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end space-x-1.5 rtl:space-x-reverse">
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(v.id, v.stock, -1)}
                          disabled={v.stock <= 0}
                          className="px-2 py-1 bg-white border border-border text-neutral-700 hover:border-black disabled:opacity-30"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(v.id, v.stock, 1)}
                          className="px-2 py-1 bg-white border border-border text-neutral-700 hover:border-black"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(v.id, v.stock, 5)}
                          className="px-2 py-1 bg-neutral-900 text-white font-bold"
                        >
                          +5
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && isAdmin && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-primary">Répertoire Clients</h2>
              <p className="text-xs text-neutral-500">Historique des commandes et dépenses cumulées par client.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-3 px-4 text-start">Nom Client</th>
                    <th className="py-3 px-4 text-start">Email</th>
                    <th className="py-3 px-4 text-start">Téléphone</th>
                    <th className="py-3 px-4 text-center">Commandes</th>
                    <th className="py-3 px-4 text-center">Sur-Mesure</th>
                    <th className="py-3 px-4 text-end">Total Dépensé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customersData?.customers?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-bold text-primary">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {c.email}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600">
                        {c.phone || '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {c.ordersCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        {c.tailoringCount}
                      </td>
                      <td className="py-3 px-4 text-end font-bold text-forest-800">
                        {formatPrice(c.totalSpentDzd, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: WILAYAS DELIVERY FEES */}
        {activeTab === 'wilayas' && isAdmin && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-primary">Tarifs de Livraison des 58 Wilayas</h2>
              <p className="text-xs text-neutral-500">Ajustement des frais de port à domicile et en point relais (Stop Desk).</p>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 sticky top-0 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-2.5 px-4 text-start">Code</th>
                    <th className="py-2.5 px-4 text-start">Wilaya</th>
                    <th className="py-2.5 px-4 text-end">Frais Domicile (DA)</th>
                    <th className="py-2.5 px-4 text-end">Frais Relais Desk (DA)</th>
                    <th className="py-2.5 px-4 text-center">Statut Desservi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {wilayasData?.wilayas?.map((w: Wilaya) => (
                    <tr key={w.code} className="hover:bg-neutral-50">
                      <td className="py-2 px-4 font-mono font-bold text-neutral-500">
                        {String(w.code).padStart(2, '0')}
                      </td>
                      <td className="py-2 px-4 font-semibold text-primary">
                        {w.nameFr} ({w.nameAr})
                      </td>
                      <td className="py-2 px-4 text-end">
                        <input
                          type="number"
                          defaultValue={w.homeDeliveryFee}
                          onBlur={async (e) => {
                            await fetch(`/api/wilayas/${w.code}`, {
                              method: 'PUT',
                              headers: getAuthHeaders(),
                              body: JSON.stringify({ homeDeliveryFee: e.target.value }),
                            });
                            refetchWilayas();
                          }}
                          className="w-24 text-end font-mono border border-border px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-4 text-end">
                        <input
                          type="number"
                          defaultValue={w.relayDeliveryFee}
                          onBlur={async (e) => {
                            await fetch(`/api/wilayas/${w.code}`, {
                              method: 'PUT',
                              headers: getAuthHeaders(),
                              body: JSON.stringify({ relayDeliveryFee: e.target.value }),
                            });
                            refetchWilayas();
                          }}
                          className="w-24 text-end font-mono border border-border px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                          Actif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: DISCOUNT CODES */}
        {activeTab === 'discounts' && isAdmin && (
          <div className="bg-white border border-border p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">Codes Promotionnels</h2>
                <p className="text-xs text-neutral-500">Gestion des remises en pourcentage ou montant fixe en dinars.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs divide-y divide-border">
                <thead className="bg-neutral-50 font-bold uppercase tracking-wider text-[11px] text-neutral-600">
                  <tr>
                    <th className="py-3 px-4 text-start">Code</th>
                    <th className="py-3 px-4 text-start">Type de remise</th>
                    <th className="py-3 px-4 text-end">Valeur</th>
                    <th className="py-3 px-4 text-end">Min. Commande</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discountsData?.discounts?.map((d: DiscountCode) => (
                    <tr key={d.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {d.code}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {d.type === 'percentage' ? 'Pourcentage (%)' : 'Montant fixe (DA)'}
                      </td>
                      <td className="py-3 px-4 text-end font-bold text-emerald-700">
                        {d.type === 'percentage' ? `${d.value}%` : `${d.value} DA`}
                      </td>
                      <td className="py-3 px-4 text-end font-mono">
                        {formatPrice(d.minOrderDzd, lang)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                          Actif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Update Order Status */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title={`Mettre à jour la commande #${selectedOrder?.orderNumber}`}
      >
        <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-start">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Nouveau Statut
            </label>
            <select
              value={orderNewStatus}
              onChange={(e) => setOrderNewStatus(e.target.value)}
              className="w-full bg-white border border-border text-xs py-2.5 px-3 focus:outline-none focus:border-primary"
            >
              <option value="pending">En attente (pending)</option>
              <option value="confirmed">Confirmée par téléphone (confirmed)</option>
              <option value="preparing">En préparation / atelier (preparing)</option>
              <option value="shipped">Expédiée transporteur (shipped)</option>
              <option value="delivered">Livrée avec succès (delivered)</option>
              <option value="cancelled">Annulée (cancelled)</option>
              <option value="returned">Retournée (returned)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Note d'historique (Visible par le client)
            </label>
            <textarea
              rows={3}
              value={orderStatusNote}
              onChange={(e) => setOrderStatusNote(e.target.value)}
              className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary"
              placeholder="Ex: Confirmation téléphonique effectuée avec Mme Mansouri, expédié avec Yalidine..."
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full">
              Enregistrer le statut
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Tailoring Quote Modal */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title={`Établir un devis pour : ${selectedTailoring?.productTitle}`}
      >
        <form onSubmit={handleSendQuote} className="space-y-4 text-start">
          <Input
            label="Prix du devis en Dinars Algériens (DZD)"
            type="number"
            required
            value={quotePrice}
            onChange={(e) => setQuotePrice(e.target.value)}
            placeholder="Ex: 48000"
          />

          <Input
            label="Délai estimé de confection (en jours ouvrables)"
            type="number"
            required
            value={quoteDays}
            onChange={(e) => setQuoteDays(e.target.value)}
            placeholder="Ex: 18"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Remarques de l'artisan pour le client
            </label>
            <textarea
              rows={3}
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
              className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary"
              placeholder="Ex: Broderie fil d'or antique comprise avec 2 essayages prévus à Alger..."
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="forest" className="w-full">
              Transmettre le devis au client
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Printable Delivery Slip */}
      <Modal
        isOpen={Boolean(slipOrder)}
        onClose={() => setSlipOrder(null)}
        title="Bordereau de Livraison"
        maxWidth="lg"
      >
        {slipOrder && (
          <div className="space-y-6 text-start p-2">
            <div className="border border-border p-6 bg-white space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div>
                  <h3 className="font-serif text-xl font-bold tracking-widest text-primary">MYSTYLE</h3>
                  <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Alger · Algérie</span>
                </div>
                <div className="text-end">
                  <span className="font-mono font-bold text-sm">{slipOrder.orderNumber}</span>
                  <span className="block text-[10px] text-neutral-400">{formatDate(slipOrder.createdAt, lang)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-400 font-bold uppercase text-[9px]">Expéditeur</span>
                  <p className="font-bold text-primary">Maison MyStyle</p>
                  <p className="text-neutral-600">Didouche Mourad, Alger Centre</p>
                  <p className="text-neutral-600 font-mono">0550 12 34 56</p>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold uppercase text-[9px]">Destinataire</span>
                  <p className="font-bold text-primary">{slipOrder.customerName}</p>
                  <p className="text-neutral-600 font-mono">{slipOrder.customerPhone}</p>
                  <p className="text-neutral-800">{slipOrder.address}</p>
                  <p className="font-bold text-primary">{slipOrder.commune}, Wilaya {slipOrder.wilayaName} ({slipOrder.wilayaCode})</p>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <span className="font-bold uppercase text-[10px] block mb-2">Contenu du colis</span>
                <div className="divide-y divide-border">
                  {slipOrder.items?.map((item: any) => (
                    <div key={item.id} className="py-1.5 flex justify-between">
                      <span>{item.title} ({item.size} {item.color ? `· ${item.color}` : ''}) × {item.quantity}</span>
                      <span className="font-mono">{formatPrice(item.priceDzd * item.quantity, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-neutral-900 pt-3 flex justify-between font-bold text-sm">
                <span>MONTANT À ENCAISSER EN ESPÈCES (COD) :</span>
                <span className="text-forest-800 font-mono text-base">{formatPrice(slipOrder.totalDzd, lang)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={() => setSlipOrder(null)}>
                Fermer
              </Button>
              <Button variant="primary" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 me-1.5" />
                <span>Imprimer le bordereau</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: Create Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title="Créer un Nouveau Produit"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nom du produit (Français)"
              required
              value={newProdNameFr}
              onChange={(e) => setNewProdNameFr(e.target.value)}
              placeholder="Ex: Caftan de Soie Brodé"
            />
            <Input
              label="Nom du produit (Arabe)"
              value={newProdNameAr}
              onChange={(e) => setNewProdNameAr(e.target.value)}
              placeholder="Ex: قفطان حريري مطرز"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Prix de vente (DA)"
              type="number"
              required
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
              placeholder="Ex: 24000"
            />
            <Input
              label="Prix d'origine / Barré (Optionnel)"
              type="number"
              value={newProdOrigPrice}
              onChange={(e) => setNewProdOrigPrice(e.target.value)}
              placeholder="Ex: 28000"
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Type de vêtement
              </label>
              <select
                value={newProdType}
                onChange={(e) => setNewProdType(e.target.value)}
                className="w-full bg-white border border-border text-xs py-2.5 px-3 focus:outline-none focus:border-primary"
              >
                <option value="ready_to_wear">Prêt-à-porter</option>
                <option value="made_to_order">Sur-Mesure Artisanal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Région d'origine (Ex: Tlemcen, Alger...)"
              value={newProdRegion}
              onChange={(e) => setNewProdRegion(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Tailles générées (séparées par virgules)
              </label>
              <input
                type="text"
                value={newProdSizes}
                onChange={(e) => setNewProdSizes(e.target.value)}
                className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary"
                placeholder="38, 40, 42..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Nom couleur"
              value={newProdColor}
              onChange={(e) => setNewProdColor(e.target.value)}
              placeholder="Noir"
            />
            <Input
              label="Code Hex couleur"
              value={newProdHex}
              onChange={(e) => setNewProdHex(e.target.value)}
              placeholder="#111111"
            />
            <Input
              label="Stock par taille"
              type="number"
              value={newProdStock}
              onChange={(e) => setNewProdStock(e.target.value)}
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              URL(s) des photos (une par ligne)
            </label>
            <textarea
              rows={2}
              value={newProdImages}
              onChange={(e) => setNewProdImages(e.target.value)}
              className="w-full bg-white border border-border text-xs p-2.5 font-mono focus:outline-none focus:border-primary"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Description & Composition
            </label>
            <textarea
              rows={3}
              value={newProdDescFr}
              onChange={(e) => setNewProdDescFr(e.target.value)}
              className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary"
              placeholder="Matière, coupe, finitions..."
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full">
              Créer et ajouter au catalogue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
