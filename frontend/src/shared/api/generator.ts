import { apiClient } from '@/shared/lib/utils/api-client';

export interface BaseGenerateParams {
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
}

export interface GenerateAvatarParams extends BaseGenerateParams {
  seed?: string;
}

export interface GenerateAvatarResponse extends BaseGenerateParams {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  version: string;
  generatorType?: string;
}

export interface GenerateEmojiAvatarParams extends BaseGenerateParams {
  emoji: string;
  backgroundType: 'solid' | 'linear' | 'radial';
  angle?: number;
  emojiSize?: 'small' | 'medium' | 'large';
}

export const GeneratorApi = {
  v1: {
    generate: async (
      params: GenerateAvatarParams & { type: 'pixelize' },
    ): Promise<GenerateAvatarResponse> => {
      const endpoint = '/api/v1/generate';
      const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
      return response.data;
    },
  },
  v2: {
    generate: async (
      params: GenerateAvatarParams & { angle: number },
    ): Promise<GenerateAvatarResponse> => {
      const endpoint = '/api/v2/generate';
      const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
      return response.data;
    },
  },
  v3: {
    generate: async (params: GenerateEmojiAvatarParams): Promise<GenerateAvatarResponse> => {
      const endpoint = '/api/v3/generate';
      const response = await apiClient.post<GenerateAvatarResponse>(endpoint, params);
      return response.data;
    },
  },
};
