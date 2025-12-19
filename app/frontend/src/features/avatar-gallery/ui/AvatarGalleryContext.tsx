import type { Avatar } from '@/entities';
import { createContext, type ReactNode } from 'react';

interface AvatarGalleryContextValue {
  avatars: Avatar[];
  isError: boolean;
  isRefreshing: boolean;
  isLoading: boolean;
  error?: Error | null;
  totalCount: number;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const AvatarGalleryContext = createContext<AvatarGalleryContextValue | undefined>(undefined);

export { AvatarGalleryContext };

interface AvatarGalleryProviderProps {
  children: ReactNode;
  value: AvatarGalleryContextValue;
}

export const AvatarGalleryProvider = ({ children, value }: AvatarGalleryProviderProps) => {
  return <AvatarGalleryContext.Provider value={value}>{children}</AvatarGalleryContext.Provider>;
};
