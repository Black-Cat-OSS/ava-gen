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
      <div className="flex items-center gap-3">
        {/* Left icon */}
        {leftIcon && (
          <div
            className={cn(
              'transition-opacity duration-300 text-foreground',
              !checked ? 'opacity-100' : 'opacity-50'
            )}
          >
            {leftIcon}
          </div>
        )}

        {/* Switch track */}
        <div
          className={cn(
            'relative w-14 h-7 rounded-full transition-all duration-300',
            checked
              ? 'bg-blue-600'
              : 'bg-gray-700'
          )}
        >
          {/* Switch thumb */}
          <div
            className={cn(
              'absolute top-1 w-5 h-5 rounded-full shadow-lg transition-all duration-300',
              'bg-gray-800',
              checked ? 'left-[31px]' : 'left-[3px]'
            )}
          />
        </div>

        {/* Right icon */}
        {rightIcon && (
          <div
            className={cn(
              'transition-opacity duration-300 text-foreground',
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
