import { products, shops } from "@/data/mock-data";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const Rentals = () => {
  const rentalProducts = products.filter((p) => p.isRental);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = rentalProducts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (availableOnly) result = result.filter((p) => p.inStock);
    return result;
  }, [search, availableOnly]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rental tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="mx-auto flex max-w-lg gap-2 px-4 pb-3">
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              availableOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            Available Now
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        {/* Info banner */}
        <div className="mb-4 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-foreground">
            <Clock className="h-3.5 w-3.5 text-accent" />
            Rent power tools from local shops
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Pick up from shop or get it delivered. Refundable deposit required.
          </p>
        </div>

        <h2 className="text-base font-bold text-foreground mb-3">
          {filtered.length} tool{filtered.length !== 1 ? "s" : ""} available for rent
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No rental tools found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;
