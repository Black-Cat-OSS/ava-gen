import { Button, Textarea } from '@/shared/ui';
import { useInitialSeed } from '../hooks/use-seed-generator';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

/**
 * Компонент для ввода и генерации seed-фразы
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.value - Текущее значение seed
 * @param {function} props.onChange - Обработчик изменения значения
 * @param {function} props.onGenerate - Обработчик генерации новой seed-фразы
 * @param {boolean} [props.disabled] - Отключить поле ввода
 * @param {boolean} [props.isGenerating] - Флаг процесса генерации
 */
interface SeedPhraseProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export const SeedPhrase = ({
  value,
  onChange,
  onGenerate,
  disabled = false,
  isGenerating = false,
}: SeedPhraseProps) => {
  const { t } = useTranslation('featuresSeedPhrase');
  const { data: initialSeed, isLoading: isInitialLoading } = useInitialSeed();

  useEffect(() => {
    if (initialSeed && !value) {
      onChange(initialSeed);
    }
  }, [initialSeed, value, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between align-center">
        <strong className="text-sm text-foreground">{t('seedPhrase.label')}</strong>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerate}
          className="text-xs"
          disabled={disabled || isGenerating || isInitialLoading}
        >
          {isGenerating ? t('seedPhrase.generating') : t('seedPhrase.generate')}
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={isInitialLoading ? t('seedPhrase.loading') : t('seedPhrase.placeholder')}
        maxLength={255}
        disabled={disabled}
        readOnly={isInitialLoading}
        className="min-h-[60px] resize-none"
      />
      <p className="text-xs text-muted-foreground">{t('seedPhrase.description')}</p>
    </div>
  );
};
