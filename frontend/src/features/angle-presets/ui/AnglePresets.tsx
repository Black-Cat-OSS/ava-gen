import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AngleVisualizer, Separator } from '@/shared/ui';
import type { AnglePresetsProps } from '../types';

/**
 * Component for displaying angle presets
 *
 * Shows a grid of predefined angle values with visual indicators.
 * Users can click on any preset to quickly select that angle.
 */
export const AnglePresets: FC<AnglePresetsProps> = ({
  onAngleSelect,
  size = 70,
  colorScheme,
  currentAngle,
}) => {
  const { t } = useTranslation();

  const presetAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="@container/angle-presets flex flex-col gap-3 bg-gray-700 rounded-lg p-4 min-w-[calc(70px*3)]">
      <div className="grid grid-cols-[repeat(2,minmax(70px,1fr))] @lg:grid-cols-[repeat(4,minmax(70px,1fr))] @xl:grid-cols-[repeat(8,minmax(70px,1fr))] gap-3">
        {presetAngles.map(presetAngle => (
          <button
            key={presetAngle}
            type="button"
            onClick={e => {
              onAngleSelect(presetAngle, e);
            }}
            className={
              'px-2 rounded-md border-none transition-all border-border bg-gray-500 hover:bg-gray-500/50'
            }
            style={{
              borderColor:
                currentAngle === presetAngle ? (colorScheme?.primaryColor ?? '#ffffff') : undefined,
              backgroundColor:
                currentAngle === presetAngle
                  ? `${colorScheme?.primaryColor ?? '#ffffff'}50`
                  : undefined,
              boxShadow:
                currentAngle === presetAngle
                  ? `0 0 0 3px ${colorScheme?.primaryColor ?? '#ffffff'}90, 0 0 0 8px ${colorScheme?.primaryColor ?? '#ffffff'}25`
                  : undefined,
            }}
          >
            <AngleVisualizer angle={presetAngle} onChange={() => {}} size={size} readonly={true} />
          </button>
        ))}
      </div>
      <Separator className="bg-gray-300/60" />
      <p className="text-xs text-muted-foreground text-center">
        {t('features.avatarGenerator.anglePresets')}
      </p>
    </div>
  );
};
