import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Minus, Plus, Truck, Store, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const { items, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [placing, setPlacing] = useState(false);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Group items by vendor
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const vendorId = item.vendor.id;
    if (!acc[vendorId]) acc[vendorId] = [];
    acc[vendorId].push(item);
    return acc;
  }, {});

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!customerName.trim()) { toast.error("Please enter your name"); return; }
    setPlacing(true);

    try {
      // Create one order per vendor
      for (const [vendorId, vendorItems] of Object.entries(grouped)) {
        const hasRentals = vendorItems.some((i) => i.isRental);
        const orderTotal = vendorItems.reduce((sum, i) => {
          if (i.isRental) {
            const price = i.rentalDuration === "weekly" ? (i.product.rental_price_weekly || 0) : (i.product.rental_price_daily || 0);
            return sum + price * i.quantity;
          }
          return sum + (i.product.price || 0) * i.quantity;
        }, 0);

        const depositTotal = vendorItems
          .filter((i) => i.isRental)
          .reduce((sum, i) => sum + (i.product.deposit || 0) * i.quantity, 0);

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            customer_id: user.id,
            vendor_id: vendorId,
            total_amount: orderTotal,
            order_type: hasRentals ? "rent" : "buy",
            fulfillment_type: fulfillment,
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim() || null,
            delivery_address: fulfillment === "delivery" ? deliveryAddress.trim() || null : null,
            deposit_amount: depositTotal,
          })
          .select("id")
          .single();

        if (orderError) throw orderError;

        // Add order items
        const orderItems = vendorItems.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: item.isRental
            ? (item.rentalDuration === "weekly" ? (item.product.rental_price_weekly || 0) : (item.product.rental_price_daily || 0))
            : (item.product.price || 0),
          is_rental: item.isRental || false,
          rental_duration: item.isRental ? (item.rentalDuration || "daily") : null,
          deposit_amount: item.isRental ? (item.product.deposit || 0) : 0,
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }

      toast.success("Order placed successfully!");
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">{t("cart.title")}</h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="ml-auto text-xs text-destructive font-medium">{t("cart.clearAll")}</button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">{t("cart.empty")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("cart.emptyDesc")}</p>
            <Link to="/shops" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">{t("cart.browseShops")}</Link>
          </div>
        ) : (
          <>
            {/* Items by vendor */}
            {Object.entries(grouped).map(([vendorId, vendorItems]) => {
              const vendor = vendorItems[0].vendor;
              const shopTotal = vendorItems.reduce((sum, i) => {
                if (i.isRental) {
                  const p = i.rentalDuration === "weekly" ? (i.product.rental_price_weekly || 0) : (i.product.rental_price_daily || 0);
                  return sum + p * i.quantity;
                }
                return sum + (i.product.price || 0) * i.quantity;
              }, 0);
              return (
                <div key={vendorId} className="mb-4 rounded-lg border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
                    <Store className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{vendor.shop_name}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {vendorItems.map(({ product, quantity, isRental, rentalDuration }) => {
                      const unitPrice = isRental
                        ? (rentalDuration === "weekly" ? (product.rental_price_weekly || 0) : (product.rental_price_daily || 0))
                        : (product.price || 0);
                      return (
                        <div key={product.id} className="flex items-center gap-3 px-3 py-3">
                          <div className="h-14 w-14 rounded-md overflow-hidden bg-muted">
                            {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {isRental ? (
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ₹{unitPrice}/{rentalDuration === "weekly" ? "week" : "day"}</span>
                              ) : (
                                `₹${unitPrice} / ${product.unit}`
                              )}
                            </p>
                          </div>
                          {!isRental && (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateQuantity(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                              <span className="w-5 text-center text-xs font-semibold text-foreground">{quantity}</span>
                              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                            </div>
                          )}
                          <p className="text-sm font-semibold text-foreground w-16 text-right">₹{unitPrice * quantity}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">{t("cart.shopSubtotal")}</span>
                    <span className="text-sm font-bold text-foreground">₹{shopTotal}</span>
                  </div>
                </div>
              );
            })}

            {/* Checkout form */}
            <div className="mb-4 rounded-lg border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Order Details</h3>
              
              {/* Fulfillment */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setFulfillment("delivery")} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${fulfillment === "delivery" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}>
                  <Truck className="h-3.5 w-3.5" /> Delivery
                </button>
                <button onClick={() => setFulfillment("pickup")} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${fulfillment === "pickup" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}>
                  <Package className="h-3.5 w-3.5" /> Pickup
                </button>
              </div>

              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name *" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              {fulfillment === "delivery" && (
                <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery address" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              )}
            </div>

            {/* Total */}
            <div className="mb-4 rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.itemsTotal")}</span>
                <span className="font-semibold text-foreground">₹{totalPrice}</span>
              </div>
              <div className="mt-3 border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">{t("cart.total")}</span>
                <span className="text-lg font-bold text-foreground">₹{totalPrice}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={placing} className="w-full rounded-lg bg-accent py-3 text-center text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50">
              {placing ? "Placing..." : `${t("cart.placeOrder")} · ₹${totalPrice}`}
            </button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground mb-4">{t("cart.paymentNote")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
