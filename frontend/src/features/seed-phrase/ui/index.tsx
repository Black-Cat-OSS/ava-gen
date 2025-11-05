import { Button, InputField } from '@/shared/ui';
import { t } from 'i18next';

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
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.seed')}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerate}
          className="text-xs"
          disabled={disabled || isGenerating}
        >
          {isGenerating
            ? t('features.avatarGenerator.generating')
            : t('features.avatarGenerator.generateSeed')}
        </Button>
      </div>
      <InputField
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('features.avatarGenerator.seedPlaceholder')}
        maxLength={32}
        label=""
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        {t('features.avatarGenerator.seedDescription')}
      </p>
    </div>
  );
};
