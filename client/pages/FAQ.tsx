import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Play,
  Bookmark,
  Globe,
  Star,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card className="neu-card border-border/50">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{question}</span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <div className="text-muted-foreground leading-relaxed">{answer}</div>
        </CardContent>
      )}
    </Card>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqs = [
    {
      question: "How to use MovieStream?",
      answer: (
        <div className="space-y-4">
          <p>
            MovieStream is your ultimate destination for watching movies and TV
            shows. Here's how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>
              <strong>Browse Content:</strong> Use the homepage to explore
              popular, trending, and top-rated content
            </li>
            <li>
              <strong>Search:</strong> Use the search bar at the top to find
              specific movies or TV shows
            </li>
            <li>
              <strong>Select Language:</strong> Click the globe icon to choose
              your preferred language for regional content
            </li>
            <li>
              <strong>Watch:</strong> Click the play button on any movie/show to
              start watching
            </li>
            <li>
              <strong>Add to Watchlist:</strong> Save movies for later by
              clicking the bookmark icon
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: "How to search for movies and TV shows?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Search className="h-5 w-5" />
            <span className="font-semibold">Search Features</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Live Search:</strong> Start typing in the search bar to
              see instant results
            </li>
            <li>
              <strong>Auto-complete:</strong> Get suggestions as you type
            </li>
            <li>
              <strong>Multi-search:</strong> Search across movies, TV shows, and
              people
            </li>
            <li>
              <strong>Quick Results:</strong> Click on any result to go directly
              to the content
            </li>
            <li>
              <strong>View All:</strong> Click "View all results" to see the
              complete search page
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How to play movies and TV shows?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Play className="h-5 w-5" />
            <span className="font-semibold">Video Player</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Click Play:</strong> Click the play button on any movie
              poster or detail page
            </li>
            <li>
              <strong>Server Selection:</strong> Choose from multiple streaming
              servers if one doesn't work
            </li>
            <li>
              <strong>TV Shows:</strong> Select season and episode for TV shows
            </li>
            <li>
              <strong>Quality:</strong> Most content is available in HD quality
            </li>
            <li>
              <strong>Fullscreen:</strong> Use the fullscreen button for better
              viewing experience
            </li>
            <li>
              <strong>Share:</strong> Share the content with friends using the
              share button
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How to manage my watchlist?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Bookmark className="h-5 w-5" />
            <span className="font-semibold">Watchlist Management</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Add to Watchlist:</strong> Click the "+" button or "Add to
              Watchlist" on any movie/show
            </li>
            <li>
              <strong>View Watchlist:</strong> Click the bookmark icon in the
              header to open your watchlist
            </li>
            <li>
              <strong>Remove Items:</strong> Click the trash icon next to any
              item to remove it
            </li>
            <li>
              <strong>Clear All:</strong> Use "Clear All" button to empty your
              entire watchlist
            </li>
            <li>
              <strong>Persistent Storage:</strong> Your watchlist is saved
              locally and persists between sessions
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How to browse content by language and region?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Globe className="h-5 w-5" />
            <span className="font-semibold">Language Selection</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Language Selector:</strong> Click the globe icon in the
              header
            </li>
            <li>
              <strong>Choose Language:</strong> Select from English, Hindi,
              Spanish, French, German, and more
            </li>
            <li>
              <strong>Regional Content:</strong> When you select Hindi, you'll
              see Bollywood and Indian content
            </li>
            <li>
              <strong>Original Language:</strong> Content will be filtered by
              the original language of production
            </li>
            <li>
              <strong>Auto-Region:</strong> Some languages automatically filter
              by region (e.g., Hindi shows Indian content)
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How to browse by genres and categories?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Content Discovery</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Genre Pages:</strong> Visit the Genres page to browse by
              Action, Drama, Comedy, etc.
            </li>
            <li>
              <strong>Category Tabs:</strong> Use Movies, TV Shows, and Trending
              tabs on the homepage
            </li>
            <li>
              <strong>Filtering:</strong> Use Popular, Top Rated, Upcoming
              filters on category pages
            </li>
            <li>
              <strong>Infinite Scroll:</strong> Content loads automatically as
              you scroll down
            </li>
            <li>
              <strong>View All:</strong> Click "View All" buttons to see
              complete category listings
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "What are the content ratings and quality indicators?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Star className="h-5 w-5" />
            <span className="font-semibold">Ratings & Quality</span>
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>TMDB Ratings:</strong> Star ratings are from The Movie
              Database (TMDB)
            </li>
            <li>
              <strong>Quality Badges:</strong> HD badges indicate
              high-definition content
            </li>
            <li>
              <strong>Release Year:</strong> Shows the original release year of
              the content
            </li>
            <li>
              <strong>Vote Average:</strong> Ratings are based on user votes
              from TMDB
            </li>
            <li>
              <strong>Content Type:</strong> Clear indicators for Movies vs TV
              Shows
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How to use the mobile app features?",
      answer: (
        <div className="space-y-4">
          <p className="font-semibold text-primary">
            📱 Mobile Optimized Features
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Responsive Design:</strong> All pages work perfectly on
              mobile devices
            </li>
            <li>
              <strong>Touch Navigation:</strong> Swipe through movie carousels
              and content
            </li>
            <li>
              <strong>Mobile Search:</strong> Tap the search icon for a
              full-width search experience
            </li>
            <li>
              <strong>Bottom Navigation:</strong> Easy access to main sections
              via bottom nav bar
            </li>
            <li>
              <strong>Native Sharing:</strong> Use your device's native share
              menu to share content
            </li>
            <li>
              <strong>Optimized Cards:</strong> Movie cards are sized perfectly
              for mobile viewing
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "What streaming servers are available?",
      answer: (
        <div className="space-y-4">
          <p className="font-semibold text-primary">
            🖥️ Multiple Streaming Options
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Primary Server:</strong> VidSrc with multiple backup
              options
            </li>
            <li>
              <strong>Backup Servers:</strong> 10+ alternative servers if
              primary doesn't work
            </li>
            <li>
              <strong>Quality Options:</strong> Most servers offer HD and 4K
              quality when available
            </li>
            <li>
              <strong>Download Support:</strong> Some servers offer download
              capabilities
            </li>
            <li>
              <strong>Fast Streaming:</strong> Optimized servers for quick
              loading and minimal buffering
            </li>
            <li>
              <strong>Switch Servers:</strong> Easily switch between servers if
              one has issues
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "Troubleshooting common issues",
      answer: (
        <div className="space-y-4">
          <p className="font-semibold text-primary">🔧 Common Solutions</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Video Won't Load:</strong> Try switching to a different
              server in the player
            </li>
            <li>
              <strong>Slow Loading:</strong> Check your internet connection and
              try refreshing the page
            </li>
            <li>
              <strong>Search Not Working:</strong> Make sure you're typing at
              least 2 characters
            </li>
            <li>
              <strong>Content Not Found:</strong> The movie/show might not be
              available in your selected language
            </li>
            <li>
              <strong>Watchlist Issues:</strong> Clear your browser cache if
              watchlist items aren't saving
            </li>
            <li>
              <strong>Mobile Issues:</strong> Try refreshing the page or
              clearing browser cache
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to use MovieStream to discover and watch your favorite
          movies and TV shows. Find answers to common questions and get the most
          out of our platform.
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="neu-card mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Play className="h-6 w-6" />
            <span>Quick Start Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">1. Search</h3>
              <p className="text-sm text-muted-foreground">
                Find movies and shows using the search bar
              </p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">2. Choose Language</h3>
              <p className="text-sm text-muted-foreground">
                Select your preferred language from the globe icon
              </p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">3. Watch</h3>
              <p className="text-sm text-muted-foreground">
                Click play button to start streaming
              </p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <Bookmark className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">4. Save</h3>
              <p className="text-sm text-muted-foreground">
                Add to watchlist for later viewing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openItems.includes(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {/* Contact Support */}
      <Card className="neu-card mt-12 text-center">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            If you couldn't find the answer you're looking for, feel free to
            explore more or check our other pages.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <a href="/">Browse Movies</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/genres">Explore Genres</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/tv">TV Shows</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
