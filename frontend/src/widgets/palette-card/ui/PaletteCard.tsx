import type { Pallete } from '@/entities';

/**
 * Props for the PaletteCard component
 */
export interface PaletteCardProps {
  /** Palette data to display */
  palette: Pallete;
  /** Display type: 'mini' for compact button, 'default' for full card */
  type: 'mini' | 'default';
  /** Whether this palette is currently selected (only for 'mini' type) */
  isSelected?: boolean;
  /** Callback when palette is clicked (only for 'mini' type) */
  onClick?: (palette: Pallete) => void;
}

/**
 * Universal palette card component with two display variants
 * - 'mini': Compact button for palette selection
 * - 'default': Full card with detailed information
 *
 * @param props - Component props
 */
export const PaletteCard = ({ palette, type, isSelected, onClick }: PaletteCardProps) => {
  if (type === 'mini') {
    return (
      <button
        type="button"
        onClick={() => onClick?.(palette)}
        className={`p-3 rounded-lg border-2 transition-all`}
        style={{
          borderColor: isSelected ? palette.primaryColor : undefined,
          backgroundColor: isSelected ? `${palette.primaryColor}15` : undefined,
          boxShadow: isSelected
            ? `0 0 0 3px ${palette.primaryColor}50, 0 0 0 8px ${palette.primaryColor}20`
            : undefined,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-[50%] h-8 rounded-sm border border-border"
            style={{ backgroundColor: palette.primaryColor }}
          />
          <div
            className="w-[50%] h-8 rounded-sm border border-border"
            style={{ backgroundColor: palette.foreignColor }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground">{palette.name}</p>
      </button>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{palette.name}</h3>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="h-12 rounded-md mb-2" style={{ backgroundColor: palette.primaryColor }} />
          <p className="text-sm text-gray-600">Primary: {palette.primaryColor}</p>
        </div>
        <div className="flex-1">
          <div className="h-12 rounded-md mb-2" style={{ backgroundColor: palette.foreignColor }} />
          <p className="text-sm text-gray-600">Foreign: {palette.foreignColor}</p>
        </div>
      </div>

      <div className="text-xs text-gray-500">Key: {palette.key}</div>
    </div>
  );
};
