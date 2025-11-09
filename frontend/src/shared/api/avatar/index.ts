import type { Avatar } from '@/entities';
import { apiClient } from '@/shared/lib/utils/api-client';
import type { ApiPagination, ApiRequest } from '@/shared/api';

export const AvatarApi: ApiRequest<Avatar> = {
  getAll: async (pick: number, offset: number): Promise<ApiPagination<Avatar>> => {
    const searchParams = new URLSearchParams();
    if (pick) searchParams.append('pick', pick.toString());
    if (offset) searchParams.append('offset', offset.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/api/v1/list?${query}` : '/api/v1/list';

    const response = await apiClient.get<ApiPagination<Avatar>>(endpoint);
    return response.data;
  },

  getById: async (id: string): Promise<Avatar> => {
    const response = await apiClient.get<Avatar>(`/api/v1/${id}`);
    return response.data;
  },

  post: async (data: Avatar): Promise<Avatar> => {
    const response = await apiClient.post<Avatar>('/api/v1', data);
    return response.data;
  },

  put: async (id: string, data: Avatar): Promise<Avatar> => {
    const response = await apiClient.put<Avatar>(`/api/v1/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/v1/${id}`);
  },
};
