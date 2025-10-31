import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Хук для удаления палитры
 * После успешного удаления инвалидирует кеш палитр
 */
export const useDeletePalette = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/palettes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete palette');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['palettes'] });
    },
  });
};

