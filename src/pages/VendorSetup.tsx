import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import { motion } from "framer-motion";

const categoryOptions = [
  "Cement & Construction",
  "Bricks, Sand & Aggregates",
  "Electrical Items",
  "Plumbing Supplies",
  "Hand & Power Tools",
  "Paint & Accessories",
  "Garden Tools",
  "Hardware & Fasteners",
];

const VendorSetup = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopName.trim() || selectedCategories.length === 0) return;

    setLoading(true);
    const { error } = await supabase.from("vendors").insert({
      user_id: user.id,
      shop_name: shopName.trim(),
      location: location.trim(),
      phone: phone.trim(),
      categories: selectedCategories,
      delivery_available: deliveryAvailable,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Shop created successfully!");
      // Force refresh
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-foreground">{t("vendor.setup.title")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("vendor.setup.shopName")}</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("vendor.setup.location")}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("vendor.setup.phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-foreground">{t("vendor.setup.categories")}</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategories.includes(cat)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <span className="text-sm text-foreground">{t("vendor.setup.delivery")}</span>
            <button
              type="button"
              onClick={() => setDeliveryAvailable(!deliveryAvailable)}
              className={`h-6 w-11 rounded-full transition-colors ${
                deliveryAvailable ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${
                  deliveryAvailable ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !shopName.trim() || selectedCategories.length === 0}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "..." : t("vendor.setup.submit")}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorSetup;
