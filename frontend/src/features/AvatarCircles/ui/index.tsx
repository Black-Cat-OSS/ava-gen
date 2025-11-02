import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button, ErrorBoundary } from '@/shared/ui';
import { lazy, Suspense } from 'react';
import { Skeleton } from './Skeleton';

const AvatarCircles = lazy(() => import('./AvatarCircles'));

const AvatarWallpaper = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-8 h-90">
        <ErrorBoundary>
          <Suspense fallback={<Skeleton />}>
            <AvatarCircles />
          </Suspense>
        </ErrorBoundary>
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-4">{t('pages.home.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('pages.home.subtitle')}</p>

      <Link to="/avatar-generator">
        <Button variant="default" size="lg">
          {t('pages.home.generateAvatar')}
        </Button>
      </Link>
    </div>
  );
};

export default AvatarWallpaper;
