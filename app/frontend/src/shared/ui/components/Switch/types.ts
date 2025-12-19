import type { ReactNode } from 'react';

/**
 * Props for the Switch component
 */
export interface SwitchProps {
  /**
   * Current state of the switch (true = right position, false = left position)
   */
  checked: boolean;

  /**
   * Callback function called when the switch state changes
   * @param checked - new state of the switch
   */
  onChange: (checked: boolean) => void;

  /**
   * Icon to display on the left side of the switch
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display on the right side of the switch
   */
  rightIcon?: ReactNode;

  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS classes to apply to the switch container
   */
  className?: string;

  /**
   * Accessibility label for the switch
   */
  ariaLabel?: string;
}
