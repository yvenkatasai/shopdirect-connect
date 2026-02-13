import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import {
  User, LogOut, Globe, Moon, Sun, Store, Package, ChevronRight, Check, X,
} from "lucide-react";
import { toast } from "sonner";

const languages: { code: Language; native: string }[] = [
  { code: "en", native: "English" },
  { code: "te", native: "తెలుగు" },
  { code: "hi", native: "हिन्दी" },
];

type View = "main" | "profile" | "language" | "shop";

const ProfileMenu = () => {
  const { user, signOut, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("main");
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const menuRef = useRef<HTMLDivElement>(null);

  // Profile fields
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Shop fields
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [savingShop, setSavingShop] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    supabase.from("profiles").select("*").eq("auth_user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setProfileName(data.name || "");
        setProfilePhone(data.phone || "");
        setProfileAddress(data.address || "");
      }
    });
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
  }, [user, role, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setView("main");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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

  const initials = profileName ? profileName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || "U");

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => { setOpen(!open); setView("main"); }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {view === "main" && (
            <div className="py-2">
              {/* User info */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{profileName || user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{role || "User"}</p>
              </div>

              {/* Profile */}
              <button onClick={() => setView("profile")} className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primary" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Shop settings (vendor) */}
              {role === "vendor" && (
                <button onClick={() => setView("shop")} className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-primary" />
                    <span>{t("vendor.shopSettings")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              )}

              {/* Dark mode */}
              <button onClick={toggleDarkMode} className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                  <span>Dark Mode</span>
                </div>
                <div className={`h-5 w-9 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}>
                  <div className={`h-4 w-4 rounded-full bg-card shadow transition-transform mt-0.5 ${darkMode ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </button>

              {/* Language */}
              <button onClick={() => setView("language")} className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{t("settings.language")}</span>
                </div>
                <span className="text-xs text-muted-foreground">{languageNames[language]}</span>
              </button>

              {/* Order history (customer) */}
              {role === "customer" && (
                <Link to="/orders" onClick={() => setOpen(false)} className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-primary" />
                    <span>{t("nav.orders")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}

              {/* Logout */}
              <div className="border-t border-border mt-1">
                <button onClick={() => { signOut(); setOpen(false); }} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>{t("settings.logout")}</span>
                </button>
              </div>
            </div>
          )}

          {view === "profile" && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground">Edit Profile</h3>
                <button onClick={() => setView("main")}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
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

          {view === "language" && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2 mb-1">
                <h3 className="text-sm font-bold text-foreground">{t("settings.language")}</h3>
                <button onClick={() => setView("main")}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              {languages.map((lang) => (
                <button key={lang.code} onClick={() => { setLanguage(lang.code); setView("main"); }}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                  <span>{lang.native}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {view === "shop" && (
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground">{t("vendor.shopSettings")}</h3>
                <button onClick={() => setView("main")}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
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
                  className={`h-5 w-9 rounded-full transition-colors ${deliveryAvailable ? "bg-primary" : "bg-muted"}`}>
                  <div className={`h-4 w-4 rounded-full bg-card shadow transition-transform ${deliveryAvailable ? "translate-x-4" : "translate-x-0.5"}`} />
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
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
