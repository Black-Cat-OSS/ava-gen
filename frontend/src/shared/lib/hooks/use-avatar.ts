import { useQuery } from '@tanstack/react-query';
import { AvatarApi } from '@/shared/api';

export const useAvatar = (id: string) => {
  return useQuery({
    queryKey: ['avatar', id],
    queryFn: () => AvatarApi.getById(id),
  });
};
