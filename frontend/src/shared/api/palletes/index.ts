import { apiClient } from '@/shared/lib/utils/api-client';
import type { ListPalletesParams, PaletteResponse } from './types';

export const PaletteApi = {
  list: async (params: ListPalletesParams): Promise<PaletteResponse> => {
    const response = await apiClient.get<PaletteResponse>(
      `/api/palettes?pick=${params.pick}&offset=${params.offset}`,
    );
    return response.data;
  },
};
