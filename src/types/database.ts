import type { Tables } from "@/integrations/supabase/types";

export type DBProduct = Tables<"products">;
export type DBVendor = Tables<"vendors">;
export type DBOrder = Tables<"orders">;
export type DBOrderItem = Tables<"order_items">;
export type DBProfile = Tables<"profiles">;

export interface CartItem {
  product: DBProduct;
  vendor: DBVendor;
  quantity: number;
  isRental?: boolean;
  rentalDuration?: "daily" | "weekly";
  rentalStartDate?: string;
}
