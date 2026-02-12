import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { DBOrder } from "@/types/database";

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

const CustomerOrders = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<(DBOrder & { vendor_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, vendors(shop_name)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      if (data) {
        setOrders(data.map((o: any) => ({ ...o, vendor_name: o.vendors?.shop_name })));
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">{t("nav.orders")}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4 space-y-3">
        {orders.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
            <Link to="/shops" className="mt-3 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse Shops
            </Link>
          </div>
        )}
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.vendor_name || "Shop"}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status] || ""}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div className="px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {order.fulfillment_type === "delivery" ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                  {order.fulfillment_type === "delivery" ? "Delivery" : "Pickup"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{order.order_type}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;
