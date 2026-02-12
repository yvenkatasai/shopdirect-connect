import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Package, Clock, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { DBProduct } from "@/types/database";

const VendorInventory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "sell" | "rent">("all");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: vendor } = await supabase
        .from("vendors").select("id").eq("user_id", user.id).maybeSingle();
      if (!vendor) { setLoading(false); return; }
      const { data } = await supabase
        .from("products").select("*").eq("vendor_id", vendor.id).order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const toggleActive = async (product: DBProduct) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
      toast.success(product.is_active ? "Product deactivated" : "Product activated");
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    }
  };

  const filtered = products.filter((p) => {
    if (filter === "sell") return p.type === "sell" || p.type === "both";
    if (filter === "rent") return p.type === "rent" || p.type === "both";
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/vendor" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-base font-bold text-foreground">{t("vendor.inventory")}</h1>
          </div>
          <Link to="/vendor/add-product" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
          </Link>
        </div>
        <div className="mx-auto flex max-w-lg gap-2 px-4 pb-3">
          {(["all", "sell", "rent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "sell" ? "For Sale" : "For Rent"}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No products yet</p>
            <Link to="/vendor/add-product" className="mt-3 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Add Product
            </Link>
          </div>
        )}
        {filtered.map((product) => (
          <div key={product.id} className={`rounded-lg border bg-card overflow-hidden ${!product.is_active ? "opacity-60 border-border" : "border-border"}`}>
            <div className="flex gap-3 p-3">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    product.type === "rent" ? "bg-accent/20 text-accent-foreground" : product.type === "both" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {product.type === "sell" ? "Sale" : product.type === "rent" ? "Rent" : "Both"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  {(product.type === "sell" || product.type === "both") && (
                    <span className="font-bold text-foreground">₹{product.price}</span>
                  )}
                  {(product.type === "rent" || product.type === "both") && product.rental_price_daily && (
                    <span className="text-accent-foreground font-medium">₹{product.rental_price_daily}/day</span>
                  )}
                  <span className="text-muted-foreground">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
            <div className="flex border-t border-border divide-x divide-border">
              <button
                onClick={() => toggleActive(product)}
                className="flex-1 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {product.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="flex items-center justify-center gap-1 flex-1 py-2 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorInventory;
