import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PalleteApi } from '@/shared/api';

//TODO: Add shared types for Pagination
type UsePalletesParams = {
  pick: number;
  offset: number;
};

export const usePalletes = ({ pick, offset }: UsePalletesParams) => {
  return useQuery({
    queryKey: ['palletes', pick, offset],
    queryFn: () => PalleteApi.getAll(pick, offset),
    placeholderData: keepPreviousData,
  });
};
