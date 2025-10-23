import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * ProfilePreview component - shows avatar in a profile card context
 */
export const ProfilePreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex flex-col items-center text-center space-y-3">
        <img
          src={avatarApi.getImageUrl(avatar.id, undefined, 80)}
          alt={avatar.name}
          className={`w-20 h-20 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border-2 border-border shadow-sm`}
          title="Avatar size: 80px (6th power of 2)"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
        }}
      />
      
      <div>
        <h4 className="text-sm font-semibold text-foreground">
          {t('contexts.profile.userName')}
        </h4>
        <p className="text-xs text-muted-foreground mb-1">
          {t('contexts.profile.role')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('contexts.profile.location')}
        </p>
      </div>
    </div>
  );
};
