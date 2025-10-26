import { useQuery } from '@tanstack/react-query';
import { avatarApi } from '../../api/avatar';

export const useAvatar = (id: string) => {
  return useQuery({
    queryKey: ['avatar', id],
    queryFn: () => avatarApi.getById(id),
  });
};
