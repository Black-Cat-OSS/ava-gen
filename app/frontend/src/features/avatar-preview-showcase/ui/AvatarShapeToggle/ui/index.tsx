import { Switch } from '@/shared/ui/components';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import { useTranslation } from 'react-i18next';
import { CircleIcon } from './CircleIcon';
import { SquareIcon } from './SquareIcon';

/**
 * AvatarShapeToggle component - toggle between circular and square avatar shapes
 * Uses the base Switch component with circle and square icons
 */
export const AvatarShapeToggle: React.FC = () => {
  const { shape, setShape } = useAvatarShape();
  const { t } = useTranslation('featuresAvatarPreviewShowcase');

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
