export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          deposit_amount: number | null
          id: string
          is_rental: boolean | null
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
          rental_duration:
            | Database["public"]["Enums"]["rental_duration_type"]
            | null
          rental_end_date: string | null
          rental_start_date: string | null
        }
        Insert: {
          created_at?: string
          deposit_amount?: number | null
          id?: string
          is_rental?: boolean | null
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity?: number
          rental_duration?:
            | Database["public"]["Enums"]["rental_duration_type"]
            | null
          rental_end_date?: string | null
          rental_start_date?: string | null
        }
        Update: {
          created_at?: string
          deposit_amount?: number | null
          id?: string
          is_rental?: boolean | null
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
          rental_duration?:
            | Database["public"]["Enums"]["rental_duration_type"]
            | null
          rental_end_date?: string | null
          rental_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_charge: number | null
          deposit_amount: number | null
          fulfillment_type: Database["public"]["Enums"]["fulfillment_type"]
          id: string
          notes: string | null
          order_type: Database["public"]["Enums"]["order_type"]
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number | null
          deposit_amount?: number | null
          fulfillment_type?: Database["public"]["Enums"]["fulfillment_type"]
          id?: string
          notes?: string | null
          order_type?: Database["public"]["Enums"]["order_type"]
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number | null
          deposit_amount?: number | null
          fulfillment_type?: Database["public"]["Enums"]["fulfillment_type"]
          id?: string
          notes?: string | null
          order_type?: Database["public"]["Enums"]["order_type"]
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          deposit: number | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean
          is_active: boolean
          name: string
          price: number | null
          rental_price_daily: number | null
          rental_price_hourly: number | null
          rental_price_weekly: number | null
          specs: Json | null
          stock: number
          type: Database["public"]["Enums"]["product_type"]
          unit: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category: string
          created_at?: string
          deposit?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          name: string
          price?: number | null
          rental_price_daily?: number | null
          rental_price_hourly?: number | null
          rental_price_weekly?: number | null
          specs?: Json | null
          stock?: number
          type?: Database["public"]["Enums"]["product_type"]
          unit?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: string
          created_at?: string
          deposit?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          name?: string
          price?: number | null
          rental_price_daily?: number | null
          rental_price_hourly?: number | null
          rental_price_weekly?: number | null
          specs?: Json | null
          stock?: number
          type?: Database["public"]["Enums"]["product_type"]
          unit?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_user_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          preferred_language: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          auth_user_id: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          auth_user_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          categories: string[] | null
          created_at: string
          delivery_available: boolean | null
          delivery_charge: number | null
          estimated_delivery_time: string | null
          id: string
          is_open: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          phone: string | null
          rating: number | null
          shop_description: string | null
          shop_image_url: string | null
          shop_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          delivery_available?: boolean | null
          delivery_charge?: number | null
          estimated_delivery_time?: string | null
          id?: string
          is_open?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          shop_description?: string | null
          shop_image_url?: string | null
          shop_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          delivery_available?: boolean | null
          delivery_charge?: number | null
          estimated_delivery_time?: string | null
          id?: string
          is_open?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          phone?: string | null
          rating?: number | null
          shop_description?: string | null
          shop_image_url?: string | null
          shop_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_vendor_id_for_user: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "vendor"
      fulfillment_type: "delivery" | "pickup"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "out_for_delivery"
        | "ready_for_pickup"
        | "completed"
        | "cancelled"
      order_type: "buy" | "rent"
      product_type: "sell" | "rent" | "both"
      rental_duration_type: "hourly" | "daily" | "weekly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "vendor"],
      fulfillment_type: ["delivery", "pickup"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "ready_for_pickup",
        "completed",
        "cancelled",
      ],
      order_type: ["buy", "rent"],
      product_type: ["sell", "rent", "both"],
      rental_duration_type: ["hourly", "daily", "weekly"],
    },
  },
} as const
