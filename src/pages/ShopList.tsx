import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { DBVendor } from "@/types/database";

const ShopList = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [search, setSearch] = useState("");
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [vendors, setVendors] = useState<DBVendor[]>([]);
  const [productVendorIds, setProductVendorIds] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("vendors").select("*");
      if (data) setVendors(data);
      setLoading(false);
    };
    fetch();
  }, []);

  // Search products by name when search query changes
  useEffect(() => {
    if (!search.trim()) {
      setProductVendorIds(null);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("vendor_id")
        .ilike("name", `%${search.trim()}%`);
      if (data) {
        setProductVendorIds(new Set(data.map((p) => p.vendor_id)));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = vendors.filter((v) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesShop = v.shop_name.toLowerCase().includes(q) || (v.categories || []).some((c) => c.toLowerCase().includes(q));
      const matchesProduct = productVendorIds?.has(v.id);
      if (!matchesShop && !matchesProduct) return false;
    }
    if (deliveryOnly && !v.delivery_available) return false;
    if (openOnly && !v.is_open) return false;
    if (categoryFilter && !(v.categories || []).some((c) => c.toLowerCase().includes(categoryFilter.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder={t("home.search")} value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="mx-auto flex max-w-lg gap-2 px-4 pb-3 overflow-x-auto">
          <button onClick={() => setOpenOnly(!openOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${openOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
            {t("shop.open")}
          </button>
          <button onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${deliveryOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
            {t("shop.delivery")}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        {categoryFilter && <p className="mb-3 text-xs text-muted-foreground">Showing shops for <span className="font-semibold text-foreground">{categoryFilter}</span></p>}
        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((vendor) => (
              <Link key={vendor.id} to={`/shop/${vendor.id}`} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md active:scale-[0.98]">
                <div className="relative h-36 overflow-hidden bg-muted">
                  {vendor.shop_image_url && <img src={vendor.shop_image_url} alt={vendor.shop_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                  {!vendor.is_open && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">{t("shop.closed")}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <h3 className="font-semibold text-foreground">{vendor.shop_name}</h3>
                  {vendor.categories && <p className="text-xs text-muted-foreground line-clamp-1">{vendor.categories.join(" · ")}</p>}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {vendor.location && <span>{vendor.location}</span>}
                    {vendor.rating ? <span>⭐ {vendor.rating}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">No shops found.</div>
        )}
      </div>
    </div>
  );
};

export default ShopList;
