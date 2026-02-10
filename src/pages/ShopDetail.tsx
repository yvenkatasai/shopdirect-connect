import { useParams, Link } from "react-router-dom";
import { shops, products } from "@/data/mock-data";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Star, MapPin, Clock, Phone, Truck } from "lucide-react";

const ShopDetail = () => {
  const { id } = useParams();
  const shop = shops.find((s) => s.id === id);
  const shopProducts = products.filter((p) => p.shopId === id);

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-48">
        <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <Link
          to="/shops"
          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-bold text-primary-foreground">{shop.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-primary-foreground/80">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /> {shop.rating} ({shop.reviewCount})</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {shop.distance}</span>
            <span className={`font-semibold ${shop.isOpen ? "text-green-300" : "text-red-300"}`}>
              {shop.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        {/* Shop info */}
        <div className="mt-4 rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {shop.address}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> {shop.phone}
          </div>
          {shop.deliveryAvailable && (
            <div className="flex items-center gap-2 text-xs font-medium text-success">
              <Truck className="h-3.5 w-3.5" /> Shop delivers directly · {shop.deliveryTime}
            </div>
          )}
          {!shop.deliveryAvailable && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" /> Pickup only
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {shop.categories.map((cat) => (
            <span key={cat} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {cat}
            </span>
          ))}
        </div>

        {/* Products */}
        <h2 className="mt-6 text-base font-bold text-foreground">Products ({shopProducts.length})</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {shopProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {shopProducts.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No products listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
