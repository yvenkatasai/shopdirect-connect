import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, Store, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import type { DBProduct, DBVendor } from "@/types/database";

const ProductDetail = () => {
  const { id } = useParams();
  const { items, addItem } = useCart();
  const { t } = useLanguage();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [vendor, setVendor] = useState<DBVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rentalDuration, setRentalDuration] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*, vendors(*)").eq("id", id).maybeSingle();
      if (data) {
        const { vendors: v, ...p } = data as any;
        setProduct(p);
        setVendor(v);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!product || !vendor) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Product not found</p></div>;

  const isRental = product.type === "rent" || product.type === "both";
  const isSale = product.type === "sell" || product.type === "both";
  const rentalPrice = rentalDuration === "weekly" ? (product.rental_price_weekly || 0) : (product.rental_price_daily || 0);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product, vendor);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleRentRequest = () => {
    addItem(product, vendor, true, rentalDuration);
    toast.success(`Rental added to cart!`);
  };

  const specs = Array.isArray(product.specs) ? product.specs as string[] : [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-64 bg-muted">
        {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
        <Link to={`/shop/${vendor.id}`} className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {isRental && (
          <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <Clock className="h-3.5 w-3.5" /> {t("product.forRent")}
          </span>
        )}
      </div>

      <div className="mx-auto max-w-lg px-4">
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold text-foreground">{product.name}</h1>
            <span className={`mt-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${product.in_stock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
              {product.in_stock ? t("product.inStock") : t("product.outOfStock")}
            </span>
          </div>

          {/* Pricing */}
          {isRental && (
            <div className="mt-3">
              <div className="flex gap-2 mb-3">
                <button onClick={() => setRentalDuration("daily")} className={`flex-1 rounded-lg border py-2.5 text-center text-sm font-semibold transition-colors ${rentalDuration === "daily" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
                  ₹{product.rental_price_daily}/day
                </button>
                <button onClick={() => setRentalDuration("weekly")} className={`flex-1 rounded-lg border py-2.5 text-center text-sm font-semibold transition-colors ${rentalDuration === "weekly" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
                  ₹{product.rental_price_weekly}/week
                </button>
              </div>
              {product.deposit && Number(product.deposit) > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t("product.deposit")}: ₹{product.deposit}</p>
                    <p className="text-[10px] text-muted-foreground">{t("product.depositDesc")}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {isSale && !isRental && (
            <p className="mt-1 text-2xl font-bold text-foreground">₹{product.price} <span className="text-sm font-normal text-muted-foreground">/ {product.unit}</span></p>
          )}
          {isSale && isRental && (
            <p className="mt-2 text-sm text-muted-foreground">Also available for purchase: <span className="font-bold text-foreground">₹{product.price}</span></p>
          )}
        </div>

        {/* Shop info */}
        <Link to={`/shop/${vendor.id}`} className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{vendor.shop_name}</p>
            {vendor.location && <p className="text-xs text-muted-foreground">{vendor.location}</p>}
          </div>
          {vendor.delivery_available && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-success"><Truck className="h-3 w-3" /> {t("shop.delivers")}</span>
          )}
        </Link>

        {/* Description */}
        {product.description && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-foreground">{t("product.description")}</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Specs */}
        {specs.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-foreground">{t("product.specs")}</h2>
            <div className="mt-2 space-y-1.5">
              {specs.map((spec, i) => {
                const parts = String(spec).split(": ");
                return (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{parts[0]}</span>
                    <span className="font-medium text-foreground">{parts[1] || ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      {product.in_stock && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
            {isRental ? (
              <button onClick={handleRentRequest} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]">
                <Clock className="h-4 w-4" /> Rent for ₹{rentalPrice}/{rentalDuration === "daily" ? "day" : "week"}
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"><Minus className="h-4 w-4" /></button>
                  <span className="w-6 text-center text-sm font-semibold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /></button>
                </div>
                <button onClick={handleAddToCart} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]">
                  <ShoppingCart className="h-4 w-4" /> {t("product.addToCart")} · ₹{(product.price || 0) * quantity}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
