import type { Avatar } from '@/entities';
import { apiClient } from '@/shared/lib/utils/api-client';
import type { ApiPagination, ApiRequest } from '@/shared/api/api';

export const AvatarApi: ApiRequest<Avatar> = {
  getAll: async (pick: number, offset: number): Promise<ApiPagination<Avatar>> => {
    const searchParams = new URLSearchParams();
    if (pick) searchParams.append('pick', pick.toString());
    if (offset) searchParams.append('offset', offset.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/api/list?${query}` : '/api/list';

    const response = await apiClient.get<ApiPagination<Avatar>>(endpoint);
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
};
