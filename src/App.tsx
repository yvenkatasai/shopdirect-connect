import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import LanguageSelection from "./pages/LanguageSelection";
import Auth from "./pages/Auth";
import RoleSelection from "./pages/RoleSelection";
import VendorSetup from "./pages/VendorSetup";
import Index from "./pages/Index";
import ShopList from "./pages/ShopList";
import ShopDetail from "./pages/ShopDetail";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Rentals from "./pages/Rentals";
import VendorDashboard from "./pages/VendorDashboard";
import VendorAddProduct from "./pages/VendorAddProduct";
import VendorInventory from "./pages/VendorInventory";
import CustomerOrders from "./pages/CustomerOrders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isLanguageSelected } = useLanguage();
  const { user, role, loading, hasVendorShop } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isLanguageSelected) return <LanguageSelection />;

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (!role) {
    return (
      <Routes>
        <Route path="/role-select" element={<RoleSelection />} />
        <Route path="*" element={<Navigate to="/role-select" replace />} />
      </Routes>
    );
  }

  if (role === "vendor" && !hasVendorShop) {
    return (
      <Routes>
        <Route path="/vendor-setup" element={<VendorSetup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/vendor-setup" replace />} />
      </Routes>
    );
  }

  if (role === "vendor") {
    return (
      <Routes>
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor/add-product" element={<VendorAddProduct />} />
        <Route path="/vendor/inventory" element={<VendorInventory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/vendor" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shops" element={<ShopList />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/settings" element={<Settings />} /> {/* Keep as fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
