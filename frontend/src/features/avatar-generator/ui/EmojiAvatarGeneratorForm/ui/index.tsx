import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ErrorBoundary } from '@/shared/ui';
import { ColorPalette, ColorPaletteError, ColorPaletteSkeleton } from '@/features/color-palette';
import { EmojiPickerComponent } from '@/features/avatar-generator/ui';
import { BackgroundTypeSelector } from '@/features/avatar-generator/ui';
import { EmojiSizeSelector } from '@/features/avatar-generator/ui';
import { AnglePresets } from '@/features/angle-presets';
import { GeneratorApi } from '@/shared/api';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import type { EmojiAvatarGeneratorFormProps } from '@/features/avatar-generator/types';
import type { Avatar } from '@/entities/avatar';
import { ColorPreview } from '@/features/color-preview';
import { SuccessMessage } from './SuccessMessage';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatarLocal] = useState<Avatar | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const params = {
        emoji: formData.emoji,
        backgroundType: formData.backgroundType,
        primaryColor: formData.primaryColor || undefined,
        foreignColor: formData.foreignColor || undefined,
        angle: formData.backgroundType === 'linear' ? formData.angle : undefined,
        emojiSize: formData.emojiSize,
      };

      const result = await GeneratorApi.v3.generate(params);
      setGeneratedAvatarLocal(result);
      setGeneratedAvatar(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate emoji avatar';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    onFormDataChange(field, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmojiPickerComponent
        selectedEmoji={formData.emoji}
        onEmojiSelect={emoji => handleInputChange('emoji', emoji)}
        disabled={disabled}
      />
      <BackgroundTypeSelector
        selectedType={formData.backgroundType}
        onTypeSelect={type => handleInputChange('backgroundType', type)}
        disabled={disabled}
      />
      <ColorPalette />

      <ColorPreview
        primaryColor={formData.primaryColor}
        foreignColor={formData.foreignColor}
        onPrimaryColorChange={color => handleInputChange('primaryColor', color)}
        onForeignColorChange={color => handleInputChange('foreignColor', color)}
        disabled={disabled}
      />

      {formData.backgroundType === 'linear' && (
        <div className="space-y-3">
          <strong className="block text-sm text-foreground">
            {t('features.avatarGenerator.gradientAngle')}
          </strong>
          <AnglePresets
            currentAngle={formData.angle}
            onAngleSelect={angle => handleInputChange('angle', angle)}
          />
        </div>
      )}

      <EmojiSizeSelector
        selectedSize={formData.emojiSize}
        onSizeSelect={size => handleInputChange('emojiSize', size)}
        disabled={disabled}
      />

      <Button
        type="submit"
        disabled={disabled || !formData.emoji || isGenerating}
        className="w-full"
      >
        {isGenerating
          ? t('features.avatarGenerator.generating')
          : t('features.avatarGenerator.generateEmojiAvatar')}
      </Button>

      {generatedAvatar && <SuccessMessage avatar={generatedAvatar} t={t} />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">
            {t('features.avatarGenerator.error')}: {error}
          </p>
        </div>
      )}
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
export const EmojiAvatarGeneratorForm: React.FC<EmojiAvatarGeneratorFormProps> = props => {
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
          <EmojiAvatarGeneratorFormInternal {...props} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
