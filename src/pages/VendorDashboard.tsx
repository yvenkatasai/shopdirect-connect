import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, IndianRupee, Clock, Check, X, Truck, Settings, Plus, List } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface VendorOrder {
  id: string;
  customer_name: string | null;
  total_amount: number;
  status: string;
  order_type: string;
  fulfillment_type: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-accent/20 text-accent-foreground",
  confirmed: "bg-primary/10 text-primary",
  preparing: "bg-primary/10 text-primary",
  out_for_delivery: "bg-success/10 text-success",
  ready_for_pickup: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  ready_for_pickup: "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

const VendorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [vendor, setVendor] = useState<{ id: string; shop_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Get vendor info
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id, shop_name")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (vendorData) {
        setVendor(vendorData);
        // Get orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("vendor_id", vendorData.id)
          .order("created_at", { ascending: false });
        
        if (ordersData) setOrders(ordersData as VendorOrder[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus as any })
      .eq("id", orderId);
    
    if (error) {
      toast.error(error.message);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order updated`);
    }
  };

  const todayOrders = orders.length;
  const todayRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-primary">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-base font-bold text-primary-foreground">{vendor?.shop_name || "My Shop"}</h1>
            <p className="text-[10px] text-primary-foreground/70">{t("vendor.dashboard")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/vendor/inventory" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground">
              <List className="h-4 w-4" />
            </Link>
            <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground">
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4">
        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Package className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{todayOrders}</p>
            <p className="text-[10px] text-muted-foreground">{t("vendor.todayOrders")}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <IndianRupee className="mx-auto h-5 w-5 text-success" />
            <p className="mt-1 text-lg font-bold text-foreground">₹{todayRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{t("vendor.revenue")}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-1 text-lg font-bold text-foreground">{pendingOrders}</p>
            <p className="text-[10px] text-muted-foreground">{t("vendor.pending")}</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="mt-6 text-base font-bold text-foreground">{t("vendor.orders")}</h2>
        
        {orders.length === 0 ? (
          <div className="mt-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
            <Link to="/vendor/add-product" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> {t("vendor.addProduct")}
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{order.customer_name || "Customer"}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status] || ""}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      {order.fulfillment_type === "delivery" ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                      {order.fulfillment_type === "delivery" ? "Delivery" : "Pickup"}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">{order.order_type}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
                </div>
                {order.status === "pending" && (
                  <div className="flex border-t border-border">
                    <button
                      onClick={() => updateStatus(order.id, "confirmed")}
                      className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs font-semibold text-success hover:bg-success/5 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> {t("vendor.accept")}
                    </button>
                    <div className="w-px bg-border" />
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> {t("vendor.reject")}
                    </button>
                  </div>
                )}
                {order.status === "confirmed" && (
                  <div className="border-t border-border">
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="w-full py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      {t("vendor.markPreparing")}
                    </button>
                  </div>
                )}
                {order.status === "preparing" && (
                  <div className="border-t border-border">
                    <button
                      onClick={() => updateStatus(order.id, order.fulfillment_type === "delivery" ? "out_for_delivery" : "ready_for_pickup")}
                      className="w-full py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      {order.fulfillment_type === "delivery" ? t("vendor.markDelivery") : t("vendor.markPickup")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Product button */}
      <Link
        to="/vendor/add-product"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 active:scale-95 transition-all"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default VendorDashboard;
