import type { IColorScheme } from '@/shared/api/generator/types';

/**
 * Props interface for AnglePresets component
 */
export interface AnglePresetsProps {
  /**
   * Current selected angle
   */
  currentAngle: number;
  /**
   * Callback when preset angle is selected
   */
  onAngleSelect: (angle: number, event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Size of each preset visualizer
   */
  size?: number;

  colorScheme?: IColorScheme;
}
