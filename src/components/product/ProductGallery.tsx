import React, { useState } from 'react';

export interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-product w-full bg-neutral-100 flex items-center justify-center text-neutral-400">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (desktop vertical, mobile horizontal) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0 pb-2 md:pb-0 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 md:w-20 md:h-24 border shrink-0 overflow-hidden transition-all ${
                selectedIndex === idx
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image View */}
      <div className="relative flex-1 aspect-product bg-neutral-100 overflow-hidden border border-border">
        <img
          src={images[selectedIndex] || images[0]}
          alt={`${productName} - Vue ${selectedIndex + 1}`}
          className="w-full h-full object-cover object-top transition-all duration-300"
        />

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 end-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};
