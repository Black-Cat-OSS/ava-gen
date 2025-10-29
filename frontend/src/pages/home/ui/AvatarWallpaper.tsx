import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button, FailImage } from '@/shared/ui';
import { useAvatars } from '@/shared/lib';

export const AvatarWallpaper = () => {
  const { t } = useTranslation();

  const { data: avatarsData, isLoading, isError } = useAvatars({ pick: 5, offset: 0 });

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-8 h-90">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-muted animate-pulse"
                style={{ marginLeft: index > 0 ? '-80px' : 0 }}
              />
            ))}
          </div>
        ) : isError || !avatarsData || !avatarsData.items ? (
          <div className="flex items-center space-x-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-background shadow-lg flex items-center justify-center"
                style={{ marginLeft: index > 0 ? '-80px' : 0, zIndex: 3 - index }}
              >
                <div className="text-primary/60 text-xs font-bold">?</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center">
            {avatarsData.items.map((avatar, index) => (
              <div
                key={avatar.id}
                className="w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full border-4 border-background shadow-lg overflow-hidden transition-transform hover:scale-110"
                style={{
                  marginLeft: index > 0 ? '-75px' : 0,
                  zIndex: avatarsData?.items.length - index,
                }}
              >
                <img
                  src={avatar.id}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                  onError={() => <FailImage />}
                />
              </div>
            ))}
          </div>
        )}
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
