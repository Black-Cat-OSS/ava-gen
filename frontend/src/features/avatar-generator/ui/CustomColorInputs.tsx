import { useTranslation } from 'react-i18next';
import { InputField } from '@/shared/ui';
import type { CustomColorInputsProps } from '../types';

/**
 * Component for custom color input fields
 * Allows users to select custom colors when default palette is selected
 * Provides both color picker and text input for hex values
 */
export const CustomColorInputs = ({
  primaryColor,
  foreignColor,
  onPrimaryColorChange,
  onForeignColorChange,
}: CustomColorInputsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.primaryColor')}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={e => onPrimaryColorChange(e.target.value)}
            className="w-12 h-10 rounded border border-input bg-background cursor-pointer"
          />
          <InputField
            type="text"
            value={primaryColor}
            onChange={e => onPrimaryColorChange(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1"
            label={t('features.avatarGenerator.primaryColor')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.foreignColor')}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={foreignColor}
            onChange={e => onForeignColorChange(e.target.value)}
            className="w-12 h-10 rounded border border-input bg-background cursor-pointer"
          />
          <InputField
            type="text"
            value={foreignColor}
            onChange={e => onForeignColorChange(e.target.value)}
            placeholder="#ef4444"
            className="flex-1"
            label={t('features.avatarGenerator.foreignColor')}
          />
        </div>
      </div>
    </div>
  );
};