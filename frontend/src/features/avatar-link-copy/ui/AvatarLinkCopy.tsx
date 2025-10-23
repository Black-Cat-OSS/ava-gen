import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { InputField } from '@/shared/ui';
import { avatarApi } from '@/shared/api';
import type { AvatarLinkCopyProps } from '../types';

/**
 * AvatarLinkCopy component - displays avatar URL with copy functionality
 * Shows a Callout with readonly input field and copy button
 */
export const AvatarLinkCopy: React.FC<AvatarLinkCopyProps> = ({
  avatarId,
  size = 128,
  filter = '',
  className = '',
}) => {
  const { t } = useTranslation('avatarLinkCopy');
  const [isCopied, setIsCopied] = useState(false);

  // Generate avatar URL with current parameters
  const avatarUrl = avatarApi.getImageUrl(avatarId, filter, size);

  /**
   * Handle copy to clipboard functionality
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(avatarUrl);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      // Failed to copy to clipboard
    }
  };

  return (
    <div className={className}>
      <Callout
        title={t('title')}
        type="info"
        variant="default"
      >
        <div className="space-y-3">
          {/* Input field */}
          <InputField
            type="text"
            value={avatarUrl}
            readOnly
            label={t('inputLabel')}
            placeholder={t('inputPlaceholder')}
            className="font-mono text-sm"
          />
          
          {/* Copy button */}
          <div className="flex justify-start">
            <Button
              onClick={handleCopy}
              variant="default"
              className="flex items-center gap-2"
              disabled={isCopied}
            >
              {/* Copy icon */}
              {isCopied ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              {isCopied ? t('copied') : t('copyButton')}
            </Button>
          </div>
        </div>
      </Callout>
    </div>
  );
};
