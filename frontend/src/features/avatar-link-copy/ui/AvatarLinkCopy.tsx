import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { InputField } from '@/shared/ui';
import { getImageUrl } from '@/shared/lib/utils/image';
import type { AvatarLinkCopyProps } from '../types';
import { IconSuccessCopy } from './IconSuccessCopy';
import { IconCopy } from './IconCopy';

/**
 * AvatarLinkCopy component - displays avatar URL with copy functionality
 * Shows a Callout with readonly input field and copy button
 */
export const AvatarLinkCopy: React.FC<AvatarLinkCopyProps> = ({ avatarId }) => {
  const { t } = useTranslation('featuresAvatarLinkCopy');
  const [isCopied, setIsCopied] = useState(false);

  const avatarUrl = useMemo(() => {
    return getImageUrl(avatarId, { size: 8 });
  }, [avatarId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(avatarUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to copy: ${error.message}`);
      }
    }
  };

  return (
    <Callout title={t('title')} type="info" variant="default">
      <div className="space-y-3 w-full">
        <InputField
          type="text"
          value={avatarUrl}
          readOnly
          label={t('inputLabel')}
          placeholder={t('inputPlaceholder')}
          className="font-mono text-sm"
          size="full"
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
  );
};
