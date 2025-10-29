import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useAvatarGallery } from './AvatarGalleryContext';

export const LoadMoreButton = () => {
  const { t } = useTranslation();
  const { isRefreshing, onLoadMore } = useAvatarGallery();

  return (
    <div className="text-center mt-8">
      <Button onClick={onLoadMore} variant="outline" disabled={isRefreshing} size="lg">
        {isRefreshing ? t('pages.home.loading') : t('pages.home.loadMore')}
      </Button>
    </div>
  );
};
