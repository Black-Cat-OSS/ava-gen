import { useState } from 'react';
import { useAvatars } from '@/shared/lib';
import {
  AvatarWallpaper,
  AvatarControls,
  AvatarGallery,
  LoadMoreButton,
  AvatarGalleryProvider,
} from './';
import { AvatarPreviewShowcase } from '@/features/avatar-preview-showcase';

export const HomePage = () => {
  const [offset, setOffset] = useState(0);

  const { data, isError, error, refetch, isRefetching } = useAvatars({
    pick: 10,
    offset,
  });

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + 10);
  };

  const handleRefresh = async () => {
    try {
      setOffset(0);
      await refetch();
    } catch {
      //TODO: add error handling
    }
  };

  const contextValue = {
    avatars: data?.items ?? [],
    isError,
    isRefreshing: isRefetching,
    error,
    totalCount: data?.pagination.total ?? 0,
    hasMore: data?.pagination.hasMore ?? false,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
  };

  return (
    <div className="py-8">
      <div className="max-w">
        <AvatarWallpaper />

        <AvatarGalleryProvider value={contextValue}>
          <div className="mb-8">
            {data?.items && data?.items.length > 0 && <AvatarControls />}
            <AvatarGallery />
          </div>

          {data?.pagination.hasMore && <LoadMoreButton />}
        </AvatarGalleryProvider>

        <AvatarPreviewShowcase />
      </div>
    </div>
  );
};
