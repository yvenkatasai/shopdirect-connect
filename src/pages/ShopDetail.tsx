import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Star, MapPin, Clock, Phone, Truck, Plus, Check } from "lucide-react";
import type { DBProduct, DBVendor } from "@/types/database";

const ShopDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { items, addItem } = useCart();
  const [vendor, setVendor] = useState<DBVendor | null>(null);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [{ data: vData }, { data: pData }] = await Promise.all([
        supabase.from("vendors").select("*").eq("id", id).maybeSingle(),
        supabase.from("products").select("*").eq("vendor_id", id).eq("is_active", true),
      ]);
      if (vData) setVendor(vData);
      if (pData) setProducts(pData);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!vendor) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Shop not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-48 bg-muted">
        {vendor.shop_image_url && <img src={vendor.shop_image_url} alt={vendor.shop_name} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <Link to="/shops" className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-bold text-primary-foreground">{vendor.shop_name}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-primary-foreground/80">
            {vendor.rating ? <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /> {vendor.rating}</span> : null}
            {vendor.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {vendor.location}</span>}
            <span className={`font-semibold ${vendor.is_open ? "text-green-300" : "text-red-300"}`}>
              {vendor.is_open ? t("shop.open") : t("shop.closed")}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        {/* Info */}
        <div className="mt-4 rounded-lg border border-border bg-card p-3 space-y-2">
          {vendor.location && <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {vendor.location}</div>}
          {vendor.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {vendor.phone}</div>}
          {vendor.delivery_available ? (
            <div className="flex items-center gap-2 text-xs font-medium text-success"><Truck className="h-3.5 w-3.5" /> {t("shop.delivery")} {vendor.estimated_delivery_time && `· ${vendor.estimated_delivery_time}`}</div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Truck className="h-3.5 w-3.5" /> {t("shop.pickupOnly")}</div>
          )}
        </div>

        {/* Categories */}
        {vendor.categories && vendor.categories.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {vendor.categories.map((cat) => (
              <span key={cat} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">{cat}</span>
            ))}
          </div>
        )}

        {/* Products */}
        <h2 className="mt-6 text-base font-bold text-foreground">{t("shop.products")} ({products.length})</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {products.map((product) => {
            const inCart = items.some((i) => i.product.id === product.id);
            const isRental = product.type === "rent" || product.type === "both";
            return (
              <div key={product.id} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                <Link to={`/product/${product.id}`} className="relative h-32 overflow-hidden bg-muted">
                  {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                  {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">{t("product.outOfStock")}</span>
                    </div>
                  )}
                  {isRental && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                      <Clock className="h-3 w-3" /> {t("product.forRent")}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    {product.price ? <span className="text-base font-bold text-foreground">₹{product.price}</span> : null}
                    {isRental && product.rental_price_daily ? <span className="text-xs text-accent-foreground font-medium">₹{product.rental_price_daily}/day</span> : null}
                    {product.in_stock && product.type !== "rent" && (
                      <button
                        onClick={(e) => { e.preventDefault(); if (!inCart) addItem(product, vendor); }}
                        disabled={inCart}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${inCart ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                      >
                        {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {products.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No products listed yet.</p>}
      </div>
    </div>
  );
};

export default ShopDetail;
