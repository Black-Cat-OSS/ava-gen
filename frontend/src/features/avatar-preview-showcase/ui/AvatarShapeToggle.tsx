import { Switch } from '@/shared/ui/components';
import { useAvatarShape } from '../hooks';
import { useLocalTranslations } from '../hooks/useLocalTranslations';

/**
 * Circle icon for avatar shape toggle
 */
const CircleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
);

/**
 * Square icon for avatar shape toggle
 */
const SquareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" rx="2" />
  </svg>
);

/**
 * AvatarShapeToggle component - toggle between circular and square avatar shapes
 * Uses the base Switch component with circle and square icons
 */
export const AvatarShapeToggle: React.FC = () => {
  const { shape, setShape } = useAvatarShape();
  const { t } = useLocalTranslations();

  const handleShapeChange = (checked: boolean) => {
    setShape(checked ? 'square' : 'circle');
  };

  return (
    <Switch
      checked={shape === 'square'}
      onChange={handleShapeChange}
      leftIcon={<CircleIcon />}
      rightIcon={<SquareIcon />}
      ariaLabel={t('shapeToggle.ariaLabel')}
    />
  );
};
