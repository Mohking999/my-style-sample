import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Pagination } from '@/components/ui/Pagination';
import { FilterPanel, FilterState } from '@/components/listing/FilterPanel';
import { SortMenu, SortOption } from '@/components/listing/SortMenu';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/types';

export const ListingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const [searchParams, setSearchParams] = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract query filters from URL
  const categoryParam = searchParams.get('category') || undefined;
  const filterParam = searchParams.get('filter') || undefined;
  const typeParam = (searchParams.get('type') as any) || 'all';
  const sizesParam = searchParams.get('sizes') ? searchParams.get('sizes')!.split(',') : [];
  const colorsParam = searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [];
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = (searchParams.get('sort') as SortOption) || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const filters: FilterState = {
    category: categoryParam,
    type: typeParam,
    sizes: sizesParam,
    colors: colorsParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    inStockOnly: inStockParam,
  };

  // Fetch categories for filter sidebar
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      return res.json();
    },
  });

  // Query products based on URL params
  const { data, isLoading } = useQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: async () => {
      const url = new URL('/api/products', window.location.origin);
      searchParams.forEach((val, key) => url.searchParams.append(key, val));
      const res = await fetch(url.toString());
      return res.json();
    },
  });

  // Update URL search parameters
  const updateFiltersInUrl = (newFilters: FilterState) => {
    const nextParams = new URLSearchParams(searchParams);

    if (newFilters.category) nextParams.set('category', newFilters.category);
    else nextParams.delete('category');

    if (newFilters.type && newFilters.type !== 'all') nextParams.set('type', newFilters.type);
    else nextParams.delete('type');

    if (newFilters.sizes.length > 0) nextParams.set('sizes', newFilters.sizes.join(','));
    else nextParams.delete('sizes');

    if (newFilters.colors.length > 0) nextParams.set('colors', newFilters.colors.join(','));
    else nextParams.delete('colors');

    if (newFilters.minPrice) nextParams.set('minPrice', newFilters.minPrice.toString());
    else nextParams.delete('minPrice');

    if (newFilters.maxPrice) nextParams.set('maxPrice', newFilters.maxPrice.toString());
    else nextParams.delete('maxPrice');

    if (newFilters.inStockOnly) nextParams.set('inStock', 'true');
    else nextParams.delete('inStock');

    nextParams.set('page', '1'); // reset page on filter change
    setSearchParams(nextParams);
  };

  const handleSortChange = (newSort: SortOption) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', newSort);
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Determine active category title
  let pageTitle = t('nav.shop');
  if (filterParam === 'new') pageTitle = t('nav.newArrivals');
  else if (filterParam === 'sale') pageTitle = t('nav.sale');
  else if (filterParam === 'trending') pageTitle = t('home.trendingTitle');
  else if (categoryParam && categoriesData?.categories) {
    const foundCat = categoriesData.categories.find((c: any) => c.slug === categoryParam);
    if (foundCat) {
      pageTitle = lang === 'ar' ? foundCat.nameAr : lang === 'en' ? foundCat.nameEn : foundCat.nameFr;
    }
  }

  // Count active filters
  const activeFiltersCount =
    (categoryParam ? 1 : 0) +
    (typeParam !== 'all' ? 1 : 0) +
    sizesParam.length +
    colorsParam.length +
    (minPriceParam || maxPriceParam ? 1 : 0) +
    (inStockParam ? 1 : 0);

  const formattedCategories = (categoriesData?.categories || []).map((c: any) => ({
    slug: c.slug,
    name: lang === 'ar' ? c.nameAr : lang === 'en' ? c.nameEn : c.nameFr,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.shop'), href: '/shop' },
          ...(categoryParam || filterParam ? [{ label: pageTitle }] : []),
        ]}
        className="mb-6"
      />

      {/* Header section with title and quick category buttons */}
      <div className="mb-8 text-start">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-2">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">
          Découvrez notre sélection exclusive confectionnée avec rigueur, alliant matières nobles et héritage algérien.
        </p>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pt-4 pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateFiltersInUrl({ ...filters, category: undefined })}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
              !categoryParam
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-600 border-border hover:border-neutral-900'
            }`}
          >
            Tous les articles
          </button>
          {formattedCategories.map((c: any) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => updateFiltersInUrl({ ...filters, category: c.slug })}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
                categoryParam === c.slug
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-neutral-600 border-border hover:border-neutral-900'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar: Results Count, Mobile Filter Trigger, Sort */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center space-x-2 rtl:space-x-reverse border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-neutral-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('listing.filterTitle')}</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs text-neutral-500">
            {t('listing.resultsCount', { count: data?.pagination?.total || 0 })}
          </span>
        </div>

        {/* Sort Menu */}
        <SortMenu value={sortParam} onChange={handleSortChange} />
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white border border-border p-5 shadow-xs">
            <FilterPanel
              filters={filters}
              categories={formattedCategories}
              onFilterChange={updateFiltersInUrl}
              onReset={resetAllFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <Drawer
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title={t('listing.filterTitle')}
          position="start"
          width="md"
        >
          <FilterPanel
            filters={filters}
            categories={formattedCategories}
            onFilterChange={(f) => {
              updateFiltersInUrl(f);
            }}
            onReset={() => {
              resetAllFilters();
              setMobileFiltersOpen(false);
            }}
          />
          <div className="pt-6 border-t border-border mt-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Voir les résultats ({data?.pagination?.total || 0})
            </Button>
          </div>
        </Drawer>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.products?.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border bg-white p-8">
              <p className="text-base font-semibold text-primary mb-1">
                {t('listing.noResults')}
              </p>
              <p className="text-xs text-neutral-500 mb-6">
                {t('listing.noResultsPrompt')}
              </p>
              <Button variant="outline" size="sm" onClick={resetAllFilters}>
                {t('listing.clearAll')}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {data?.products?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination?.totalPages > 1 && (
                <div className="mt-12 pt-6 border-t border-border flex justify-center">
                  <Pagination
                    currentPage={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
