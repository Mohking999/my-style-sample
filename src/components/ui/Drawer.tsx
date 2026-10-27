import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'start' | 'end';
  width?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'end',
  width = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const isEnd = position === 'end';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 ${
          isEnd ? 'end-0' : 'start-0'
        } flex max-w-full`}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={`w-screen ${widthClasses[width]} bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-s border-border text-start`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            {title && (
              <h2 className="text-base font-semibold text-primary font-serif">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ms-auto -me-2 p-1.5 text-neutral-400 hover:text-primary transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="relative flex-1 px-6 py-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
