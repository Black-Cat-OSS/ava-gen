import { useQuery } from '@tanstack/react-query';
import { AvatarApi } from '@/shared/api';
import type { Avatar } from '@/entities';

export const useAvatar = (id: string) => {
  return useQuery<Avatar>({
    queryKey: ['avatar', id],
    queryFn: () => AvatarApi.getById(id),
  });
};
