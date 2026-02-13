import { Home, Search, ShoppingCart, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t("nav.home"), path: "/" },
    { icon: Search, label: t("nav.shops"), path: "/shops" },
    { icon: Clock, label: t("nav.rentals"), path: "/rentals" },
    { icon: ShoppingCart, label: t("nav.cart"), path: "/cart" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || (path === "/shops" && location.pathname.startsWith("/shop"));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors relative ${
                isActive ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              {path === "/cart" && totalItems > 0 && (
                <span className="absolute -top-1 right-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground px-1">
                  {totalItems}
                </span>
              )}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
