import { Link, useLocation } from "react-router-dom";
import { Home, Play, Tv, Grid3X3, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Explore", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Play },
  { name: "TV Shows", href: "/tv", icon: Tv },
  { name: "Genres", href: "/genres", icon: Grid3X3 },
  { name: "FAQs", href: "/faqs", icon: Info },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
