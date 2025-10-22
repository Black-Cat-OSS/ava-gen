import { useTranslation } from 'react-i18next';
import { Button, Callout, RefreshIcon } from '@/shared/ui';
import { AvatarCard } from '@/widgets';
import { useAvatarGallery } from './AvatarGalleryContext';

export const AvatarGallery = () => {
  const { t } = useTranslation();
  const { avatars, isLoading, isLoadingMore, isError, isRefreshing, error, onRefresh } = useAvatarGallery();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('pages.home.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Callout title={t('pages.home.error')} type='error' subtitle={error?.message}/>
    );
  }

  if (!isRefreshing && avatars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{t('pages.home.noAvatars')}</p>
        <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshIcon isRefreshing={isRefreshing} className="mr-2" />
          {isRefreshing ? t('pages.home.refreshing') : t('pages.home.refresh')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {avatars.map(avatar => (
        <AvatarCard key={avatar.id} avatar={avatar} />
      ))}
      {isLoadingMore && (
        <div className="col-span-full text-center py-4">
          <p className="text-muted-foreground">{t('pages.home.loading')}</p>
        </div>
      )}
    </div>
  );
};
