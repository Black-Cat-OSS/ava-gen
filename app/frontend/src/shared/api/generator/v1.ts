import { apiClient } from '@/shared/lib/utils/api-client';
import type { GenerateAvatarProcedural, GenerateAvatarResponse } from './types';

export const v1 = {
  generate: async (params: GenerateAvatarProcedural): Promise<GenerateAvatarResponse> => {
    const endpoint = '/api/v1/generate';
    const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
    return response.data;
  },
};
