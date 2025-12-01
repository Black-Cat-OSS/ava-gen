import { GeneratorApi } from '@/shared/api';
import type {
  GenerateAvatarAngular,
  GenerateAvatarProcedural,
  GenerateEmojiAvatarParams,
  GenerateLowpolyAvatarParams,
} from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useGenerateAvatar = () => {
  const [lastUsedVersion, setLastUsedVersion] = useState<'v1' | 'v2' | 'v3' | 'v4' | null>(null);

  const v1 = useMutation({
    mutationFn: (params: GenerateAvatarProcedural) => {
      setLastUsedVersion('v1');
      return GeneratorApi.v1.generate(params);
    },
  });

  const v2 = useMutation({
    mutationFn: (params: GenerateAvatarAngular) => {
      setLastUsedVersion('v2');
      return GeneratorApi.v2.generate(params);
    },
  });

  const v3 = useMutation({
    mutationFn: (params: GenerateEmojiAvatarParams) => {
      setLastUsedVersion('v3');
      return GeneratorApi.v3.generate(params);
    },
  });

  const v4 = useMutation({
    mutationFn: (params: GenerateLowpolyAvatarParams) => {
      setLastUsedVersion('v4');
      return GeneratorApi.v4.generate(params);
    },
  });

  const mutations = { v1, v2, v3, v4 };
  const currentMutation = lastUsedVersion ? mutations[lastUsedVersion] : null;

  return {
    v1,
    v2,
    v3,
    v4,
    result: currentMutation?.data,
    isSuccess: currentMutation?.isSuccess ?? false,
    isLoading: currentMutation?.isPending ?? false,
    isError: currentMutation?.isError ?? false,
    error: currentMutation?.error,
    lastUsedVersion,
  };
};
