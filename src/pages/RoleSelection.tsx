import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Store } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const RoleSelection = () => {
  const { selectRole } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role: "customer" | "vendor") => {
    setLoading(true);
    const { error } = await selectRole(role);
    if (error) toast.error(error);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h2 className="mb-2 text-center text-lg font-bold text-foreground">{t("role.title")}</h2>
        <div className="mt-6 space-y-4">
          <button
            onClick={() => handleSelect("customer")}
            disabled={loading}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-5 transition-all hover:border-primary active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{t("role.customer")}</p>
              <p className="text-xs text-muted-foreground">{t("role.customerDesc")}</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("vendor")}
            disabled={loading}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-5 transition-all hover:border-accent active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Store className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{t("role.vendor")}</p>
              <p className="text-xs text-muted-foreground">{t("role.vendorDesc")}</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
