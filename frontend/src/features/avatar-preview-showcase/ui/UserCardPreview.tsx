import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * UserCardPreview component - shows avatar in a user card component context
 */
export const UserCardPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex items-center space-x-3 p-3">
        <img
          src={avatarApi.getImageUrl(avatar.id, undefined, 64)}
          alt={avatar.name}
          className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 64px (6th power of 2)"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground truncate">
            {t('contexts.userCard.userName')}
          </h4>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t('contexts.userCard.status')}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground truncate">
          {t('contexts.userCard.email')}
        </p>
      </div>
    </div>
  );
};
