import React from 'react';

/**
 * Color preview component for primary and foreign colors selection
 *
 * @param props - Component props
 * @param props.primaryColor - Primary color value
 * @param props.foreignColor - Foreign color value
 * @param props.onPrimaryColorChange - Callback for primary color change
 * @param props.onForeignColorChange - Callback for foreign color change
 * @param props.disabled - Whether the inputs are disabled
 * @param props.t - Translation function
 * @returns JSX element
 */
export const ColorPreview: React.FC<{
  primaryColor: string;
  foreignColor: string;
  onPrimaryColorChange: (color: string) => void;
  onForeignColorChange: (color: string) => void;
  disabled?: boolean;
  t: (key: string) => string;
}> = ({ primaryColor, foreignColor, onPrimaryColorChange, onForeignColorChange, disabled, t }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-[20px_auto] gap-2">
      <strong className="block h-5 text-sm text-foreground col-start-1 row-start-1">
        {t('features.avatarGenerator.primaryColor')}
      </strong>
      <input
        type="color"
        value={primaryColor}
        onChange={e => onPrimaryColorChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background col-start-1 row-start-2"
      />

      <strong className="block h-5 text-sm text-foreground col-start-2 row-start-1">
        {t('features.avatarGenerator.foreignColor')}
      </strong>
      <input
        type="color"
        value={foreignColor}
        onChange={e => onForeignColorChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background col-start-2 row-start-2"
      />
    </div>
  );
};
