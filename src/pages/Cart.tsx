import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Minus, Plus, Trash2, Truck, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();

  // Group items by shop
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const shopId = item.shop.id;
    if (!acc[shopId]) acc[shopId] = [];
    acc[shopId].push(item);
    return acc;
  }, {});

  const handlePlaceOrder = () => {
    toast.success("Order placed! The shop will deliver directly to you.");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">Your Cart</h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="ml-auto text-xs text-destructive font-medium">
              Clear All
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Your cart is empty</p>
            <p className="mt-1 text-xs text-muted-foreground">Browse shops and add items to get started</p>
            <Link to="/shops" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse Shops
            </Link>
          </div>
        ) : (
          <>
            {/* Info banner */}
            <div className="mb-4 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Truck className="h-3.5 w-3.5" />
                Orders are delivered directly by each shop
              </p>
            </div>

            {/* Grouped items */}
            {Object.entries(grouped).map(([shopId, shopItems]) => {
              const shop = shopItems[0].shop;
              const shopTotal = shopItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
              return (
                <div key={shopId} className="mb-4 rounded-lg border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
                    <Store className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{shop.name}</span>
                    <span className="text-[10px] text-muted-foreground">· {shop.distance}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {shopItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 px-3 py-3">
                        <img src={product.image} alt={product.name} className="h-14 w-14 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">₹{product.price} / {product.unit}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold text-foreground">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-foreground w-16 text-right">₹{product.price * quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Shop subtotal</span>
                    <span className="text-sm font-bold text-foreground">₹{shopTotal}</span>
                  </div>
                </div>
              );
            })}

            {/* Total & Checkout */}
            <div className="mb-4 rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items Total</span>
                <span className="font-semibold text-foreground">₹{totalPrice}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-xs text-success font-medium">By shop</span>
              </div>
              <div className="mt-3 border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full rounded-lg bg-accent py-3 text-center text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
            >
              Place Order · ₹{totalPrice}
            </button>

            <p className="mt-2 text-center text-[10px] text-muted-foreground mb-4">
              Payment: Cash on Delivery or UPI at delivery
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
