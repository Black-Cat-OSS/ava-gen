import { GeneratorApi } from '@/shared/api';
import type {
  GenerateAvatarAngular,
  GenerateAvatarProcedural,
  GenerateEmojiAvatarParams,
} from '@/shared/api';
import { useMutation } from '@tanstack/react-query';

export const useGenerateAvatar = () => {
  return {
    v1: useMutation({
      mutationFn: (params: GenerateAvatarProcedural) => GeneratorApi.v1.generate(params),
    }),
    v2: useMutation({
      mutationFn: (params: GenerateAvatarAngular) => GeneratorApi.v2.generate(params),
    }),
    v3: useMutation({
      mutationFn: (params: GenerateEmojiAvatarParams) => GeneratorApi.v3.generate(params),
    }),
  };
};
