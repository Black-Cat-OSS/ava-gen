import { useQuery } from '@tanstack/react-query';
import { avatarApi } from '@/shared/api';
import type { ColorPalette } from '@/features/color-palette/types/types';

/**
 * Custom hook to fetch color palettes.
 * Uses TanStack Query to manage data fetching, caching, and revalidation.
 *
 * @returns {{ data: ColorPalette[] | undefined; isLoading: boolean; isError: boolean; error: Error | null }}
 *   An object containing the fetched data, loading state, error state, and error object.
 */
export const useColorPalettes = () => {
  const { data, isLoading, isError, error } = useQuery<ColorPalette[], Error>({
    queryKey: ['colorPalettes'],
    queryFn: avatarApi.getColorPalettes,
    staleTime: Infinity, // Palettes are static, no need to refetch often
  });

  return { data, isLoading, isError, error };
};
