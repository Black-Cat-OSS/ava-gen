import { useQuery } from '@tanstack/react-query';
import { avatarApi } from '@/shared/api';
import type { ColorPalette } from '@/features/color-palette/types/types';

/**
 * Custom hook to fetch color palettes with Suspense support.
 * Uses TanStack Query to manage data fetching, caching, and revalidation.
 *
 * @returns {ColorPalette[]} An array of color palettes.
 */
export const useColorPalettesSuspense = (): ColorPalette[] => {
  const { data } = useQuery<ColorPalette[], Error>({
    queryKey: ['colorPalettes'],
    queryFn: avatarApi.getColorPalettes,
    staleTime: Infinity, // Palettes are static, no need to refetch often
  });

  if (!data) {
    throw new Promise(() => {}); // Suspense fallback
  }

  return data;
};
