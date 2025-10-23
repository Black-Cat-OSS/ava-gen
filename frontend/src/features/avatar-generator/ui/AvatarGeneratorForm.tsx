import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useGenerateAvatar } from '@/shared/lib';
import { Button, ErrorBoundary } from '@/shared/ui';
import { InputField } from '@/shared/ui';
import { AngleVisualizer } from '@/shared/ui';
import { AnglePresets } from './AnglePresets';
import { 
  ColorPalette, 
  ColorPaletteError, 
  ColorPaletteSkeleton,
  ColorPaletteProviderSuspense, 
  useColorPaletteContext
} from '@/features/color-palette';
import type { ColorPalette as ColorPaletteType } from '@/features/color-palette/types/types';
import { CurrentPaletteDisplay } from './CurrentPaletteDisplay';
import { CustomColorInputs } from './CustomColorInputs';
import type { AvatarGeneratorFormInternalProps } from '../types';
import { avatarApi } from '@/shared/api';
import { generateMnemonicSeed } from '../utils';
import { useAvatarGeneratorContext } from '../contexts';

/**
 * Internal form component that uses color palette context
 */
const AvatarGeneratorFormInternal = ({ 
  formData, 
  onFormDataChange, 
  onGenerateSeed
}: AvatarGeneratorFormInternalProps) => {
  const { t } = useTranslation();
  const generateAvatar = useGenerateAvatar();
  const { selectedScheme } = useColorPaletteContext();
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  // Call callback when avatar is generated
  useEffect(() => {
    if (generateAvatar.isSuccess && generateAvatar.data) {
      setGeneratedAvatar(generateAvatar.data);
    }
  }, [generateAvatar.isSuccess, generateAvatar.data, setGeneratedAvatar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      primaryColor: formData.primaryColor || undefined,
      foreignColor: formData.foreignColor || undefined,
      colorScheme: selectedScheme !== 'default' ? selectedScheme : undefined,
      seed: formData.seed || undefined,
      type: formData.type || 'pixelize',
      angle: formData.type === 'gradient' ? formData.angle : undefined,
    };

    generateAvatar.mutate(params);
  };

  const handleInputChange = (field: string, value: string | number) => {
    onFormDataChange(field, value);
  };

  const isCustomPalette = selectedScheme === 'default';

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Color Palette Selection */}
        <ColorPalette />

        {/* Current Palette Display */}
        {!isCustomPalette && <CurrentPaletteDisplay />}

        {/* Custom Colors (only when default palette is selected) */}
        {isCustomPalette && (
          <CustomColorInputs
            primaryColor={formData.primaryColor}
            foreignColor={formData.foreignColor}
            onPrimaryColorChange={(value) => handleInputChange('primaryColor', value)}
            onForeignColorChange={(value) => handleInputChange('foreignColor', value)}
          />
        )}

        {/* Generator Type Selection */}
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
                backgroundColor: formData.type === 'pixelize' ? `${formData.primaryColor}15` : undefined,
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
                backgroundColor: formData.type === 'gradient' ? `${formData.primaryColor}15` : undefined,
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

        {/* Angle Control - only for gradient */}
        {formData.type === 'gradient' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              {t('features.avatarGenerator.angle')}
            </label>
            
              <div className="flex items-center gap-1">
                  <AnglePresets
                    currentAngle={formData.angle}
                    onAngleSelect={(angle) => handleInputChange('angle', angle)}
                    size={70}
                  />
              
              {/* Interactive angle visualizer */}
              <div className="flex flex-col items-center w-full">
                <AngleVisualizer
                  angle={formData.angle}
                  onChange={(angle) => handleInputChange('angle', angle)}
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

        {/* Seed Generation - hidden for gradient */}
        {formData.type !== 'gradient' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              {t('features.avatarGenerator.seed')}
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGenerateSeed}
              className="text-xs"
            >
              {t('features.avatarGenerator.generateSeed')}
            </Button>
          </div>
          <InputField
            type="text"
            value={formData.seed}
            onChange={e => handleInputChange('seed', e.target.value)}
            placeholder={t('features.avatarGenerator.seedPlaceholder')}
            maxLength={32}
            label=""
          />
          <p className="text-xs text-muted-foreground">
            {t('features.avatarGenerator.seedDescription')}
          </p>
        </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={generateAvatar.isPending} className="px-8 py-2">
            {generateAvatar.isPending
              ? t('features.avatarGenerator.generating')
              : t('features.avatarGenerator.generate')}
          </Button>
        </div>

        {/* Success Message */}
        {generateAvatar.isSuccess && generateAvatar.data && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm mb-3">{t('features.avatarGenerator.success')}</p>
            <div className="text-center">
              <img
                src={avatarApi.getImageUrl(generateAvatar.data.id)}
                alt={generateAvatar.data.name}
                className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary"
              />
              <p className="mt-2 text-sm text-muted-foreground">ID: {generateAvatar.data.id}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {generateAvatar.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              {t('features.avatarGenerator.error')}: {generateAvatar.error?.message}
            </p>
          </div>
        )}
      </form>
    </div>
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

  // Generate initial seed on component mount
  useEffect(() => {
    if (!formData.seed) {
      setFormData(prev => ({
        ...prev,
        seed: generateMnemonicSeed(),
      }));
    }
  }, [formData.seed]);

  /**
   * Handle form data changes
   */
  const handleFormDataChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle generate seed
   */
  const handleGenerateSeed = () => {
    setFormData(prev => ({
      ...prev,
      seed: generateMnemonicSeed(),
    }));
  };

  /**
   * Handle palette change from context
   */
  const handlePaletteChange = (paletteKey: string, palette?: ColorPaletteType) => {
    if (paletteKey === 'default') {
      setFormData(prev => ({ ...prev, colorScheme: 'default' }));
    } else if (palette) {
      setFormData(prev => ({
        ...prev,
        colorScheme: paletteKey,
        primaryColor: palette.primaryColor,
        foreignColor: palette.foreignColor,
      }));
    }
  };

  return (
    <ErrorBoundary fallback={<ColorPaletteError />}>
      <Suspense fallback={<ColorPaletteSkeleton />}>
        <ColorPaletteProviderSuspense
          initialScheme={formData.colorScheme}
          onPaletteChange={handlePaletteChange}
        >
          <AvatarGeneratorFormInternal 
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onGenerateSeed={handleGenerateSeed}
          />
        </ColorPaletteProviderSuspense>
      </Suspense>
    </ErrorBoundary>
  );
};
