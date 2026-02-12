import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { DBProduct } from "@/types/database";

const Rentals = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("type", ["rent", "both"])
        .eq("is_active", true);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = products.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.description || "").toLowerCase().includes(q)) return false;
    }
    if (availableOnly && !p.in_stock) return false;
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
            <input type="text" placeholder={t("rentals.search")} value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="mx-auto flex max-w-lg gap-2 px-4 pb-3">
          <button onClick={() => setAvailableOnly(!availableOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${availableOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
            {t("rentals.availableNow")}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        <div className="mb-4 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-foreground">
            <Clock className="h-3.5 w-3.5 text-accent" /> {t("rentals.banner")}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{t("rentals.bannerDesc")}</p>
        </div>

        <h2 className="text-base font-bold text-foreground mb-3">
          {filtered.length} tool{filtered.length !== 1 ? "s" : ""} available for rent
        </h2>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                <div className="relative h-32 overflow-hidden bg-muted">
                  {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                  {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">{t("product.notAvailable")}</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                    <Clock className="h-3 w-3" /> {t("product.forRent")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{product.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">₹{product.rental_price_daily}/day · ₹{product.rental_price_weekly}/week</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">₹{product.rental_price_daily}<span className="text-xs font-normal text-muted-foreground">/day</span></span>
                    {product.in_stock && (
                      <span className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">{t("product.rentNow")}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">{t("rentals.noResults")}</div>
        )}
      </div>
    </div>
  );
};

export default Rentals;
