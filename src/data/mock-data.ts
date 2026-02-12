// This file is kept for backward compatibility but is no longer used.
// All pages now use Supabase directly.
import { Wrench, Zap, Droplets, PaintBucket, Hammer, Fence, Package, Building2 } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: any;
  productCount: number;
}

export interface Shop {
  id: string;
  name: string;
  image: string;
  categories: string[];
  distance: string;
  deliveryTime: string;
  deliveryAvailable: boolean;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  description: string;
  inStock: boolean;
  category: string;
  specs?: string[];
  isRental?: boolean;
  rentalPrice?: { daily: number; weekly: number };
  deposit?: number;
}

export interface CartItem {
  product: Product;
  shop: Shop;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  type: string;
  time: string;
}

export const categories: Category[] = [];
export const shops: Shop[] = [];
export const products: Product[] = [];
export const vendorOrders: Order[] = [];
