import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import type { Pallete } from '@/entities';

interface PalettesResponse {
  palettes: Pallete[];
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}

const PICK_SIZE = 10;

/**
 * @description 
 * Хук для получения палитр с бесконечной пагинацией
 * Использует React Query Suspense для декларативного управления 
 * загрузкой и ошибками
 * Требует обёртки в ErrorBoundary и Suspense
 * @deprecated use usePalletes instead
 * @see usePalletes
 * 
 */
export const useInfinitePalettes = () => {
  return useSuspenseInfiniteQuery<PalettesResponse>({
    queryKey: ['palettes', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(
        `${baseUrl}/api/palettes?pick=${PICK_SIZE}&offset=${pageParam}`,
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch palettes: ${response.status}`);
      }
      
      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + PICK_SIZE;
      }
      return undefined;
    },
  });
};

