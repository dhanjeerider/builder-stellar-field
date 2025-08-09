import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  threshold = 100
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight) {
      if (hasNextPage && !isFetching) {
        setIsFetching(true);
      }
    }
  }, [hasNextPage, isFetching, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      try {
        await fetchNextPage();
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching, fetchNextPage]);

  return { isFetching };
}
