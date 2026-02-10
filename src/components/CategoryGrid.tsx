import { Category } from "@/data/mock-data";
import { Link } from "react-router-dom";

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            to={`/shops?category=${cat.id}`}
            className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-center text-xs font-medium leading-tight text-foreground">
              {cat.name}
            </span>
            <span className="text-[10px] text-muted-foreground">{cat.productCount} items</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
