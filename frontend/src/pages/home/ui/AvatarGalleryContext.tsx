import type { Avatar } from '@/entities';
import { createContext, useContext, type ReactNode } from 'react';

interface AvatarGalleryContextValue {
  avatars: Avatar[];
  isError: boolean;
  isRefreshing: boolean;
  error?: Error | null;
  totalCount: number;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const AvatarGalleryContext = createContext<AvatarGalleryContextValue | undefined>(undefined);

interface AvatarGalleryProviderProps {
  children: ReactNode;
  value: AvatarGalleryContextValue;
}

export const AvatarGalleryProvider = ({ children, value }: AvatarGalleryProviderProps) => {
  return <AvatarGalleryContext.Provider value={value}>{children}</AvatarGalleryContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAvatarGallery = () => {
  const context = useContext(AvatarGalleryContext);
  if (context === undefined) {
    throw new Error('useAvatarGallery must be used within an AvatarGalleryProvider');
  }
  return context;
};
