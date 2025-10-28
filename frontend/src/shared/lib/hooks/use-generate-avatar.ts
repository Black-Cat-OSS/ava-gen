import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GeneratorApi } from '@/shared/api';
import type { generatorTypes } from '@/shared/api';

export const useGenerateAvatar = () => {
  const queryClient = useQueryClient();

  return {
    v1: useMutation({
      mutationFn: (params: generatorTypes.GenerateAvatarProcedural) =>
        GeneratorApi.v1.generate(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['avatars'] });
      },
    }),
    v2: useMutation({
      mutationFn: (params: generatorTypes.GenerateAvatarAngular) =>
        GeneratorApi.v2.generate(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['avatars'] });
      },
    }),
    v3: useMutation({
      mutationFn: (params: generatorTypes.GenerateEmojiAvatarParams) =>
        GeneratorApi.v3.generate(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['avatars'] });
      },
    }),
  };
};
