import { shops, categories } from "@/data/mock-data";
import ShopCard from "@/components/ShopCard";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

const ShopList = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [search, setSearch] = useState("");
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = shops;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (deliveryOnly) result = result.filter((s) => s.deliveryAvailable);
    if (openOnly) result = result.filter((s) => s.isOpen);
    return result;
  }, [search, deliveryOnly, openOnly]);

  const categoryName = categoryFilter ? categories.find((c) => c.id === categoryFilter)?.name : null;

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
              placeholder="Search shops…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto flex max-w-lg gap-2 px-4 pb-3 overflow-x-auto">
          <button
            onClick={() => setOpenOnly(!openOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              openOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            Open Now
          </button>
          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              deliveryOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            Delivery Available
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4">
        {categoryName && (
          <p className="mb-3 text-xs text-muted-foreground">
            Showing shops for <span className="font-semibold text-foreground">{categoryName}</span>
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} variant="vertical" />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No shops found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;
