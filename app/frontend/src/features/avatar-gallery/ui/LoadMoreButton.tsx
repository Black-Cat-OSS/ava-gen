import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useAvatarGallery } from '../hooks';

export const LoadMoreButton = () => {
  const { t } = useTranslation();
  const { hasMore, isRefreshing, onLoadMore } = useAvatarGallery();

  if (!hasMore) {
    return null;
  }

  return (
    <div className="text-center mt-8">
      <Button onClick={onLoadMore} variant="outline" disabled={isRefreshing} size="lg">
        {isRefreshing ? t('pages.home.loading') : t('pages.home.loadMore')}
      </Button>
    </div>
  );
};
