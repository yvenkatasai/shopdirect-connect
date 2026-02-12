import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Globe, LogOut, User, Check, Moon, Sun, Store, Package, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const languages: { code: Language; native: string }[] = [
  { code: "en", native: "English" },
  { code: "te", native: "తెలుగు" },
  { code: "hi", native: "हिन्दी" },
];

const Settings = () => {
  const { user, signOut, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  // Profile editing
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Vendor shop settings
  const [showShopSettings, setShowShopSettings] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [savingShop, setSavingShop] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Load profile
    supabase.from("profiles").select("*").eq("auth_user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setProfileName(data.name || "");
        setProfilePhone(data.phone || "");
        setProfileAddress(data.address || "");
      }
    });
    // Load vendor settings
    if (role === "vendor") {
      supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setShopName(data.shop_name || "");
          setShopDesc(data.shop_description || "");
          setShopPhone(data.phone || "");
          setShopLocation(data.location || "");
          setDeliveryCharge(String(data.delivery_charge || 0));
          setDeliveryAvailable(data.delivery_available || false);
        }
      });
    }
  }, [user, role]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      name: profileName.trim(),
      phone: profilePhone.trim() || null,
      address: profileAddress.trim() || null,
    }).eq("auth_user_id", user.id);
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const saveShopSettings = async () => {
    if (!user) return;
    setSavingShop(true);
    const { error } = await supabase.from("vendors").update({
      shop_name: shopName.trim(),
      shop_description: shopDesc.trim() || null,
      phone: shopPhone.trim() || null,
      location: shopLocation.trim() || null,
      delivery_charge: Number(deliveryCharge) || 0,
      delivery_available: deliveryAvailable,
    }).eq("user_id", user.id);
    setSavingShop(false);
    if (error) toast.error(error.message);
    else toast.success("Shop settings updated");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to={role === "vendor" ? "/vendor" : "/"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">{t("settings.title")}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4 space-y-3">
        {/* Profile card */}
        <button onClick={() => setShowProfile(!showProfile)} className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              <User className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{profileName || user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{role || "User"}</p>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${showProfile ? "rotate-90" : ""}`} />
        </button>

        {showProfile && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Name</label>
              <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Phone</label>
              <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Address</label>
              <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <button onClick={saveProfile} disabled={savingProfile}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
              {savingProfile ? "Saving…" : "Save Profile"}
            </button>
          </div>
        )}

        {/* Shop Settings (vendor only) */}
        {role === "vendor" && (
          <>
            <button onClick={() => setShowShopSettings(!showShopSettings)} className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{t("vendor.shopSettings")}</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${showShopSettings ? "rotate-90" : ""}`} />
            </button>

            {showShopSettings && (
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Shop Name</label>
                  <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Description</label>
                  <textarea value={shopDesc} onChange={(e) => setShopDesc(e.target.value)} rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Phone</label>
                  <input type="tel" value={shopPhone} onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Location</label>
                  <input type="text" value={shopLocation} onChange={(e) => setShopLocation(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Delivery Available</label>
                  <button onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                    className={`h-6 w-11 rounded-full transition-colors ${deliveryAvailable ? "bg-primary" : "bg-muted"}`}>
                    <div className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${deliveryAvailable ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {deliveryAvailable && (
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Delivery Charge (₹)</label>
                    <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                )}
                <button onClick={saveShopSettings} disabled={savingShop}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                  {savingShop ? "Saving…" : "Save Shop Settings"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Dark Mode */}
        <button onClick={toggleDarkMode} className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <span className="text-sm font-medium text-foreground">Dark Mode</span>
          </div>
          <div className={`h-6 w-11 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}>
            <div className={`h-5 w-5 rounded-full bg-card shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </button>

        {/* Language */}
        <button onClick={() => setShowLangPicker(!showLangPicker)} className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t("settings.language")}</span>
          </div>
          <span className="text-sm text-muted-foreground">{languageNames[language]}</span>
        </button>

        {showLangPicker && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border last:border-b-0">
                <span>{lang.native}</span>
                {language === lang.code && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        )}

        {/* Order History link (customer) */}
        {role === "customer" && (
          <Link to="/orders" className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{t("nav.orders")}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}

        {/* Logout */}
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg border border-destructive/20 bg-card p-4 text-destructive">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">{t("settings.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
