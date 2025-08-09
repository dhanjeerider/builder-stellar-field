import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Sun, Moon, X, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { LiveSearch } from './LiveSearch';
import { WatchlistModal } from './WatchlistModal';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Genres', href: '/genres' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 neu-header border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden neu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 neu-card flex items-center justify-center bg-primary">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MovieStream
              </span>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-muted/30 rounded-xl p-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-background text-foreground neu-card-inset"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side - Search and Actions */}
          <div className="flex items-center space-x-2">
            {/* Search (Desktop) */}
            <div className="hidden md:flex">
              <LiveSearch className="w-64" />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="neu-button md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="neu-button"
              onClick={() => setIsWatchlistOpen(true)}
            >
              <Bookmark className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="neu-button" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-border/50">
          <LiveSearch className="w-full" />
        </div>
      )}
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border/50 pt-20 pb-6 px-4 neu-card">
            <nav className="space-y-3 max-w-sm mx-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 text-center",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-foreground hover:text-primary hover:bg-muted/50 neu-button"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Additional Mobile Menu Items */}
              <div className="border-t border-border/30 pt-3 mt-4">
                <button
                  onClick={() => {
                    setIsWatchlistOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 text-center text-foreground hover:text-primary hover:bg-muted/50 neu-button"
                >
                  My Watchlist
                </button>

                <Link
                  to="/faqs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 text-center text-foreground hover:text-primary hover:bg-muted/50 neu-button"
                >
                  FAQs & Help
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Watchlist Modal */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
      />
    </>
  );
}
