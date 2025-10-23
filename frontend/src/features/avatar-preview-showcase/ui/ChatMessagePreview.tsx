import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * ChatMessagePreview component - shows avatar in a chat interface context
 */
export const ChatMessagePreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={avatarApi.getImageUrl(avatar.id, undefined, 32)}
          alt={avatar.name}
          className={`w-8 h-8 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 32px (5th power of 2)"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23ddd" width="32" height="32"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {t('contexts.chatMessage.userName')}
          </span>
          <span className="text-xs text-muted-foreground">
            {t('contexts.chatMessage.timestamp')}
          </span>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3 max-w-xs">
          <p className="text-sm text-foreground">
            {t('contexts.chatMessage.text')}
          </p>
        </div>
      </div>
    </div>
  );
};
