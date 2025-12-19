import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BackgroundTypeSelectorProps } from '../types';

//TODO: remove this component (Shit code)
/**
 * Component for selecting background type for emoji avatars
 *
 * Provides visual selection between solid, linear gradient, and radial gradient backgrounds.
 * Shows angle input only for linear gradient type.
 *
 * @param props - Component props
 * @returns JSX element
 * @deprecated - never use it!
 */
export const BackgroundTypeSelector: React.FC<BackgroundTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const backgroundTypes: Array<{
    type: 'solid' | 'linear' | 'radial';
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      type: 'solid',
      label: t('features.avatarGenerator.backgroundType.solid'),
      description: t('features.avatarGenerator.backgroundType.solidDescription'),
      icon: '■',
    },
    {
      type: 'linear',
      label: t('features.avatarGenerator.backgroundType.linear'),
      description: t('features.avatarGenerator.backgroundType.linearDescription'),
      icon: '▬',
    },
    {
      type: 'radial',
      label: t('features.avatarGenerator.backgroundType.radial'),
      description: t('features.avatarGenerator.backgroundType.radialDescription'),
      icon: '●',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {t('features.avatarGenerator.backgroundType.label')}
      </label>

      <div className="grid grid-cols-3 gap-3">
        {backgroundTypes.map(({ type, label, description, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeSelect(type)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedType === type
                ? 'border-primary shadow-lg ring-2 ring-offset-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-medium text-foreground mb-1">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
