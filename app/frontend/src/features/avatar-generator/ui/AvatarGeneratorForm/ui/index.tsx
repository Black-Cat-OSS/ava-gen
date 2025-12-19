import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useGenerateAvatar } from '@/shared/lib';
import { Button, ErrorBoundary } from '@/shared/ui';
import { AngleVisualizer } from '@/shared/ui';
import { AnglePresets } from '@/features/angle-presets';
import { ColorPalette, ColorPaletteError, ColorPaletteSkeleton } from '@/features/color-palette';
import type { AvatarGeneratorFormInternalProps } from '@/features/avatar-generator/types';
import { generateMnemonicSeed } from '@/features/avatar-generator/utils';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';

/**
 * Internal form component that uses color palette context
 */
const AvatarGeneratorFormInternal = ({
  formData,
  onFormDataChange,
}: AvatarGeneratorFormInternalProps) => {
  const { t } = useTranslation();
  const generateAvatar = useGenerateAvatar();
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  // Call callback when avatar is generated
  useEffect(() => {
    if (generateAvatar.v1.isSuccess && generateAvatar.v1.data) {
      setGeneratedAvatar(generateAvatar.v1.data);
    }
  }, [generateAvatar.v1.isSuccess, generateAvatar.v1.data, setGeneratedAvatar]);

  const handleInputChange = (field: string, value: string | number) => {
    onFormDataChange(field, value);
  };

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.generatorType')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('type', 'pixelize')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.type === 'pixelize'
                ? 'shadow-lg ring-2 ring-offset-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:shadow-md'
            }`}
            style={{
              borderColor: formData.type === 'pixelize' ? formData.primaryColor : undefined,
              backgroundColor:
                formData.type === 'pixelize' ? `${formData.primaryColor}15` : undefined,
            }}
          >
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">
                {t('features.avatarGenerator.generatorTypes.pixelize')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('features.avatarGenerator.generatorTypes.pixelizeDescription')}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('type', 'wave')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.type === 'wave'
                ? 'shadow-lg ring-2 ring-offset-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:shadow-md'
            }`}
            style={{
              borderColor: formData.type === 'wave' ? formData.primaryColor : undefined,
              backgroundColor: formData.type === 'wave' ? `${formData.primaryColor}15` : undefined,
            }}
          >
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">
                {t('features.avatarGenerator.generatorTypes.wave')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('features.avatarGenerator.generatorTypes.waveDescription')}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('type', 'gradient')}
            className={`p-3 rounded-lg border-2 transition-all ${
              formData.type === 'gradient'
                ? 'shadow-lg ring-2 ring-offset-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:shadow-md'
            }`}
            style={{
              borderColor: formData.type === 'gradient' ? formData.primaryColor : undefined,
              backgroundColor:
                formData.type === 'gradient' ? `${formData.primaryColor}15` : undefined,
            }}
          >
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">
                {t('features.avatarGenerator.generatorTypes.gradient')}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('features.avatarGenerator.generatorTypes.gradientDescription')}
              </div>
            </div>
          </button>
        </div>
      </div>

      {formData.type === 'gradient' && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            {t('features.avatarGenerator.angle')}
          </label>

          <div className="flex items-center gap-1">
            <AnglePresets
              currentAngle={formData.angle}
              onAngleSelect={angle => handleInputChange('angle', angle)}
              size={70}
            />

            {/* Interactive angle visualizer */}
            <div className="flex flex-col items-center w-full">
              <AngleVisualizer
                angle={formData.angle}
                onChange={angle => handleInputChange('angle', angle)}
                size={230}
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('features.avatarGenerator.dragToRotate')}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('features.avatarGenerator.angleDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {formData.type !== 'gradient' && <></>}

      <div className="flex justify-center">
        <Button type="submit" disabled={generateAvatar.v1.isPending} className="px-8 py-2">
          {generateAvatar.v1.isPending
            ? t('features.avatarGenerator.generating')
            : t('features.avatarGenerator.generate')}
        </Button>
      </div>

      {generateAvatar.v1.isSuccess && generateAvatar.v1.data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm mb-3">{t('features.avatarGenerator.success')}</p>
          <div className="text-center">
            <img
              src={generateAvatar.v1.data.id}
              alt={generateAvatar.v1.data.name}
              className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary"
            />
            <p className="mt-2 text-sm text-muted-foreground">ID: {generateAvatar.v1.data.id}</p>
          </div>
        </div>
      )}

      {generateAvatar.v1.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">
            {t('features.avatarGenerator.error')}: {generateAvatar.v1.error?.message}
          </p>
        </div>
      )}
    </>
  );
};

/**
 * Main AvatarGeneratorForm component with ErrorBoundary and Suspense
 * Wraps the internal form component with color palette context using modern error handling
 */
export const AvatarGeneratorForm = () => {
  const [formData, setFormData] = useState({
    primaryColor: '#3b82f6',
    foreignColor: '#ef4444',
    colorScheme: 'default',
    seed: '',
    type: 'pixelize',
    angle: 90,
  });

  useEffect(() => {
    if (!formData.seed) {
      setFormData(prev => ({
        ...prev,
        seed: generateMnemonicSeed(),
      }));
    }
  }, [formData.seed]);

  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateSeed = () => {
    setFormData(prev => ({
      ...prev,
      seed: generateMnemonicSeed(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ColorPalette />
        <ErrorBoundary fallback={<ColorPaletteError />}>
          <Suspense fallback={<ColorPaletteSkeleton />}>
            <AvatarGeneratorFormInternal
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onGenerateSeed={handleGenerateSeed}
            />
          </Suspense>
        </ErrorBoundary>
      </form>
    </div>
  );
};
