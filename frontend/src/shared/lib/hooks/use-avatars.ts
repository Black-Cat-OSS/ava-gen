import { useQuery } from '@tanstack/react-query';
import { avatarApi, type ListAvatarsParams } from '../../api/avatar';

export const useAvatars = (params?: ListAvatarsParams) => {
  const query = useQuery({
    queryKey: ['avatars', params],
    queryFn: () => avatarApi.list(params),
  });

  return {
    ...query,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};
