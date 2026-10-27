import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5"
          >
            {label}
            {required && <span className="text-algerian-500 ms-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={`w-full bg-white border text-sm text-primary placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${
              error
                ? 'border-algerian-500 focus:border-algerian-500 focus:ring-algerian-500'
                : 'border-border hover:border-neutral-400'
            } ${leftIcon ? 'ps-10' : 'ps-3.5'} ${rightIcon ? 'pe-10' : 'pe-3.5'} py-2.5 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 end-0 pe-3.5 flex items-center pointer-events-none text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-algerian-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
