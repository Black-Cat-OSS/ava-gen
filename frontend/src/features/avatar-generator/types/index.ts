/**
 * Props for the internal form component
 */
export interface AvatarGeneratorFormInternalProps {
  formData: {
    primaryColor: string;
    foreignColor: string;
    colorScheme: string;
    seed: string;
    type: string;
    angle: number;
  };
  onFormDataChange: (field: string, value: string | number) => void;
  onGenerateSeed: () => void;
}

/**
 * Props for CustomColorInputs component
 */
export interface CustomColorInputsProps {
  primaryColor: string;
  foreignColor: string;
  onPrimaryColorChange: (value: string) => void;
  onForeignColorChange: (value: string) => void;
}

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