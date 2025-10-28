import { useInfiniteQuery } from '@tanstack/react-query';
import { PaletteApi } from '@/shared/api';
import type { paletteTypes } from '@/shared/api';

export const useColorPalettes = (params: paletteTypes.ListPalletesParams) => {
  const query = useInfiniteQuery({
    queryKey: ['color-palettes', params],
    queryFn: () => PaletteApi.list(params),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.hasMore) {
        return allPages.reduce((sum, page) => sum + page.palettes.length, 0);
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    data: query.data?.pages.flatMap(page => page.palettes),
    hasNextPage: query.data?.pages[query.data?.pages.length - 1].pagination.hasMore,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
