import { apiClient } from '@/shared/lib/utils/api-client';
import type { ApiPagination, ApiRequest } from '../api';
import type { Pallete } from '@/entities';

export const PalleteApi: ApiRequest<Pallete> = {
  getAll: async (pick: number, offset: number): Promise<ApiPagination<Pallete>> => {
    const response = await apiClient.get<ApiPagination<Pallete>>(
      `/api/v1/palettes?pick=${pick}&offset=${offset}`,
    );
    return response.data;
  },
  getById: async (id: string): Promise<Pallete> => {
    const response = await apiClient.get<Pallete>(`/api/v1/palettes/${id}`);
    return response.data;
  },
  post: async (data: Pallete): Promise<Pallete> => {
    const response = await apiClient.post<Pallete>('/api/v1/palettes', data);
    return response.data;
  },
  put: async (id: string, data: Pallete): Promise<Pallete> => {
    const response = await apiClient.put<Pallete>(`/api/v1/palettes/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/v1/palettes/${id}`);
  },
};
