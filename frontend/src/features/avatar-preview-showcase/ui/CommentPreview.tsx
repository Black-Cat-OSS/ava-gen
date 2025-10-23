import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * CommentPreview component - shows avatar in a blog comment context
 */
export const CommentPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={avatarApi.getImageUrl(avatar.id, undefined, 40)}
          alt={avatar.name}
          className={`w-10 h-10 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 40px (5th power of 2)"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {t('contexts.comment.userName')}
          </span>
          <span className="text-xs text-muted-foreground">
            {t('contexts.comment.timestamp')}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {t('contexts.comment.text')}
        </p>
      </div>
    </div>
  );
};
