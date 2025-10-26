import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { PaletteResponse } from '@/shared/api/avatar';

/**
 * Hook for fetching color palettes from the API
 */
export const useColorPalettes = () => {
  const query = useInfiniteQuery({
    queryKey: ['color-palettes'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get<PaletteResponse>(
        `/api/palettes?pick=20&offset=${pageParam}`
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.hasMore) {
        return allPages.reduce((sum, page) => sum + page.palettes.length, 0);
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten all pages into a single array
  const allPalettes = query.data?.pages.flatMap(page => page.palettes) || [];

  return {
    ...query,
    data: allPalettes,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
