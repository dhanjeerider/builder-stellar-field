import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { LanguageProvider } from "./hooks/use-language";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Search from "./pages/Search";
import GenrePage from "./pages/GenrePage";
import Genres from "./pages/Genres";
import Watch from "./pages/Watch";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="moviestream-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<MovieDetail />} />
              <Route path="/watch/:type/:id" element={<Watch />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv" element={<TVShows />} />
              <Route path="/search" element={<Search />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genre/:slug" element={<GenrePage />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="/faqs" element={<PlaceholderPage title="FAQs" />} />
              <Route path="/more" element={<PlaceholderPage title="More" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
