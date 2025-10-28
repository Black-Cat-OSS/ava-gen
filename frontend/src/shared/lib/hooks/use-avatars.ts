import { useQuery } from '@tanstack/react-query';
import { AvatarApi } from '../../api/avatar';
import type { avatarTypes } from '@/shared/api';

export const useAvatars = (params: avatarTypes.ListAvatarsParams) => {
  return useQuery({
    queryKey: ['avatars', params],
    queryFn: () => AvatarApi.getAll(params.pick, params.offset),
  });
};
