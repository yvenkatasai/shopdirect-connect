import { Product } from "@/data/mock-data";
import { useCart } from "@/contexts/CartContext";
import { Plus, Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { items, addItem } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="relative h-32 overflow-hidden">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-destructive">
              {product.isRental ? "Not Available" : "Out of Stock"}
            </span>
          </div>
        )}
        {product.isRental && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            <Clock className="h-3 w-3" /> FOR RENT
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{product.name}</h3>
          {product.isRental && product.rentalPrice ? (
            <p className="mt-1 text-xs text-muted-foreground">₹{product.rentalPrice.daily}/day · ₹{product.rentalPrice.weekly}/week</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">per {product.unit}</p>
          )}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          {product.isRental && product.rentalPrice ? (
            <span className="text-base font-bold text-foreground">₹{product.rentalPrice.daily}<span className="text-xs font-normal text-muted-foreground">/day</span></span>
          ) : (
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
          )}
          {!product.isRental && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (product.inStock && !inCart) addItem(product);
              }}
              disabled={!product.inStock || inCart}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                inCart
                  ? "bg-success text-success-foreground"
                  : product.inStock
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}
          {product.isRental && product.inStock && (
            <Link
              to={`/product/${product.id}`}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all"
            >
              Rent Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
