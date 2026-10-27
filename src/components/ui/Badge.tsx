import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sale' | 'new' | 'traditional' | 'neutral' | 'success' | 'warning' | 'forest';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const variants = {
    sale: 'bg-algerian-500 text-white',
    new: 'bg-primary text-white',
    traditional: 'bg-heritage-gold text-neutral-900 font-semibold',
    forest: 'bg-forest-700 text-white',
    neutral: 'bg-surface-muted text-neutral-700 border border-border',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  };

  const sizes = {
    sm: 'text-[10px] uppercase tracking-widest px-2 py-0.5',
    md: 'text-xs uppercase tracking-wider px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
