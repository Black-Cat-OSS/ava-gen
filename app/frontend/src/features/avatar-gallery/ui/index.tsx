import { useState } from 'react';
import { ErrorBoundary } from '@/shared/ui';
import { useAvatars } from '@/shared/lib';
import { AvatarGalleryProvider } from './AvatarGalleryContext';
import { AvatarGallery } from './AvatarGallery';
import { AvatarControls } from './AvatarControls';
import { LoadMoreButton } from './LoadMoreButton';

const AvatarGalleryFeature = () => {
  const [pick, setPick] = useState(12);

  const { data, isError, error, refetch, isRefetching, isLoading } = useAvatars({
    pick,
    offset: 0,
  });

  const handleLoadMore = () => {
    if (!data?.pagination.hasMore) return;
    setPick(prevPick => prevPick + 12);
  };

  const handleRefresh = async () => {
    setPick(pick);
    await refetch();
  };

  const contextValue = {
    avatars: data?.items ?? [],
    isError,
    isRefreshing: isRefetching,
    isLoading,
    error,
    totalCount: data?.pagination.total ?? 0,
    hasMore: data?.pagination.hasMore ?? false,
    onRefresh: handleRefresh,
    onLoadMore: handleLoadMore,
  };

  return (
    <div className="mb-8">
      <ErrorBoundary>
        <AvatarGalleryProvider value={contextValue}>
          <AvatarControls />
          <AvatarGallery />
          <LoadMoreButton />
        </AvatarGalleryProvider>
      </ErrorBoundary>
    </div>
  );
};

export default AvatarGalleryFeature;
