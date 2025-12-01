import { apiClient } from '@/shared/lib/utils/api-client';
import type { GenerateLowpolyAvatarParams, GenerateAvatarResponse } from './types';

export const v4 = {
  generate: async (params: GenerateLowpolyAvatarParams): Promise<GenerateAvatarResponse> => {
    const endpoint = '/api/v4/generate';
    const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
    return response.data;
  },
};
