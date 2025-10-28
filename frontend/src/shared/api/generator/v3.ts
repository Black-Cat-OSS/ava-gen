import { apiClient } from '@/shared/lib/utils/api-client';
import type { GenerateEmojiAvatarParams, GenerateAvatarResponse } from './types';

export const v3 = {
  generate: async (params: GenerateEmojiAvatarParams): Promise<GenerateAvatarResponse> => {
    const endpoint = '/api/v3/generate';
    const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
    return response.data;
  },
};
