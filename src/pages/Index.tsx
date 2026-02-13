import { MapPin, Search, ChevronRight, Clock } from "lucide-react";
import ProfileMenu from "@/components/ProfileMenu";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DBProduct, DBVendor } from "@/types/database";
import { Wrench, Zap, Droplets, PaintBucket, Hammer, Fence, Package, Building2 } from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Cement & Construction": Building2,
  "Bricks, Sand & Aggregates": Package,
  "Electrical Items": Zap,
  "Plumbing Supplies": Droplets,
  "Hand & Power Tools": Hammer,
  "Paint & Accessories": PaintBucket,
  "Garden Tools": Fence,
  "Hardware & Fasteners": Wrench,
  "Tools for Rent": Hammer,
};

const categories = [
  "Cement & Construction", "Bricks, Sand & Aggregates", "Electrical Items",
  "Plumbing Supplies", "Hand & Power Tools", "Paint & Accessories",
  "Garden Tools", "Hardware & Fasteners",
];

const Index = () => {
  const { t } = useLanguage();
  const [vendors, setVendors] = useState<DBVendor[]>([]);
  const [rentalProducts, setRentalProducts] = useState<(DBProduct & { vendor?: DBVendor })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: vData }, { data: pData }] = await Promise.all([
        supabase.from("vendors").select("*").limit(10),
        supabase.from("products").select("*, vendors(*)").in("type", ["rent", "both"]).eq("in_stock", true).limit(4),
      ]);
      if (vData) setVendors(vData);
      if (pData) setRentalProducts(pData.map((p: any) => ({ ...p, vendor: p.vendors })));
      setLoading(false);
    };
    fetch();
  }, []);

  const openVendors = vendors.filter((v) => v.is_open);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("home.deliveringTo")}</p>
              <button className="flex items-center gap-1 text-sm font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Vijayawada, Main Road
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-4">
          <Link to="/shops" className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:border-primary/30">
            <Search className="h-4 w-4" />
            <span className="text-sm">{t("home.search")}</span>
          </Link>
        </motion.div>

        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="mt-4 rounded-lg bg-primary px-4 py-3">
          <p className="text-xs font-semibold text-primary-foreground">{t("home.directFromShops")}</p>
          <p className="mt-0.5 text-[11px] text-primary-foreground/80">{t("home.directFromShopsDesc")}</p>
        </motion.div>

        {/* Categories */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="mt-6">
          <h2 className="mb-3 text-base font-bold text-foreground">{t("home.browseCategories")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Package;
              return (
                <Link key={cat} to={`/shops?category=${encodeURIComponent(cat)}`} className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-xs font-medium leading-tight text-foreground">{cat}</span>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Rent Tools */}
        {rentalProducts.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }} className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" /> {t("home.rentTools")}
              </h2>
              <Link to="/rentals" className="text-xs font-medium text-primary">{t("home.viewAll")}</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {rentalProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                  <div className="relative h-32 overflow-hidden bg-muted">
                    {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                      <Clock className="h-3 w-3" /> {t("product.forRent")}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">₹{product.rental_price_daily}/day</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Nearby Shops */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }} className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">{t("home.nearbyShops")}</h2>
            <Link to="/shops" className="text-xs font-medium text-primary">{t("home.viewAll")}</Link>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : vendors.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No shops available yet</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              {vendors.map((vendor) => (
                <Link key={vendor.id} to={`/shop/${vendor.id}`} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md active:scale-[0.98]">
                  <div className="relative h-36 overflow-hidden bg-muted">
                    {vendor.shop_image_url && <img src={vendor.shop_image_url} alt={vendor.shop_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                    {!vendor.is_open && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                        <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">{t("shop.closed")}</span>
                      </div>
                    )}
                    {vendor.delivery_available && (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
                        {t("shop.delivers")}
                      </span>
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
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
