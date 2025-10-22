import { useTranslation } from 'react-i18next';
import { Button, RefreshIcon } from '@/shared/ui';
import { useAvatarGallery } from './AvatarGalleryContext';

export const AvatarControls = () => {
  const { t } = useTranslation();
  const { totalCount, isRefreshing, onRefresh } = useAvatarGallery();

  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {t('pages.home.avatarsFound')}: {totalCount}
      </div>
      <Button onClick={onRefresh} variant="outline" size="sm" disabled={isRefreshing}>
        <RefreshIcon isRefreshing={isRefreshing} className="mr-2" />
        {isRefreshing ? t('pages.home.refreshing') : t('pages.home.refresh')}
      </Button>
    </div>
  );
};
