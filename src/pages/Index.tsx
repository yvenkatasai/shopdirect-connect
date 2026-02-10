import { MapPin, Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, shops } from "@/data/mock-data";
import CategoryGrid from "@/components/CategoryGrid";
import ShopCard from "@/components/ShopCard";
import { motion } from "framer-motion";

const Index = () => {
  const openShops = shops.filter((s) => s.isOpen);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Delivering to</p>
              <button className="flex items-center gap-1 text-sm font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Vijayawada, Main Road
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              V
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Link
            to="/shops"
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:border-primary/30"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search cement, pipes, tools…</span>
          </Link>
        </motion.div>

        {/* Delivery info banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-4 rounded-lg bg-primary px-4 py-3"
        >
          <p className="text-xs font-semibold text-primary-foreground">🏪 Direct from Local Shops</p>
          <p className="mt-0.5 text-[11px] text-primary-foreground/80">
            No middleman. Shops deliver directly to you — or pick up yourself.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Browse Categories</h2>
          </div>
          <CategoryGrid categories={categories} />
        </motion.section>

        {/* Nearby Shops */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Nearby Shops</h2>
            <Link to="/shops" className="text-xs font-medium text-primary">
              View All →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x -mx-4 px-4 scrollbar-hide">
            {openShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} variant="horizontal" />
            ))}
          </div>
        </motion.section>

        {/* All Shops */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-6 mb-4"
        >
          <h2 className="mb-3 text-base font-bold text-foreground">All Shops Near You</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} variant="vertical" />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
