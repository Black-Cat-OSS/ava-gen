import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { AvatarApi } from '../../api/avatar';

export const useAvatars = (params: { pick: number; offset: number }) => {
  return useQuery({
    queryKey: ['avatars', params],
    queryFn: () => AvatarApi.getAll(params.pick, params.offset),
    placeholderData: keepPreviousData,
  });
};

export const useAvatarsSuspense = (params: { pick: number; offset: number }) => {
  return useSuspenseQuery({
    queryKey: ['avatars', params],
    queryFn: () => AvatarApi.getAll(params.pick, params.offset),
  });
};
