import { vendorOrders } from "@/data/mock-data";
import { ArrowLeft, Package, IndianRupee, TrendingUp, Check, X, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-accent/20 text-accent-foreground",
  confirmed: "bg-primary/10 text-primary",
  preparing: "bg-primary/10 text-primary",
  out_for_delivery: "bg-success/10 text-success",
  ready_for_pickup: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  ready_for_pickup: "Ready for Pickup",
  completed: "Completed",
};

const VendorDashboard = () => {
  const [orders, setOrders] = useState(vendorOrders);
  const todayOrders = orders.length;
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
    );
    toast.success(`Order ${orderId} updated`);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-primary">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-primary-foreground">Sri Lakshmi Hardware</h1>
            <p className="text-[10px] text-primary-foreground/70">Vendor Dashboard</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4">
        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Package className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-lg font-bold text-foreground">{todayOrders}</p>
            <p className="text-[10px] text-muted-foreground">Today's Orders</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <IndianRupee className="mx-auto h-5 w-5 text-success" />
            <p className="mt-1 text-lg font-bold text-foreground">₹{todayRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Revenue</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-1 text-lg font-bold text-foreground">{pendingOrders}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="mt-6 text-base font-bold text-foreground">Orders</h2>
        <div className="mt-3 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div>
                  <span className="text-sm font-semibold text-foreground">{order.id}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{order.time}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    {order.type === "delivery" ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                    {order.type === "delivery" ? "Delivery" : "Pickup"}
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      {item.quantity}× {item.name} — ₹{item.price * item.quantity}
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">Total: ₹{order.total}</p>
              </div>
              {order.status === "pending" && (
                <div className="flex border-t border-border">
                  <button
                    onClick={() => updateStatus(order.id, "confirmed")}
                    className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs font-semibold text-success hover:bg-success/5 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <div className="w-px bg-border" />
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
                    className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
              {order.status === "confirmed" && (
                <div className="border-t border-border">
                  <button
                    onClick={() => updateStatus(order.id, "preparing")}
                    className="w-full py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    Mark as Preparing
                  </button>
                </div>
              )}
              {order.status === "preparing" && (
                <div className="border-t border-border">
                  <button
                    onClick={() => updateStatus(order.id, order.type === "delivery" ? "out_for_delivery" : "ready_for_pickup")}
                    className="w-full py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                  >
                    {order.type === "delivery" ? "Mark as Out for Delivery" : "Mark as Ready for Pickup"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
