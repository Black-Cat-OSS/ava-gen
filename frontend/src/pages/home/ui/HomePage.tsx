import { useState, useEffect } from 'react';
import { useAvatars } from '@/shared/lib';
import {
  AvatarWallpaper,
  AvatarControls,
  AvatarGallery,
  LoadMoreButton,
  AvatarGalleryProvider,
} from './';
import { AvatarPreviewShowcase } from '@/features/avatar-preview-showcase';
import type { Avatar } from '@/entities';

export const HomePage = () => {
  const [offset, setOffset] = useState(0);
  const [allAvatars, setAllAvatars] = useState<Avatar[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, error, refetch, isRefetching } = useAvatars({
    pick: 10,
    offset,
  });

  useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllAvatars(data.items);
      } else {
        setAllAvatars(prev => [...prev, ...data.items]);
      }
      setHasMore(data.pagination.hasMore);
    }
  }, [data, offset]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + 10);
  };

  const handleRefresh = async () => {
    try {
      setOffset(0);
      setHasMore(true);
      await refetch();
    } catch {
      //TODO: add error handling
    }
  };

  const showLoadMore = allAvatars.length > 0 && hasMore && !isLoading && !isRefetching;

  const isInitialLoading = isLoading && allAvatars.length === 0;
  const isLoadingMore = isLoading && allAvatars.length > 0;

  const contextValue = {
    avatars: allAvatars,
    isLoading: isInitialLoading,
    isLoadingMore,
    isError,
    isRefreshing: isRefetching,
    error,
    totalCount: data?.pagination.total ?? allAvatars.length,
    hasMore,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
  };

  return (
    <div className="py-8">
      <div className="max-w">
        <AvatarWallpaper />

        <AvatarGalleryProvider value={contextValue}>
          <div className="mb-8">
            {allAvatars.length > 0 && <AvatarControls />}
            <AvatarGallery />
          </div>

          {showLoadMore && <LoadMoreButton />}
        </AvatarGalleryProvider>

        <AvatarPreviewShowcase />
      </div>
    </div>
  );
};
