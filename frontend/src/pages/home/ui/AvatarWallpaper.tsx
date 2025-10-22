import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui';
import { useAvatars } from '@/shared/lib';
import { avatarApi } from '@/shared/api/avatar';

export const AvatarWallpaper = () => {
  const { t } = useTranslation();
  
  const { data: avatarsData, isLoading, isError } = useAvatars({ pick: 5, offset: 0 });
  const avatars = avatarsData?.avatars || [];

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
        ) : isError || avatars.length === 0 ? (
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
            {avatars.slice(0, 5).map((avatar, index) => (
              <div
                key={avatar.id}
                className="w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full border-4 border-background shadow-lg overflow-hidden transition-transform hover:scale-110"
                style={{ 
                  marginLeft: index > 0 ? '-75px' : 0, 
                  zIndex: avatars.length - index 
                }}
              >
                <img
                  src={avatarApi.getImageUrl(avatar.id, undefined, 128)}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
                  }}
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
