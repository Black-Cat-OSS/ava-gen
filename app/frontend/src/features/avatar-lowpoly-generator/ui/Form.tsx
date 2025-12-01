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
import type { Pallete } from '@/entities';

type BackgroundType = 'solid' | 'linear' | 'radial';
type PointDensity = 'low' | 'medium' | 'high';
type EmojiSize = 'small' | 'medium' | 'large';

const DEFAULT_COLOR: Pallete = {
  id: 'lowpoly-default',
  name: 'Lowpoly Default',
  key: 'lowpoly-default',
  primaryColor: '#3B82F6',
  foreignColor: '#EF4444',
  createdAt: '1970-01-01T00:00:00.000Z',
  updatedAt: '1970-01-01T00:00:00.000Z',
};

interface LowpolyAvatarFormData {
  emoji?: string;
  backgroundType: BackgroundType;
  color: Pallete | null;
  angle: number;
  pointDensity: PointDensity;
  colorVariation: number;
  edgeDetection: boolean;
  emojiSize: EmojiSize;
  useEmoji: boolean;
}

export const LowpolyGeneratorForm = () => {
  const { t } = useTranslation('featuresAvatarLowpolyGenerator');
  const { v4, result, isSuccess, isLoading } = useGenerateAvatar();
  const { mutate: generateLowpolyAvatar } = v4;
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  const { control, handleSubmit, watch } = useForm<LowpolyAvatarFormData>({
    defaultValues: {
      useEmoji: false,
      emoji: '😊',
      backgroundType: 'linear',
      color: DEFAULT_COLOR,
      angle: 90,
      pointDensity: 'medium',
      colorVariation: 10,
      edgeDetection: true,
      emojiSize: 'large',
    },
  });

  const colorSelection = watch('color');
  const backgroundTypeSelection = watch('backgroundType');
  const useEmojiSelection = watch('useEmoji');

  useEffect(() => {
    if (isSuccess && result) {
      setGeneratedAvatar(result);
    }
  }, [isSuccess, result, setGeneratedAvatar]);

  const onSubmit = (data: LowpolyAvatarFormData) => {
    const primaryColor = data.color?.primaryColor ?? DEFAULT_COLOR.primaryColor;
    const foreignColor = data.color?.foreignColor ?? DEFAULT_COLOR.foreignColor;

    generateLowpolyAvatar({
      emoji: data.useEmoji ? data.emoji : undefined,
      backgroundType: data.backgroundType,
      primaryColor,
      foreignColor,
      colorScheme: data.color?.key,
      // Only send angle for linear gradient, not for radial or solid
      angle: data.backgroundType === 'linear' ? data.angle : undefined,
      pointDensity: data.pointDensity,
      colorVariation: data.colorVariation,
      edgeDetection: data.edgeDetection,
      emojiSize: data.emojiSize,
    });
  };

  return (
    <div className="space-y-6">
      <ErrorBoundary fallback={<ColorPaletteError />}>
        <Suspense fallback={<ColorPaletteSkeleton />}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Emoji Toggle */}
            <Controller
              control={control}
              name="useEmoji"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">{t('form.useEmoji.label')}</strong>
                  <Tabs value={field.value ? 'yes' : 'no'} onValueChange={(v) => field.onChange(v === 'yes')}>
                    <TabsList>
                      <TabsTrigger value="no">{t('form.useEmoji.options.no')}</TabsTrigger>
                      <TabsTrigger value="yes">{t('form.useEmoji.options.yes')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            {/* Emoji Picker (conditional) */}
            {useEmojiSelection && (
              <Controller
                control={control}
                name="emoji"
                render={({ field }) => (
                  <EmojiPickerComponent
                    selectedEmoji={field.value || '😊'}
                    onEmojiSelect={emoji => {
                      field.onChange(emoji);
                    }}
                  />
                )}
              />
            )}

            {/* Emoji Size (conditional) */}
            {useEmojiSelection && (
              <Controller
                control={control}
                name="emojiSize"
                render={({ field }) => (
                  <div className="space-y-3">
                    <strong className="block text-sm text-foreground">{t('form.emojiSize.label')}</strong>
                    <Tabs value={field.value} onValueChange={field.onChange}>
                      <TabsList>
                        <TabsTrigger value="small">{t('form.emojiSize.options.small')}</TabsTrigger>
                        <TabsTrigger value="medium">{t('form.emojiSize.options.medium')}</TabsTrigger>
                        <TabsTrigger value="large">{t('form.emojiSize.options.large')}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}
              />
            )}

            {/* Background Type */}
            <Controller
              control={control}
              name="backgroundType"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">{t('form.backgroundType.label')}</strong>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList>
                      <TabsTrigger value="solid">{t('form.backgroundType.options.solid')}</TabsTrigger>
                      <TabsTrigger value="radial">{t('form.backgroundType.options.radial')}</TabsTrigger>
                      <TabsTrigger value="linear">{t('form.backgroundType.options.linear')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            {/* Color Palette */}
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

            {/* Angle (only for linear gradient) */}
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

            {/* Point Density */}
            <Controller
              control={control}
              name="pointDensity"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">{t('form.pointDensity.label')}</strong>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList>
                      <TabsTrigger value="low">{t('form.pointDensity.options.low')}</TabsTrigger>
                      <TabsTrigger value="medium">{t('form.pointDensity.options.medium')}</TabsTrigger>
                      <TabsTrigger value="high">{t('form.pointDensity.options.high')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            {/* Color Variation */}
            <Controller
              control={control}
              name="colorVariation"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">
                    {t('form.colorVariation.label')} ({field.value}%)
                  </strong>
                  <Tabs value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                    <TabsList>
                      <TabsTrigger value="0">0%</TabsTrigger>
                      <TabsTrigger value="10">10%</TabsTrigger>
                      <TabsTrigger value="20">20%</TabsTrigger>
                      <TabsTrigger value="30">30%</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            {/* Edge Detection */}
            <Controller
              control={control}
              name="edgeDetection"
              render={({ field }) => (
                <div className="space-y-3">
                  <strong className="block text-sm text-foreground">{t('form.edgeDetection.label')}</strong>
                  <Tabs value={field.value ? 'on' : 'off'} onValueChange={(v) => field.onChange(v === 'on')}>
                    <TabsList>
                      <TabsTrigger value="off">{t('form.edgeDetection.options.off')}</TabsTrigger>
                      <TabsTrigger value="on">{t('form.edgeDetection.options.on')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t('form.generating') : t('form.submit')}
            </Button>
          </form>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
