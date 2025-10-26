import type { Avatar } from '@/entities';
import { apiClient } from '@/shared/lib/utils/api-client';
import type { ApiPagination } from './api';

export interface ListAvatarsResponse {
  avatars: Avatar[];
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}

export interface ListAvatarsParams {
  pick?: number;
  offset?: number;
}

export interface PaletteResponse {
  palettes: Array<{
    name: string;
    primaryColor: string;
    foreignColor: string;
    key: string;
  }>;
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}

export const avatarApi = {
  getAll: async (pick: number, offset: number): Promise<ApiPagination<Avatar>> => {
    const searchParams = new URLSearchParams();
    if (pick) searchParams.append('pick', pick.toString());
    if (offset) searchParams.append('offset', offset.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/api/list?${query}` : '/api/list';

    const response = await apiClient.get<ApiPagination<Avatar>>(endpoint);
    return response.data;
  },

  list: async (params?: ListAvatarsParams): Promise<ListAvatarsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.pick) searchParams.append('pick', params.pick.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/api/list?${query}` : '/api/list';

    const response = await apiClient.get<ListAvatarsResponse>(endpoint);
    return response.data;
  },

  getById: async (id: string): Promise<Avatar> => {
    const response = await apiClient.get<Avatar>(`/api/${id}`);
    return response.data;
  },

  post: async (data: Avatar): Promise<Avatar> => {
    const response = await apiClient.post<Avatar>('/api', data);
    return response.data;
  },

  put: async (id: string, data: Avatar): Promise<Avatar> => {
    const response = await apiClient.put<Avatar>(`/api/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/${id}`);
  },

  generate: async (params: GenerateAvatarParams): Promise<GenerateAvatarResponse> => {
    const response = await apiClient.post<GenerateAvatarResponse>('/api/v1/generate', params);
    return response.data;
  },

  generateEmoji: async (params: GenerateEmojiAvatarParams): Promise<GenerateAvatarResponse> => {
    const response = await apiClient.post<GenerateAvatarResponse>('/api/v3/generate', params);
    return response.data;
  },

  getImageUrl: (id: string, filter?: string, size?: number): string => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (size) params.append('size', size.toString());
    const query = params.toString();
    return `/api/${id}${query ? `?${query}` : ''}`;
  },

  getColorPalettes: async (): Promise<PaletteResponse> => {
    const response = await apiClient.get<PaletteResponse>('/api/palettes');
    return response.data;
  },
};

export interface GenerateAvatarParams {
  seed?: string;
  type?: string;
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
}

export interface GenerateAvatarResponse {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  version: string;
  generatorType?: string;
}

export interface GenerateEmojiAvatarParams {
  emoji: string;
  backgroundType: 'solid' | 'linear' | 'radial';
  angle?: number;
  emojiSize?: 'small' | 'medium' | 'large';
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
}
