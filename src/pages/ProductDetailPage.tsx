import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductCard } from '@/components/product/ProductCard';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { getLocalized } from '@/utils/formatters';
import {
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [tailoringModalOpen, setTailoringModalOpen] = useState(false);

  // Tailoring form state
  const [tailorName, setTailorName] = useState(user?.name || '');
  const [tailorPhone, setTailorPhone] = useState(user?.phone || '');
  const [tailorEmail, setTailorEmail] = useState(user?.email || '');
  const [tailorStandardSize, setTailorStandardSize] = useState('Standard');
  const [tailorEmbroidery, setTailorEmbroidery] = useState('Majboud Royal');
  const [tailorFabric, setTailorFabric] = useState('Velours');
  const [tailorDesiredDate, setTailorDesiredDate] = useState('');
  const [tailorNotes, setTailorNotes] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [height, setHeight] = useState('');
  const [tailoringSubmitting, setTailoringSubmitting] = useState(false);

  // Selected variant state
  const [selectedColorHex, setSelectedColorHex] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch product from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
  });

  const product: Product | undefined = data?.product || (data?.id ? (data as unknown as Product) : undefined);
  const relatedProducts: Product[] = data?.related || [];

  // Initialize selected variant once product loads
  React.useEffect(() => {
    if (product && Array.isArray(product.variants) && product.variants.length > 0) {
      const firstInStock = product.variants.find((v) => v.stock > 0) || product.variants[0];
      setSelectedColorHex(firstInStock.colorHex);
      setSelectedSize(firstInStock.size);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-3 text-xs text-neutral-500">Chargement de votre création...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-serif font-bold text-primary mb-2">Produit non trouvé</h2>
        <p className="text-xs text-neutral-500 mb-6">La création que vous recherchez n’est plus disponible ou a été déplacée.</p>
        <Link to="/shop">
          <Button variant="primary" size="sm">Retourner à la boutique</Button>
        </Link>
      </div>
    );
  }

  const name = getLocalized(product, 'name', lang);
  const description = getLocalized(product, 'description', lang);
  const isFav = isInWishlist(product.id);

  // Color options
  const colorMap = new Map<string, { id: string; name: string; hex: string }>();
  product.variants.forEach((v) => {
    if (!colorMap.has(v.colorHex)) {
      colorMap.set(v.colorHex, {
        id: v.colorHex,
        name: getLocalized(v, 'colorName', lang),
        hex: v.colorHex,
      });
    }
  });
  const colorOptions = Array.from(colorMap.values());

  // Size options for currently selected color
  const filteredVariants = product.variants.filter((v) => v.colorHex === selectedColorHex);
  const sizeOptions = filteredVariants.map((v) => ({
    size: v.size,
    inStock: v.stock > 0,
    stockCount: v.stock,
  }));

  // Selected variant
  const currentVariant = filteredVariants.find((v) => v.size === selectedSize) || filteredVariants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    if (currentVariant.stock <= 0) {
      toastError(t('product.outOfStock'));
      return;
    }
    const added = addItem(product, currentVariant, quantity);
    if (added) {
      success(`${name} (${currentVariant.size}) ajouté au panier !`);
    }
  };

  const handleTailoringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTailoringSubmitting(true);
    try {
      const res = await fetch('/api/tailoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: tailorName,
          userEmail: tailorEmail,
          userPhone: tailorPhone,
          standardSize: tailorStandardSize,
          embroideryOption: tailorEmbroidery,
          fabricVariation: tailorFabric,
          desiredDate: tailorDesiredDate,
          notes: tailorNotes,
          measurements: {
            bust: bust ? Number(bust) : undefined,
            waist: waist ? Number(waist) : undefined,
            hips: hips ? Number(hips) : undefined,
            height: height ? Number(height) : undefined,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        success('Votre demande de confection sur-mesure a été enregistrée avec succès !');
        setTailoringModalOpen(false);
        navigate('/account');
      } else {
        toastError(data.error || 'Erreur lors de l’envoi');
      }
    } catch {
      toastError('Erreur de connexion au serveur');
    } finally {
      setTailoringSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.shop'), href: '/shop' },
          ...(product.category
            ? [{ label: getLocalized(product.category, 'name', lang), href: `/shop?category=${product.category.slug}` }]
            : []),
          { label: name },
        ]}
        className="mb-8"
      />

      {/* Main product view (Gallery + Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={name} />
        </div>

        {/* Right: Product Details & Buying Actions (5 cols) */}
        <div className="lg:col-span-5 text-start flex flex-col space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {product.type === 'made_to_order' ? (
                <Badge variant="traditional">{t('product.madeToOrder')}</Badge>
              ) : (
                <Badge variant="neutral">{t('product.readyToWear')}</Badge>
              )}
              {product.originRegion && (
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-border">
                  Origine : {product.originRegion}
                </span>
              )}
              {product.originalPriceDzd && product.originalPriceDzd > product.priceDzd && (
                <Badge variant="sale">{t('nav.sale')}</Badge>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {name}
            </h1>

            <div className="mt-3">
              <PriceTag
                priceDzd={product.priceDzd}
                originalPriceDzd={product.originalPriceDzd}
                size="xl"
              />
            </div>
          </div>

          {/* Made-to-order notice banner */}
          {product.type === 'made_to_order' && (
            <div className="p-3.5 bg-forest-50 border border-forest-100 text-forest-900 rounded-xs space-y-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse font-semibold text-xs">
                <Clock className="w-4 h-4 text-forest-700" />
                <span>
                  {t('product.leadTime')} : {product.leadTimeDays || 14} {t('product.days')}
                </span>
              </div>
              <p className="text-[11px] text-forest-800 leading-relaxed ps-6">
                Confection artisanale sur-mesure dans nos ateliers. Vous recevrez un devis personnalisé et un tailleur prendra vos mesures.
              </p>
            </div>
          )}

          {/* Color Selection */}
          {colorOptions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium uppercase tracking-wider text-neutral-700">
                  {t('product.selectColor')} :
                </span>
                <span className="font-semibold text-primary">
                  {colorOptions.find((c) => c.hex === selectedColorHex)?.name}
                </span>
              </div>
              <ColorSwatch
                options={colorOptions}
                selectedId={selectedColorHex}
                onSelect={(hex) => setSelectedColorHex(hex)}
                size="md"
              />
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium uppercase tracking-wider text-neutral-700">
                {t('product.selectSize')} :
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-neutral-500 hover:text-primary underline text-[11px] inline-flex items-center space-x-1 rtl:space-x-reverse"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('product.sizeGuide')}</span>
              </button>
            </div>

            <SizeSelector
              sizes={sizeOptions}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
            />

            {/* Stock status indicator */}
            {currentVariant && product.type === 'ready_to_wear' && (
              <div className="pt-1 flex items-center text-xs space-x-1.5 rtl:space-x-reverse">
                {currentVariant.stock > 5 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">{t('product.inStock')}</span>
                  </>
                ) : currentVariant.stock > 0 ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-amber-700 font-semibold">
                      {t('product.lowStock')} ({currentVariant.stock} restants)
                    </span>
                  </>
                ) : (
                  <span className="text-algerian-600 font-medium">{t('product.outOfStock')}</span>
                )}
              </div>
            )}
          </div>

          {/* Actions: Add to Cart (Ready to wear) OR Request Garment (Made to order) */}
          <div className="pt-4 border-t border-border space-y-3">
            {product.type === 'ready_to_wear' ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <QuantityStepper
                  value={quantity}
                  max={currentVariant?.stock || 1}
                  onChange={(qty) => setQuantity(qty)}
                  disabled={!currentVariant || currentVariant.stock <= 0}
                />
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!currentVariant || currentVariant.stock <= 0}
                  onClick={handleAddToCart}
                >
                  {t('product.addToCart')}
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border border-border transition-colors ${
                    isFav ? 'text-algerian-600 bg-algerian-50 border-algerian-200' : 'text-neutral-600 hover:text-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button
                  variant="forest"
                  size="lg"
                  className="flex-1"
                  onClick={() => setTailoringModalOpen(true)}
                >
                  <Scissors className="w-4 h-4 me-2" />
                  <span>{t('product.requestGarment')}</span>
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border border-border transition-colors ${
                    isFav ? 'text-algerian-600 bg-algerian-50 border-algerian-200' : 'text-neutral-600 hover:text-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Algerian E-commerce Trust Points */}
          <div className="pt-4 border-t border-border space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Truck className="w-4 h-4 text-forest-700 shrink-0" />
              <span>{t('product.deliveryInfo')}</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
              <span>Paiement en espèces à la livraison après vérification</span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <RefreshCw className="w-4 h-4 text-forest-700 shrink-0" />
              <span>Échange de taille facile et rapide sous 48h</span>
            </div>
          </div>

          {/* Description & Details Accordion */}
          <div className="pt-4 border-t border-border space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-primary mb-2">
                {t('product.details')}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-border">
          <div className="text-start mb-8">
            <h2 className="font-serif text-2xl font-bold text-primary">
              {t('product.relatedProducts')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Made-to-Order Request Modal */}
      <Modal
        isOpen={tailoringModalOpen}
        onClose={() => setTailoringModalOpen(false)}
        title={t('tailoring.title')}
        maxWidth="lg"
      >
        <form onSubmit={handleTailoringSubmit} className="space-y-4 text-start">
          <div className="p-3 bg-neutral-50 border border-border flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src={product.images[0]}
              alt={name}
              className="w-12 h-14 object-cover object-top border border-border"
            />
            <div>
              <p className="text-xs font-bold text-primary uppercase">{name}</p>
              <p className="text-[11px] text-neutral-500">
                {product.originRegion && `${product.originRegion} · `}
                Délai estimé : {product.leadTimeDays || 14} jours ouvrables
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('checkout.fullName')}
              required
              value={tailorName}
              onChange={(e) => setTailorName(e.target.value)}
              placeholder="Ex: Leila Mansouri"
            />
            <Input
              label={t('checkout.phone')}
              required
              value={tailorPhone}
              onChange={(e) => setTailorPhone(e.target.value)}
              placeholder="05 / 06 / 07 ..."
            />
          </div>

          <Input
            label={t('auth.email')}
            type="email"
            value={tailorEmail}
            onChange={(e) => setTailorEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                Taille de référence
              </label>
              <select
                value={tailorStandardSize}
                onChange={(e) => setTailorStandardSize(e.target.value)}
                className="w-full bg-white border border-border text-xs py-2 px-3 focus:outline-none focus:border-primary"
              >
                <option value="Sur-mesure (Centimètres)">Sur-mesure exact (voir mensurations ci-dessous)</option>
                <option value="36">36 (XS)</option>
                <option value="38">38 (S)</option>
                <option value="40">40 (M)</option>
                <option value="42">42 (L)</option>
                <option value="44">44 (XL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                {t('tailoring.embroidery')}
              </label>
              <select
                value={tailorEmbroidery}
                onChange={(e) => setTailorEmbroidery(e.target.value)}
                className="w-full bg-white border border-border text-xs py-2 px-3 focus:outline-none focus:border-primary"
              >
                <option value="Majboud Royal Haute Tradition">Majboud Royal au fil d’or</option>
                <option value="Fetla Dorée de Constantine">Fetla Dorée raffinée</option>
                <option value="Perlage Fait Main & Cristaux">Perlage Fait Main & Cristaux</option>
                <option value="Passementerie Traditionnelle Épurée">Passementerie traditionnelle épurée</option>
              </select>
            </div>
          </div>

          {/* Measurements grid */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
              {t('tailoring.measurements')} (Optionnel si taille standard)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Input
                label={t('tailoring.bust')}
                type="number"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                placeholder="cm"
              />
              <Input
                label={t('tailoring.waist')}
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="cm"
              />
              <Input
                label={t('tailoring.hips')}
                type="number"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                placeholder="cm"
              />
              <Input
                label={t('tailoring.height')}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('tailoring.desiredDate')}
              type="date"
              value={tailorDesiredDate}
              onChange={(e) => setTailorDesiredDate(e.target.value)}
            />
            <Input
              label={t('tailoring.fabricVariation')}
              value={tailorFabric}
              onChange={(e) => setTailorFabric(e.target.value)}
              placeholder="Ex: Velours grenat, Soie sauvage..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
              {t('tailoring.notes')}
            </label>
            <textarea
              rows={2}
              value={tailorNotes}
              onChange={(e) => setTailorNotes(e.target.value)}
              className="w-full bg-white border border-border text-xs p-2.5 focus:outline-none focus:border-primary placeholder-neutral-400"
              placeholder="Ex: Pour mon mariage le mois prochain, besoin d'un essayage à Alger..."
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="forest"
              className="w-full"
              isLoading={tailoringSubmitting}
            >
              {t('tailoring.submit')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
