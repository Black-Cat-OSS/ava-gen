import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { Button, ErrorBoundary } from '@/shared/ui';
import { ColorPalette, ColorPaletteError, ColorPaletteSkeleton } from '@/features/color-palette';
import { AnglePresets } from '@/features/angle-presets';
import { ColorPreview } from '@/features/color-preview';
import { EmojiPickerComponent } from '@/features/avatar-generator/ui';
import { BackgroundTypeSelector } from '@/features/avatar-generator/ui';
import { EmojiSizeSelector } from '@/features/avatar-generator/ui';
import { useGenerateAvatar } from '@/shared/lib/hooks';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import type {
  EmojiAvatarFormData,
  EmojiAvatarGeneratorFormProps,
} from '@/features/avatar-generator/types';

/**
 * Форма генерации аватара по emoji.
 *
 * @param props Параметры формы.
 */
export const EmojiGeneratorForm = ({
  formData,
  onFormDataChange,
  disabled = false,
}: EmojiAvatarGeneratorFormProps) => {
  const { t } = useTranslation();
  const { v3, result, isSuccess, isLoading } = useGenerateAvatar();
  const { mutate: generateEmojiAvatar } = v3;
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  const { control, handleSubmit, watch } = useForm<EmojiAvatarFormData>({
    defaultValues: formData,
  });

  useEffect(() => {
    if (isSuccess && result) {
      setGeneratedAvatar(result);
    }
  }, [isSuccess, result, setGeneratedAvatar]);

  const onSubmit = (data: EmojiAvatarFormData) => {
    generateEmojiAvatar({
      emoji: data.emoji,
      backgroundType: data.backgroundType,
      primaryColor: data.primaryColor,
      foreignColor: data.foreignColor,
      angle: data.angle,
      emojiSize: data.emojiSize,
    });
  };

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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="emoji"
              render={({ field }) => (
                <EmojiPickerComponent
                  selectedEmoji={field.value}
                  onEmojiSelect={emoji => {
                    field.onChange(emoji);
                    onFormDataChange('emoji', emoji);
                  }}
                  disabled={disabled}
                />
              )}
            />

            <Controller
              control={control}
              name="backgroundType"
              render={({ field }) => (
                <BackgroundTypeSelector
                  selectedType={field.value}
                  onTypeSelect={type => {
                    field.onChange(type);
                    onFormDataChange('backgroundType', type);
                  }}
                  disabled={disabled}
                />
              )}
            />

            <ColorPalette />

            <Controller
              control={control}
              name="primaryColor"
              render={({ field: primaryField }) => (
                <Controller
                  control={control}
                  name="foreignColor"
                  render={({ field: foreignField }) => (
                    <ColorPreview
                      primaryColor={primaryField.value}
                      foreignColor={foreignField.value}
                      onPrimaryColorChange={color => {
                        primaryField.onChange(color);
                        onFormDataChange('primaryColor', color);
                      }}
                      onForeignColorChange={color => {
                        foreignField.onChange(color);
                        onFormDataChange('foreignColor', color);
                      }}
                      disabled={disabled}
                    />
                  )}
                />
              )}
            />

            {watch('backgroundType') === 'linear' && (
              <div className="space-y-3">
                <strong className="block text-sm text-foreground">
                  {t('features.avatarGenerator.gradientAngle')}
                </strong>
                <Controller
                  control={control}
                  name="angle"
                  render={({ field }) => (
                    <AnglePresets
                      currentAngle={field.value}
                      onAngleSelect={angle => {
                        field.onChange(angle);
                        onFormDataChange('angle', angle);
                      }}
                    />
                  )}
                />
              </div>
            )}

            <Controller
              control={control}
              name="emojiSize"
              render={({ field }) => (
                <EmojiSizeSelector
                  selectedSize={field.value}
                  onSizeSelect={size => {
                    field.onChange(size);
                    onFormDataChange('emojiSize', size);
                  }}
                  disabled={disabled}
                />
              )}
            />

            <Button type="submit" className="w-full" disabled={disabled || isLoading}>
              {isLoading
                ? t('features.avatarGenerator.generating')
                : t('features.avatarGenerator.generateEmojiAvatar')}
            </Button>
          </form>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
