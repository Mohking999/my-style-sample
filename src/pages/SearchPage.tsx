import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Product } from '@/types';

const POPULAR_SEARCHES = [
  'Karakou',
  'Burnous',
  'Costume',
  'Lin',
  'Chedda',
  'Blouza',
  'Saharienne',
  'Trench',
  'Soie',
  'Tlemcen',
];

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return { products: [], pagination: { total: 0 } };
      const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=24`);
      return res.json();
    },
    enabled: query.trim().length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary mb-6">
          {t('nav.search')}
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un vêtement, une matière, une région (ex: Karakou, Lin, Tlemcen)..."
            className="w-full bg-white border-2 border-primary py-3.5 ps-12 pe-10 text-sm focus:outline-none placeholder-neutral-400"
            autoFocus
          />
          <SearchIcon className="w-5 h-5 absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
          <span className="me-1">Recherches fréquentes :</span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className="px-2.5 py-1 bg-surface-subtle hover:bg-surface-muted text-primary border border-border transition-colors font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="text-start">
        {query.trim() && (
          <div className="mb-6 pb-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-600">
              Résultats pour « {query} »
            </h2>
            <span className="text-xs text-neutral-500">
              {data?.pagination?.total || 0} article(s) trouvé(s)
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.products?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-16 text-center border border-dashed border-border bg-white p-8">
            <p className="text-base font-semibold text-primary mb-1">
              Aucun résultat pour « {query} »
            </p>
            <p className="text-xs text-neutral-500">
              Vérifiez l’orthographe ou essayez d’autres mots-clés plus généraux.
            </p>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-400">
            Tapez un mot-clé ci-dessus pour explorer les collections MyStyle.
          </div>
        )}
      </div>
    </div>
  );
};
