import { apiClient } from '@/shared/lib/utils/api-client';
import type { PaletteResponse } from './avatar';

export const paletteApi = {
  list: async (): Promise<PaletteResponse> => {
    const response = await apiClient.get<PaletteResponse>('/api/palettes');
    return response.data;
  },
};