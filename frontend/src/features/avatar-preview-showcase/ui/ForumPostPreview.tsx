import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * ForumPostPreview component - shows avatar in a forum post context
 */
export const ForumPostPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <img
          src={avatarApi.getImageUrl(avatar.id, undefined, 128)}
          alt={avatar.name}
          className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 128px (7th power of 2)"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
          }}
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {t('contexts.forumPost.userName')}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t('contexts.forumPost.title')}
          </p>
        </div>
      </div>
      
      <div className="border-l-2 border-muted/50 pl-4">
        <p className="text-sm text-muted-foreground mb-2">
          {t('contexts.forumPost.text')}
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">
            {t('contexts.forumPost.replies')}
          </span>
        </div>
      </div>
    </div>
  );
};
