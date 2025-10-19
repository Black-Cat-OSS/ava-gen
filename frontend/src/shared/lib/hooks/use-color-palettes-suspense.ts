import { useSuspenseQuery } from '@tanstack/react-query';
import { avatarApi } from '@/shared/api';

/**
 * Suspense-compatible hook for fetching color palettes from the API
 * Throws promise during loading, making it compatible with React Suspense
 */
export const useColorPalettesSuspense = () => {
  return useSuspenseQuery({
    queryKey: ['color-palettes'],
    queryFn: avatarApi.getColorPalettes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
