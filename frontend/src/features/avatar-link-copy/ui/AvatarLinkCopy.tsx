import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { InputField } from '@/shared/ui';
import { getImageUrl } from '@/shared/lib/utils/image';
import type { ImageSizes, ImageFilters } from '@/shared/types/avatar';
import type { AvatarLinkCopyProps } from '../types';
import { IconSuccessCopy } from './IconSuccessCopy';
import { IconCopy } from './IconCopy';

/**
 * AvatarLinkCopy component - displays avatar URL with copy functionality
 * Shows a Callout with readonly input field and copy button
 *
 * @param props - Component props
 * @param props.avatarId - Avatar identifier
 * @param props.size - Optional avatar size (4-9), defaults to 8
 * @param props.filter - Optional filter ('grayscale', 'sepia', 'negative'), defaults to undefined
 */
export const AvatarLinkCopy: React.FC<AvatarLinkCopyProps> = ({ avatarId, size, filter }) => {
  const { t } = useTranslation('featuresAvatarLinkCopy');
  const [isCopied, setIsCopied] = useState(false);

  const avatarUrl = useMemo(() => {
    const params: {
      size?: ImageSizes;
      filter?: ImageFilters;
    } = {};
    if (size !== undefined) {
      params.size = size;
    } else {
      params.size = 8;
    }
    if (filter) {
      params.filter = filter;
    }
    return getImageUrl(avatarId, params);
  }, [avatarId, size, filter]);

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
