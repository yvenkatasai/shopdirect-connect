import { Shop } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Truck } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
  variant?: "horizontal" | "vertical";
}

const ShopCard = ({ shop, variant = "vertical" }: ShopCardProps) => {
  if (variant === "horizontal") {
    return (
      <Link
        to={`/shop/${shop.id}`}
        className="flex min-w-[260px] snap-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md active:scale-[0.98]"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
          <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" />
          {!shop.isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="text-[10px] font-bold text-primary-foreground">CLOSED</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between py-0.5">
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{shop.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {shop.distance}
              <Star className="h-3 w-3 fill-accent text-accent" /> {shop.rating}
            </div>
          </div>
          {shop.deliveryAvailable && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-success">
              <Truck className="h-3 w-3" /> Shop Delivery Available
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/shop/${shop.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={shop.image} alt={shop.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        {!shop.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">CLOSED</span>
          </div>
        )}
        {shop.deliveryAvailable && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
            <Truck className="h-3 w-3" /> Shop Delivery
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="font-semibold text-foreground">{shop.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{shop.categories.join(" · ")}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {shop.distance}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {shop.deliveryTime}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /> {shop.rating} ({shop.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
