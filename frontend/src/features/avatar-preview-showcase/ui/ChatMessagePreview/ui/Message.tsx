import { useTranslation } from 'react-i18next';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { FailImage } from '@/shared';
import { getImageUrl } from '@/shared/lib/utils';

/**
 * ChatMessagePreview component - shows avatar in a chat interface context
 */
export const Message: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('featuresAvatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={getImageUrl(avatar.id, { size: 4 })}
          alt={avatar.name}
          className={`w-8 h-8 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 32px (5th power of 2)"
          onError={() => <FailImage />}
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
          <p className="text-sm text-foreground">{t('contexts.chatMessage.text')}</p>
        </div>
      </div>
    </div>
  );
};
