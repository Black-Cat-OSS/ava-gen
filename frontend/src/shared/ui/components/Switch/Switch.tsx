import { cn } from '@/shared/lib/utils';
import type { SwitchProps } from './types';

/**
 * Switch component - a reusable toggle switch with customizable icons
 * Supports left and right icons, smooth animations, and accessibility features
 */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center cursor-pointer transition-all duration-300',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Switch track */}
      <div
        className={cn(
          'relative w-16 h-8 rounded-full transition-all duration-300',
          checked
            ? 'bg-primary'
            : 'bg-muted'
        )}
      >
        {/* Switch thumb */}
        <div
          className={cn(
            'absolute top-1 w-6 h-6 rounded-full bg-background shadow-sm transition-all duration-300',
            checked ? 'left-7' : 'left-1'
          )}
        />
      </div>

      {/* Icons container */}
      <div className="relative ml-2 flex items-center space-x-1">
        {/* Left icon */}
        {leftIcon && (
          <div
            className={cn(
              'transition-opacity duration-300',
              checked ? 'opacity-50' : 'opacity-100'
            )}
          >
            {leftIcon}
          </div>
        )}

        {/* Right icon */}
        {rightIcon && (
          <div
            className={cn(
              'transition-opacity duration-300',
              checked ? 'opacity-100' : 'opacity-50'
            )}
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};
