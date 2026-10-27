import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Scissors, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';

  // Fetch New Arrivals
  const { data: newArrivalsData, isLoading: loadingNew } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      const res = await fetch('/api/products?filter=new&limit=4');
      return res.json();
    },
  });

  // Fetch Trending Products
  const { data: trendingData, isLoading: loadingTrending } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      const res = await fetch('/api/products?filter=trending&limit=4');
      return res.json();
    },
  });

  // Fetch Traditional Collection
  const { data: traditionalData, isLoading: loadingTraditional } = useQuery({
    queryKey: ['products', 'traditional'],
    queryFn: async () => {
      const res = await fetch('/api/products?category=traditional&limit=4');
      return res.json();
    },
  });

  const campaigns = [
    {
      title: t('home.modernAlgeria'),
      subtitle: t('home.modernAlgeriaDesc'),
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
      href: '/shop?category=women',
      tag: 'Nouvelle Capsule',
    },
    {
      title: t('home.traditionalElegance'),
      subtitle: t('home.traditionalEleganceDesc'),
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900',
      href: '/shop?category=traditional',
      tag: 'Patrimoine 100% Fait Main',
    },
    {
      title: t('home.weddingCollection'),
      subtitle: t('home.weddingCollectionDesc'),
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=900',
      href: '/shop?category=wedding',
      tag: 'Haute Couture',
    },
    {
      title: t('home.urbanEssentials'),
      subtitle: t('home.urbanEssentialsDesc'),
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
      href: '/shop?category=men',
      tag: 'Vestiaire Urbain',
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Banner with luxury editorial layout */}
      <section className="relative min-h-[82vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800"
            alt="MyStyle Algeria Fashion Campaign"
            className="w-full h-full object-cover object-top opacity-55 scale-105 animate-in fade-in zoom-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold animate-ping" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-200 font-medium">
              {t('hero.tagline')}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl">
            {t('hero.title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/shop">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-white text-neutral-900 hover:bg-neutral-100 font-semibold px-8"
              >
                <span>{t('hero.ctaExplore')}</span>
                <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              </Button>
            </Link>

            <Link to="/shop?category=traditional">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                <span>{t('hero.ctaTraditional')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Algerian delivery assurance bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md border-t border-white/10 py-3 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-around text-xs text-neutral-300">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Truck className="w-4 h-4 text-heritage-gold" />
              <span>Livraison express à domicile dans les 58 Wilayas</span>
            </span>
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldCheck className="w-4 h-4 text-heritage-gold" />
              <span>Paiement en espèces à la livraison (Cash on Delivery)</span>
            </span>
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Scissors className="w-4 h-4 text-heritage-gold" />
              <span>Atelier de confection et retouches à Alger</span>
            </span>
          </div>
        </div>
      </section>

      {/* Seasonal Campaigns Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-forest-700 font-semibold block mb-2">
            Capsules 2026
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
            {t('home.campaignsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            {t('home.campaignsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((camp, idx) => (
            <Link
              key={idx}
              to={camp.href}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 flex flex-col justify-end p-6 border border-border"
            >
              <img
                src={camp.image}
                alt={camp.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="relative z-10 text-white text-start">
                <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-heritage-gold mb-2">
                  {camp.tag}
                </span>
                <h3 className="font-serif text-lg font-bold mb-1.5 group-hover:text-neutral-200 transition-colors">
                  {camp.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-2 mb-3">
                  {camp.subtitle}
                </p>
                <span className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>Explorer</span>
                  <ChevronRight className="w-3.5 h-3.5 ms-1 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-forest-700 font-bold block mb-1">
              {t('nav.shop')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {t('home.newArrivalsTitle')}
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs uppercase tracking-wider font-semibold text-primary hover:text-neutral-600 inline-flex items-center transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 ms-1.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loadingNew ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            newArrivalsData?.products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Algerian Artisanship Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white overflow-hidden border border-forest-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16 text-start space-y-6">
              <span className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-forest-800 text-heritage-gold px-3 py-1 text-xs uppercase tracking-widest font-semibold border border-forest-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('home.artisanBadge')}</span>
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                {t('home.artisanTitle')}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {t('home.artisanText')}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-forest-800">
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white block">Alger</span>
                  <span className="text-[11px] text-neutral-400">Karakou & Badroune</span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white block">Tlemcen</span>
                  <span className="text-[11px] text-neutral-400">Chedda & Caftans</span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white block">Constantine</span>
                  <span className="text-[11px] text-neutral-400">Gandoura Fetla</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/shop?category=traditional">
                  <Button
                    variant="primary"
                    className="bg-heritage-gold text-neutral-950 hover:bg-heritage-gold/90 font-semibold"
                  >
                    <span>Découvrir la Haute Tradition</span>
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    className="border-forest-700 text-neutral-200 hover:bg-forest-800"
                  >
                    <span>{t('home.exploreArtisans')}</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full bg-forest-950">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000"
                alt="Broderie artisanale algérienne"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-algerian-600 font-bold block mb-1">
              Sélection Populaire
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {t('home.trendingTitle')}
            </h2>
          </div>
          <Link
            to="/shop?filter=trending"
            className="text-xs uppercase tracking-wider font-semibold text-primary hover:text-neutral-600 inline-flex items-center transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 ms-1.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loadingTrending ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            trendingData?.products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Traditional Collection Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-heritage-gold font-bold block mb-1">
              Patrimoine National
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {t('nav.traditional')}
            </h2>
          </div>
          <Link
            to="/shop?category=traditional"
            className="text-xs uppercase tracking-wider font-semibold text-primary hover:text-neutral-600 inline-flex items-center transition-colors"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 ms-1.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loadingTraditional ? (
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            traditionalData?.products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};
