import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center space-x-1 rtl:space-x-reverse ${className}`}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 border border-border text-neutral-600 hover:text-primary hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-border disabled:hover:text-neutral-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {getPages().map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-xs text-neutral-400 select-none">
              ...
            </span>
          );
        }
        const isCurrent = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            type="button"
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onPageChange(Number(page))}
            className={`min-w-[36px] h-9 px-2 text-xs font-medium transition-colors border ${
              isCurrent
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-700 border-border hover:border-neutral-900 hover:text-primary'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 border border-border text-neutral-600 hover:text-primary hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-border disabled:hover:text-neutral-600 transition-colors"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </nav>
  );
};
