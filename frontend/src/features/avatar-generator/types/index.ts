/**
 * Props interface for AvatarGeneratorFormInternal component
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
 * Props interface for CustomColorInputs component
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

/**
 * Background type for emoji avatars
 */
export type BackgroundType = 'solid' | 'linear' | 'radial';

/**
 * Emoji size relative to avatar
 */
export type EmojiSize = 'small' | 'medium' | 'large';

/**
 * Form data for emoji avatar generation
 */
export interface EmojiAvatarFormData {
  emoji: string;
  backgroundType: BackgroundType;
  primaryColor: string;
  foreignColor: string;
  angle: number;
  emojiSize: EmojiSize;
}

/**
 * Props interface for EmojiPicker component
 */
export interface EmojiPickerProps {
  /**
   * Selected emoji
   */
  selectedEmoji: string;
  /**
   * Callback when emoji is selected
   */
  onEmojiSelect: (emoji: string) => void;
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean;
}

/**
 * Props interface for BackgroundTypeSelector component
 */
export interface BackgroundTypeSelectorProps {
  /**
   * Selected background type
   */
  selectedType: BackgroundType;
  /**
   * Callback when background type is selected
   */
  onTypeSelect: (type: BackgroundType) => void;
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
}

/**
 * Props interface for EmojiSizeSelector component
 */
export interface EmojiSizeSelectorProps {
  /**
   * Selected emoji size
   */
  selectedSize: EmojiSize;
  /**
   * Callback when emoji size is selected
   */
  onSizeSelect: (size: EmojiSize) => void;
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
}

/**
 * Props interface for EmojiAvatarGeneratorForm component
 */
export interface EmojiAvatarGeneratorFormProps {
  /**
   * Form data
   */
  formData: EmojiAvatarFormData;
  /**
   * Callback when form data changes
   */
  onFormDataChange: (field: keyof EmojiAvatarFormData, value: string | number) => void;
  /**
   * Whether the form is disabled
   */
  disabled?: boolean;
}

/**
 * Props interface for EmojiServiceHealthCheck component
 */
export interface EmojiServiceHealthCheckProps {
  /**
   * Children to render when service is healthy
   */
  children: React.ReactNode;
  /**
   * Fallback component to render when service is unhealthy
   */
  fallback?: React.ReactNode;
}