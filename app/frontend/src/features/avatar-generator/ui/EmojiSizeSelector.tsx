import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EmojiSizeSelectorProps } from '../types';

//TODO: remove this component (Shit code)
/**
 * Component for selecting emoji size relative to avatar
 *
 * Provides visual selection between small, medium, and large emoji sizes.
 * Shows visual indicators for each size option.
 *
 * @param props - Component props
 * @returns JSX element
 * @deprecated - never use it!
 */
export const EmojiSizeSelector: React.FC<EmojiSizeSelectorProps> = ({
  selectedSize,
  onSizeSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const sizeOptions: Array<{
    size: 'small' | 'medium' | 'large';
    label: string;
    description: string;
    emojiSize: string;
  }> = [
    {
      size: 'small',
      label: t('features.avatarGenerator.emojiSize.small'),
      description: t('features.avatarGenerator.emojiSize.smallDescription'),
      emojiSize: '😀',
    },
    {
      size: 'medium',
      label: t('features.avatarGenerator.emojiSize.medium'),
      description: t('features.avatarGenerator.emojiSize.mediumDescription'),
      emojiSize: '😀',
    },
    {
      size: 'large',
      label: t('features.avatarGenerator.emojiSize.large'),
      description: t('features.avatarGenerator.emojiSize.largeDescription'),
      emojiSize: '😀',
    },
  ];

  const getEmojiScale = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'text-lg';
      case 'medium':
        return 'text-2xl';
      case 'large':
        return 'text-3xl';
      default:
        return 'text-2xl';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {t('features.avatarGenerator.emojiSize.label')}
      </label>

      <div className="grid grid-cols-3 gap-3">
        {sizeOptions.map(({ size, label, description, emojiSize }) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeSelect(size)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedSize === size
                ? 'border-primary shadow-lg ring-2 ring-offset-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-center">
              <div className={`${getEmojiScale(size)} mb-2`}>{emojiSize}</div>
              <div className="text-sm font-medium text-foreground mb-1">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
