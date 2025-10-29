import { Suspense } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, Callout } from '@/shared/ui';
import { useAvatarGallery } from '../hooks';
import { AvatarGallerySkeleton } from './AvatarGallerySkeleton';
import { AvatarCardList } from './AvatarCardList';

export const AvatarGallery = () => {
  const { t } = useTranslation();
  const { avatars, isError, isRefreshing, isLoading, error } = useAvatarGallery();

  if (isError) {
    return <Callout title={t('pages.home.error')} type="error" subtitle={error?.message} />;
  }

  if (isLoading) {
    return <AvatarGallerySkeleton />;
  }

  if (!isRefreshing && !isError && avatars && avatars.length === 0) {
    return (
      <div className="text-center py-8">
        <Callout
          type="warning"
          title={t('pages.home.noAvatars')}
          subtitle={t('pages.home.noAvatarsDescription')}
        >
          <Link to="/avatar-generator">
            <Button variant="default" size="lg" className="mt-4">
              {t('pages.home.createAvatar')}
            </Button>
          </Link>
        </Callout>
      </div>
    );
  }

  return (
    <Suspense fallback={<AvatarGallerySkeleton />}>
      {avatars && <AvatarCardList avatars={avatars} />}
    </Suspense>
  );
};
