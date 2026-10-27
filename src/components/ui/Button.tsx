import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'forest' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-neutral-800 active:bg-black focus:ring-neutral-900 border border-transparent shadow-sm',
      secondary:
        'bg-surface-subtle text-primary hover:bg-surface-muted active:bg-neutral-200 focus:ring-neutral-400 border border-border',
      outline:
        'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-neutral-900',
      forest:
        'bg-forest-700 text-white hover:bg-forest-800 active:bg-forest-900 focus:ring-forest-700 shadow-sm',
      danger:
        'bg-algerian-600 text-white hover:bg-algerian-700 active:bg-algerian-800 focus:ring-algerian-500 shadow-sm',
      ghost:
        'bg-transparent text-primary hover:bg-neutral-100 active:bg-neutral-200 focus:ring-neutral-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs uppercase tracking-wider',
      md: 'px-5 py-2.5 text-sm tracking-wide',
      lg: 'px-7 py-3.5 text-base tracking-wide',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ms-1 me-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="me-2 inline-flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="ms-2 inline-flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
