import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'text' | 'circle';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  className = '',
  ...props
}) => {
  const base = 'animate-pulse bg-neutral-200/80';
  const variantStyles = {
    rect: '',
    text: 'h-4 w-full rounded-xs',
    circle: 'rounded-full',
  };

  return <div className={`${base} ${variantStyles[variant]} ${className}`} {...props} />;
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="aspect-product w-full bg-neutral-200" />
      <div className="space-y-1.5 pt-1">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-4/5 h-4" />
        <Skeleton variant="text" className="w-1/4 h-4" />
      </div>
    </div>
  );
};
