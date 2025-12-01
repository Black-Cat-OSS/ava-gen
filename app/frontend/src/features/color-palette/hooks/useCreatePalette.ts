import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PalleteApi } from '@/shared/api/pallete';
import type { Pallete } from '@/entities';

/**
 * Хук для создания новой палитры
 * После успешного создания инвалидирует кеш палитр
 *
 * @returns Объект мутации с функцией для создания палитры
 */
export const useCreatePalette = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Pallete, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await PalleteApi.post(data as Pallete);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['palettes'] });
    },
  });
};
