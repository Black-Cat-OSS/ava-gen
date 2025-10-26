import { useQuery } from '@tanstack/react-query';
import { avatarApi } from '../../api/avatar';

export const useAvatar = (id: string | undefined) => {
  const query = useQuery({
    queryKey: ['avatar', id],
    queryFn: () => avatarApi.getAvatar(id!),
    enabled: !!id,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

