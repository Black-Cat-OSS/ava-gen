import { useTranslation } from 'react-i18next';
import { AvatarApi } from '@/shared/api';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { useEffect, useState } from 'react';
import type { Avatar } from '@/entities';
import { FailImage } from '@/shared';

/**
 * ChatMessagePreview component - shows avatar in a chat interface context
 */
export const Message: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  const [avatarData, setAvatarData] = useState<Avatar | null>(null);

  useEffect(() => {
    AvatarApi.getById(avatar.id).then(setAvatarData);
  }, [avatar.id]);

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={avatarData?.id}
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
