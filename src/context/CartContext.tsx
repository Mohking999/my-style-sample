import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types';

export interface CartItemType {
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalDzd: number;
  discountCode: string | null;
  discountDzd: number;
  applyDiscountCode: (code: string) => Promise<{ success: boolean; message: string; discountDzd: number }>;
  removeDiscountCode: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemType[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mystyle_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  const [discountCode, setDiscountCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mystyle_discount_code');
    }
    return null;
  });

  const [discountDzd, setDiscountDzd] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('mystyle_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (discountCode) {
      localStorage.setItem('mystyle_discount_code', discountCode);
    } else {
      localStorage.removeItem('mystyle_discount_code');
    }
  }, [discountCode]);

  const subtotalDzd = items.reduce((acc, item) => acc + item.product.priceDzd * item.quantity, 0);

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1): boolean => {
    if (variant.stock <= 0) return false;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === variant.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, variant.stock);
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const safeQty = Math.min(quantity, variant.stock);
        return [...prev, { productId: product.id, variantId: variant.id, product, variant, quantity: safeQty }];
      }
    });

    setIsCartDrawerOpen(true);
    return true;
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const maxStock = item.variant.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscountDzd(0);
  };

  const applyDiscountCode = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, subtotalDzd }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscountCode(trimmed);
        setDiscountDzd(data.discountDzd);
        return { success: true, message: data.message || 'Code promo appliqué', discountDzd: data.discountDzd };
      } else {
        return { success: false, message: data.message || 'Code promo invalide', discountDzd: 0 };
      }
    } catch {
      // Local fallback for dev/offline
      if (trimmed === 'SAHRA10') {
        const discount = Math.round(subtotalDzd * 0.1);
        setDiscountCode(trimmed);
        setDiscountDzd(discount);
        return { success: true, message: 'Remise de 10% appliquée', discountDzd: discount };
      } else if (trimmed === 'BIENVENUE') {
        const discount = 1000;
        setDiscountCode(trimmed);
        setDiscountDzd(discount);
        return { success: true, message: 'Remise de 1 000 DA appliquée', discountDzd: discount };
      }
      return { success: false, message: 'Code promo invalide ou expiré', discountDzd: 0 };
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode(null);
    setDiscountDzd(0);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalDzd,
        discountCode,
        discountDzd,
        applyDiscountCode,
        removeDiscountCode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
