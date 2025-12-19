import { apiClient } from '@/shared/lib/utils/api-client';
import type { GenerateAvatarAngular, GenerateAvatarResponse } from './types';

export const v2 = {
  generate: async (params: GenerateAvatarAngular): Promise<GenerateAvatarResponse> => {
    const endpoint = '/api/v2/generate';
    const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
    return response.data;
  },
};
