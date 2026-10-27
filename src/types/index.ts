export type ProductType = 'ready_to_wear' | 'made_to_order';

export interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  productCount?: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorNameFr: string;
  colorNameAr: string;
  colorNameEn: string;
  colorHex: string;
  size: string; // e.g., 'XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', 'Standard'
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  priceDzd: number;
  originalPriceDzd?: number | null;
  categoryId: string;
  category?: Category;
  type: ProductType;
  originRegion?: string; // e.g., 'Tlemcen', 'Alger (La Casbah)', 'Constantine', 'Oran', 'Kabylie'
  leadTimeDays?: number; // for made_to_order, e.g. 10 - 21 days
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  isPublished?: boolean;
  images: string[];
  variants: ProductVariant[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'tailor' | 'staff' | 'admin';
  createdAt?: string;
}

export interface Wilaya {
  code: number;
  nameFr: string;
  nameAr: string;
  homeDeliveryFee: number;
  relayDeliveryFee: number;
  active: boolean;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  variantId?: string;
  title: string;
  color?: string;
  size?: string;
  priceDzd: number;
  quantity: number;
  image?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderHistoryItem {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  address: string;
  deliveryType: 'home' | 'relay';
  paymentMethod: 'cod' | 'card';
  notes?: string;
  status: OrderStatus;
  subtotalDzd: number;
  deliveryFeeDzd: number;
  discountDzd: number;
  discountCode?: string | null;
  totalDzd: number;
  items: OrderItem[];
  history?: OrderHistoryItem[];
  createdAt: string;
}

export type TailoringStatus =
  | 'submitted'
  | 'quote_sent'
  | 'accepted'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'declined'
  | 'cancelled';

export interface TailoringRequest {
  id: string;
  userId?: string | null;
  userEmail?: string;
  userName: string;
  userPhone: string;
  productId: string;
  productTitle: string;
  productSlug?: string;
  productImage?: string;
  measurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
    height?: number;
    shoulder?: number;
    sleeve?: number;
  };
  standardSize?: string;
  color?: string;
  embroideryOption?: string; // e.g., 'Majboud Royal', 'Fetla Dorée', 'Perlage Fait Main', 'Classique'
  fabricVariation?: string;
  notes?: string;
  desiredDate?: string;
  status: TailoringStatus;
  quotedPriceDzd?: number | null;
  estimatedDays?: number | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderDzd: number;
  active: boolean;
  expiresAt?: string;
}
