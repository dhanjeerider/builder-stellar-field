import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-none",
            activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-transparent border-border text-foreground hover:bg-accent",
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
