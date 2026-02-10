import { useParams, Link } from "react-router-dom";
import { products, shops } from "@/data/mock-data";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, Store, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const shop = product ? shops.find((s) => s.id === product.shopId) : null;
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [rentalDuration, setRentalDuration] = useState<"daily" | "weekly">("daily");

  if (!product || !shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleRentRequest = () => {
    toast.success(`Rental request sent to ${shop.name}! They'll confirm shortly.`);
  };

  const rentalPrice = product.rentalPrice?.[rentalDuration] ?? 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Image */}
      <div className="relative h-64 bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <Link
          to={product.isRental ? "/rentals" : `/shop/${shop.id}`}
          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {product.isRental && (
          <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <Clock className="h-3.5 w-3.5" /> FOR RENT
          </span>
        )}
      </div>

      <div className="mx-auto max-w-lg px-4">
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg font-bold text-foreground">{product.name}</h1>
            <span className={`mt-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              {product.inStock ? (product.isRental ? "Available" : "In Stock") : (product.isRental ? "Not Available" : "Out of Stock")}
            </span>
          </div>

          {/* Pricing */}
          {product.isRental && product.rentalPrice ? (
            <div className="mt-3">
              {/* Duration toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setRentalDuration("daily")}
                  className={`flex-1 rounded-lg border py-2.5 text-center text-sm font-semibold transition-colors ${
                    rentalDuration === "daily"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  ₹{product.rentalPrice.daily}/day
                </button>
                <button
                  onClick={() => setRentalDuration("weekly")}
                  className={`flex-1 rounded-lg border py-2.5 text-center text-sm font-semibold transition-colors ${
                    rentalDuration === "weekly"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  ₹{product.rentalPrice.weekly}/week
                </button>
              </div>
              {/* Deposit info */}
              {product.deposit && (
                <div className="flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Refundable Deposit: ₹{product.deposit}</p>
                    <p className="text-[10px] text-muted-foreground">Returned when you return the tool in good condition</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-1 text-2xl font-bold text-foreground">₹{product.price} <span className="text-sm font-normal text-muted-foreground">/ {product.unit}</span></p>
          )}
        </div>

        {/* Shop info */}
        <Link to={`/shop/${shop.id}`} className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{shop.name}</p>
            <p className="text-xs text-muted-foreground">{shop.distance} away</p>
          </div>
          {shop.deliveryAvailable && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-success">
              <Truck className="h-3 w-3" /> Delivers
            </span>
          )}
        </Link>

        {/* Description */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-foreground">Description</h2>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Specs */}
        {product.specs && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-foreground">Specifications</h2>
            <div className="mt-2 space-y-1.5">
              {product.specs.map((spec) => {
                const [label, value] = spec.split(": ");
                return (
                  <div key={spec} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      {product.inStock && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
            {product.isRental ? (
              <button
                onClick={handleRentRequest}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
              >
                <Clock className="h-4 w-4" />
                Rent {rentalDuration === "daily" ? "for ₹" + rentalPrice + "/day" : "for ₹" + rentalPrice + "/week"}
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart · ₹{product.price * quantity}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
