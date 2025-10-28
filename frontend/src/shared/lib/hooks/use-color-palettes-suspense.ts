import { useSuspenseQuery } from '@tanstack/react-query';
import { PaletteApi } from '@/shared/api';
import type { paletteTypes } from '@/shared/api';

export const useColorPalettesSuspense = (params: paletteTypes.ListPalletesParams) => {
  return useSuspenseQuery({
    queryKey: ['color-palettes', params],
    queryFn: () => PaletteApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
