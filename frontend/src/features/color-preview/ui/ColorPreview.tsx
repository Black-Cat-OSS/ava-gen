import type { IColorScheme } from '@/shared/api/generator/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Color preview component for primary and foreign colors selection
 *
 * @param props - Component props
 * @param props.primaryColor - Primary color value
 * @param props.foreignColor - Foreign color value
 * @param props.onPrimaryColorChange - Callback for primary color change
 * @param props.onForeignColorChange - Callback for foreign color change
 * @param props.disabled - Whether the inputs are disabled
 * @returns JSX element
 */
export const ColorPreview: React.FC<{
  primaryColor: string;
  foreignColor: string;
  // @deprecated use onChange instead
  onPrimaryColorChange?: (color: string) => void;
  // @deprecated use onChange instead
  onForeignColorChange?: (color: string) => void;
  onChange?: (scheme: IColorScheme) => void;
  disabled?: boolean;
}> = ({ primaryColor, foreignColor, onChange, disabled }) => {
  const { t } = useTranslation('featuresColorPreview');

  const [colorScheme, setColorScheme] = useState<IColorScheme>({
    primaryColor: primaryColor ?? '#ffffff',
    foreignColor: foreignColor ?? '#000000',
  });

  useEffect(() => {
    setColorScheme({ primaryColor, foreignColor });
  }, [primaryColor, foreignColor]);

  return (
    <div className="grid grid-cols-2 grid-rows-[20px_auto] gap-2">
      <strong className="block h-5 text-sm text-foreground col-start-1 row-start-1">
        {t('primaryColor')}
      </strong>
      <input
        type="color"
        value={colorScheme.primaryColor}
        onChange={e => {
          setColorScheme({ ...colorScheme, primaryColor: e.target.value });
          onChange?.(colorScheme);
        }}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background col-start-1 row-start-2"
      />

      <strong className="block h-5 text-sm text-foreground col-start-2 row-start-1">
        {t('foreignColor')}
      </strong>
      <input
        type="color"
        value={colorScheme.foreignColor}
        onChange={e => {
          setColorScheme({ ...colorScheme, foreignColor: e.target.value });
          onChange?.(colorScheme);
        }}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background col-start-2 row-start-2"
      />
    </div>
  );
};
