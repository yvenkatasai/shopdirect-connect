
-- ==========================================
-- 1. ENUMS
-- ==========================================
CREATE TYPE public.app_role AS ENUM ('customer', 'vendor');
CREATE TYPE public.product_type AS ENUM ('sell', 'rent', 'both');
CREATE TYPE public.rental_duration_type AS ENUM ('hourly', 'daily', 'weekly');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'ready_for_pickup', 'completed', 'cancelled');
CREATE TYPE public.order_type AS ENUM ('buy', 'rent');
CREATE TYPE public.fulfillment_type AS ENUM ('delivery', 'pickup');

-- ==========================================
-- 2. PROFILES TABLE
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  address TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. USER ROLES TABLE
-- ==========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. VENDORS TABLE
-- ==========================================
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  shop_description TEXT DEFAULT '',
  shop_image_url TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  categories TEXT[] DEFAULT '{}',
  delivery_available BOOLEAN DEFAULT false,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  estimated_delivery_time TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. PRODUCTS TABLE
-- ==========================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  type product_type NOT NULL DEFAULT 'sell',
  price NUMERIC(10,2) DEFAULT 0,
  unit TEXT DEFAULT 'piece',
  rental_price_hourly NUMERIC(10,2),
  rental_price_daily NUMERIC(10,2),
  rental_price_weekly NUMERIC(10,2),
  deposit NUMERIC(10,2) DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  specs JSONB DEFAULT '[]',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. ORDERS TABLE
-- ==========================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  status order_status NOT NULL DEFAULT 'pending',
  order_type order_type NOT NULL DEFAULT 'buy',
  fulfillment_type fulfillment_type NOT NULL DEFAULT 'delivery',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  delivery_address TEXT,
  customer_phone TEXT,
  customer_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 7. ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC(10,2) NOT NULL,
  is_rental BOOLEAN DEFAULT false,
  rental_duration rental_duration_type,
  rental_start_date DATE,
  rental_end_date DATE,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. HELPER FUNCTIONS (SECURITY DEFINER)
-- ==========================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_vendor_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.vendors WHERE user_id = _user_id LIMIT 1
$$;

-- ==========================================
-- 9. PROFILES POLICIES
-- ==========================================
CREATE POLICY "Anyone authenticated can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- ==========================================
-- 10. USER ROLES POLICIES
-- ==========================================
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can assign first role to themselves"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 11. VENDORS POLICIES
-- ==========================================
CREATE POLICY "Anyone can read vendor shops"
  ON public.vendors FOR SELECT
  USING (true);

CREATE POLICY "Vendors can create own shop"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.has_role(auth.uid(), 'vendor')
  );

CREATE POLICY "Vendors can update own shop"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ==========================================
-- 12. PRODUCTS POLICIES
-- ==========================================
CREATE POLICY "Anyone can read active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Vendors can create products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    vendor_id = public.get_vendor_id_for_user(auth.uid())
  );

CREATE POLICY "Vendors can update own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    vendor_id = public.get_vendor_id_for_user(auth.uid())
  );

CREATE POLICY "Vendors can delete own products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    vendor_id = public.get_vendor_id_for_user(auth.uid())
  );

-- ==========================================
-- 13. ORDERS POLICIES
-- ==========================================
CREATE POLICY "Customers can read own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Vendors can read orders for their shop"
  ON public.orders FOR SELECT
  TO authenticated
  USING (vendor_id = public.get_vendor_id_for_user(auth.uid()));

CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Vendors can update order status"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (vendor_id = public.get_vendor_id_for_user(auth.uid()));

-- ==========================================
-- 14. ORDER ITEMS POLICIES
-- ==========================================
CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR orders.vendor_id = public.get_vendor_id_for_user(auth.uid()))
    )
  );

CREATE POLICY "Customers can create order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- ==========================================
-- 15. AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 16. AUTO-UPDATE updated_at TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==========================================
-- 17. STORAGE BUCKETS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('shop-images', 'shop-images', true);

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Vendors can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'vendor'));

CREATE POLICY "Anyone can view shop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-images');

CREATE POLICY "Vendors can upload shop images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shop-images' AND public.has_role(auth.uid(), 'vendor'));
