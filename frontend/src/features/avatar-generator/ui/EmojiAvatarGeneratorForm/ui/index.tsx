import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ErrorBoundary } from '@/shared/ui';
import {
  ColorPalette,
  ColorPaletteError,
  ColorPaletteSkeleton,
  useColorPaletteContext,
} from '@/features/color-palette';
import { EmojiPickerComponent } from '@/features/avatar-generator/ui';
import { BackgroundTypeSelector } from '@/features/avatar-generator/ui';
import { EmojiSizeSelector } from '@/features/avatar-generator/ui';
import { AnglePresets } from '@/features/avatar-generator/ui';
import { GeneratorApi } from '@/shared/api';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import type { EmojiAvatarGeneratorFormProps } from '@/features/avatar-generator/types';
import type { Avatar } from '@/entities/avatar';

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
  const colorPaletteContext = useColorPaletteContext();
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
      console.error('Failed to generate emoji avatar:', err);
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

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.colorPalette')}
        </label>
        <ColorPalette
          selectedScheme={colorPaletteContext.selectedScheme}
          colorSchemes={colorPaletteContext.colorSchemes}
          palettes={colorPaletteContext.palettes}
          isLoading={colorPaletteContext.isLoading}
          isError={colorPaletteContext.isError}
          hasNextPage={colorPaletteContext.hasNextPage}
          isFetchingNextPage={colorPaletteContext.isFetchingNextPage}
          onPaletteChange={colorPaletteContext.onPaletteChange}
          onRandomPalette={colorPaletteContext.onRandomPalette}
          loadMore={colorPaletteContext.loadMore}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('features.avatarGenerator.primaryColor')}
          </label>
          <input
            type="color"
            value={formData.primaryColor}
            onChange={e => handleInputChange('primaryColor', e.target.value)}
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
            onChange={e => handleInputChange('foreignColor', e.target.value)}
            disabled={disabled}
            className="w-full h-10 rounded-md border border-border bg-background"
          />
        </div>
      </div>

      {formData.backgroundType === 'linear' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            {t('features.avatarGenerator.gradientAngle')}
          </label>
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

      {generatedAvatar && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm mb-3">{t('features.avatarGenerator.success')}</p>
          <div className="text-center">
            <img
              src={generatedAvatar.id}
              alt={generatedAvatar.id}
              className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary"
            />
            <p className="mt-2 text-sm text-muted-foreground">ID: {generatedAvatar.id}</p>
          </div>
        </div>
      )}

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
