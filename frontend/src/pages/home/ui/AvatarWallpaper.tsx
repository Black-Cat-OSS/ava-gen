import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui';

export const AvatarWallpaper = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
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
