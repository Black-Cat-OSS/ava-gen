import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { InputField } from '@/shared/ui';
import { AvatarApi } from '@/shared/api';
import type { AvatarLinkCopyProps } from '../types';
import type { Avatar } from '@/entities/avatar';
import { IconSuccessCopy } from './IconSuccessCopy';
import { IconCopy } from './IconCopy';

/**
 * AvatarLinkCopy component - displays avatar URL with copy functionality
 * Shows a Callout with readonly input field and copy button
 */
export const AvatarLinkCopy: React.FC<AvatarLinkCopyProps> = ({ avatarId, className = '' }) => {
  const { t } = useTranslation('avatarLinkCopy');
  const [isCopied, setIsCopied] = useState(false);
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  // Generate avatar URL with current parameters
  useEffect(() => {
    AvatarApi.getById(avatarId).then(setAvatar);
  }, [avatarId]);

  /**
   * Handle copy to clipboard functionality
   */
  const handleCopy = async () => {
    if (!avatar) return;

    try {
      await navigator.clipboard.writeText(avatar.id);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className}>
      <Callout title={t('title')} type="info" variant="default">
        <div className="space-y-3">
          <InputField
            type="text"
            value={avatar?.id || ''}
            readOnly
            label={t('inputLabel')}
            placeholder={t('inputPlaceholder')}
            className="font-mono text-sm"
          />

          <div className="flex justify-start">
            <Button
              onClick={handleCopy}
              variant="default"
              className="flex items-center gap-2"
              disabled={isCopied}
            >
              {isCopied ? (
                <>
                  <IconSuccessCopy />
                  {t('copied')}
                </>
              ) : (
                <>
                  <IconCopy />
                  {t('copyButton')}
                </>
              )}
            </Button>
          </div>
        </div>
      </Callout>
    </div>
  );
};
