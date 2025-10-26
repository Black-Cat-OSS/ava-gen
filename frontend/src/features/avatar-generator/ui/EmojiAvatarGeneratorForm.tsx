import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ErrorBoundary } from '@/shared/ui';
import { 
  ColorPalette, 
  ColorPaletteError, 
  ColorPaletteSkeleton,
  ColorPaletteProviderSuspense
} from '@/features/color-palette';
import { EmojiPickerComponent } from './EmojiPicker';
import { BackgroundTypeSelector } from './BackgroundTypeSelector';
import { EmojiSizeSelector } from './EmojiSizeSelector';
import { AnglePresets } from './AnglePresets';
import { avatarApi } from '@/shared/api';
import { useAvatarGeneratorContext } from '../contexts';
import type { EmojiAvatarGeneratorFormProps } from '../types';

/**
 * Internal form component that uses color palette context
 */
const EmojiAvatarGeneratorFormInternal: React.FC<EmojiAvatarGeneratorFormProps> = ({
  formData,
  onFormDataChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params = {
        emoji: formData.emoji,
        backgroundType: formData.backgroundType,
        primaryColor: formData.primaryColor || undefined,
        foreignColor: formData.foreignColor || undefined,
        angle: formData.backgroundType === 'linear' ? formData.angle : undefined,
        emojiSize: formData.emojiSize,
      };

      const result = await avatarApi.generateEmoji(params);
      setGeneratedAvatar(result);
    } catch (error) {
      console.error('Failed to generate emoji avatar:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    onFormDataChange(field, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emoji Selection */}
      <EmojiPickerComponent
        selectedEmoji={formData.emoji}
        onEmojiSelect={(emoji) => handleInputChange('emoji', emoji)}
        disabled={disabled}
      />

      {/* Background Type Selection */}
      <BackgroundTypeSelector
        selectedType={formData.backgroundType}
        onTypeSelect={(type) => handleInputChange('backgroundType', type)}
        disabled={disabled}
      />

      {/* Color Palette */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.colorPalette')}
        </label>
        <ColorPalette />
      </div>

      {/* Custom Color Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('features.avatarGenerator.primaryColor')}
          </label>
          <input
            type="color"
            value={formData.primaryColor}
            onChange={(e) => handleInputChange('primaryColor', e.target.value)}
            disabled={disabled}
            className="w-full h-10 rounded-md border border-border bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('features.avatarGenerator.foreignColor')}
          </label>
          <input
            type="color"
            value={formData.foreignColor}
            onChange={(e) => handleInputChange('foreignColor', e.target.value)}
            disabled={disabled}
            className="w-full h-10 rounded-md border border-border bg-background"
          />
        </div>
      </div>

      {/* Angle Selection (only for linear gradient) */}
      {formData.backgroundType === 'linear' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            {t('features.avatarGenerator.gradientAngle')}
          </label>
          <AnglePresets
            currentAngle={formData.angle}
            onAngleSelect={(angle) => handleInputChange('angle', angle)}
          />
        </div>
      )}

      {/* Emoji Size Selection */}
      <EmojiSizeSelector
        selectedSize={formData.emojiSize}
        onSizeSelect={(size) => handleInputChange('emojiSize', size)}
        disabled={disabled}
      />

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={disabled || !formData.emoji}
        className="w-full"
      >
        {t('features.avatarGenerator.generateEmojiAvatar')}
      </Button>
    </form>
  );
};

/**
 * Main emoji avatar generator form component
 * 
 * Integrates all emoji avatar generation components:
 * - EmojiPicker for emoji selection
 * - BackgroundTypeSelector for background type
 * - ColorPalette for color selection
 * - EmojiSizeSelector for emoji size
 * - AnglePresets for gradient angle (when applicable)
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const EmojiAvatarGeneratorForm: React.FC<EmojiAvatarGeneratorFormProps> = (props) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('features.avatarGenerator.generatorTypes.emoji')}
        </h2>
        <p className="text-muted-foreground">
          {t('features.avatarGenerator.generatorTypes.emojiDescription')}
        </p>
      </div>

      <ErrorBoundary fallback={<ColorPaletteError />}>
        <Suspense fallback={<ColorPaletteSkeleton />}>
          <ColorPaletteProviderSuspense
            initialScheme="default"
            onPaletteChange={(paletteKey, palette) => {
              if (paletteKey === 'default') {
                props.onFormDataChange('primaryColor', '#3b82f6');
                props.onFormDataChange('foreignColor', '#ef4444');
              } else if (palette) {
                // Ensure we're getting hex colors, not color names
                const primaryHex = palette.primaryColor?.startsWith('#') 
                  ? palette.primaryColor 
                  : undefined;
                const foreignHex = palette.foreignColor?.startsWith('#') 
                  ? palette.foreignColor 
                  : undefined;
                
                if (primaryHex) {
                  props.onFormDataChange('primaryColor', primaryHex);
                }
                if (foreignHex) {
                  props.onFormDataChange('foreignColor', foreignHex);
                }
              }
            }}
          >
            <EmojiAvatarGeneratorFormInternal {...props} />
          </ColorPaletteProviderSuspense>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
