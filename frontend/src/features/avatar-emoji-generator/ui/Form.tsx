import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { Button, ErrorBoundary, Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { ColorPalette, ColorPaletteError, ColorPaletteSkeleton } from '@/features/color-palette';
import { AnglePresets } from '@/features/angle-presets';
import { ColorPreview } from '@/features/color-preview';
import { EmojiPickerComponent } from '@/features/avatar-generator/ui';
import { useGenerateAvatar } from '@/shared/lib/hooks';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import type { EmojiAvatarFormData } from '@/features/avatar-generator/types';
import type { Pallete } from '@/entities';

const DEFAULT_COLOR: Pallete = {
  id: 'emoji-default',
  name: 'Emoji Default',
  key: 'emoji-default',
  primaryColor: '#000000',
  foreignColor: '#ffffff',
  createdAt: '1970-01-01T00:00:00.000Z',
  updatedAt: '1970-01-01T00:00:00.000Z',
  colorScheme: 'custom',
};

/**
 * Форма генерации аватара по emoji.
 *
 * @param props Параметры формы.
 */
export const EmojiGeneratorForm = () => {
  const { t } = useTranslation('featuresAvatarEmojiGenerator');
  const { v3, result, isSuccess, isLoading } = useGenerateAvatar();
  const { mutate: generateEmojiAvatar } = v3;
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  const { control, handleSubmit, watch } = useForm<EmojiAvatarFormData>({
    defaultValues: {
      emoji: '😊',
      backgroundType: 'solid',
      color: DEFAULT_COLOR,
      angle: 90,
      emojiSize: 'large',
    },
  });

  const colorSelection = watch('color');
  const backgroundTypeSelection = watch('backgroundType');

  useEffect(() => {
    if (isSuccess && result) {
      setGeneratedAvatar(result);
    }
  }, [isSuccess, result, setGeneratedAvatar]);

  const onSubmit = (data: EmojiAvatarFormData) => {
    generateEmojiAvatar({
      emoji: data.emoji,
      backgroundType: data.backgroundType,
      primaryColor: data.color?.primaryColor ?? DEFAULT_COLOR.primaryColor,
      foreignColor: data.color?.foreignColor ?? DEFAULT_COLOR.foreignColor,
      colorScheme: data.color?.colorScheme ?? DEFAULT_COLOR.colorScheme,
      angle: data.angle,
      emojiSize: data.emojiSize,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('form.title')}</h2>
        <p className="text-muted-foreground">{t('form.description')}</p>
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
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="backgroundType"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">
                    {t('form.backgroundType.label')}
                  </strong>

                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList className="bg-gray-700 rounded-lg p-1 mb-3">
                      <TabsTrigger
                        value="solid"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.backgroundType.options.solid')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="radial"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.backgroundType.options.radial')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="linear"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.backgroundType.options.linear')}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <>
                  <ColorPalette
                    selectedScheme={field.value ?? undefined}
                    onPaletteChange={palette => {
                      field.onChange(palette);
                    }}
                  />
                  <ColorPreview
                    primaryColor={field.value?.primaryColor ?? DEFAULT_COLOR.primaryColor}
                    foreignColor={field.value?.foreignColor ?? DEFAULT_COLOR.foreignColor}
                    disabled
                  />
                </>
              )}
            />

            {backgroundTypeSelection === 'linear' && (
              <div className="space-y-3">
                <strong className="block text-sm text-foreground">{t('form.gradientAngle')}</strong>
                <Controller
                  control={control}
                  name="angle"
                  render={({ field }) => (
                    <AnglePresets
                      currentAngle={field.value}
                      onAngleSelect={angle => {
                        field.onChange(angle);
                      }}
                      colorScheme={colorSelection ?? undefined}
                    />
                  )}
                />
              </div>
            )}

            <Controller
              control={control}
              name="emojiSize"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">
                    {t('form.emojiSize.label')}
                  </strong>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList className="bg-gray-700 rounded-lg p-1 mb-3">
                      <TabsTrigger
                        value="small"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.emojiSize.options.small')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="medium"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.emojiSize.options.medium')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="large"
                        className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {t('form.emojiSize.options.large')}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('form.generateButton.loading') : t('form.generateButton.default')}
            </Button>
          </form>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
