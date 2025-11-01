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
  onAngleSelect: (angle: number) => void;
  /**
   * Size of each preset visualizer
   */
  size?: number;
}
