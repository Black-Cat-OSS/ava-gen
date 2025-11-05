import { Button, Textarea } from '@/shared/ui';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadInitialSeed = async () => {
      if (value) {
        setIsInitialLoading(false);
        return;
      }

      try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=12');

        if (response.ok) {
          const words: string[] = await response.json();
          const seedPhrase = words.join('-').slice(0, 32);
          onChange(seedPhrase);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialSeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          disabled={disabled || isGenerating || isInitialLoading}
        >
          {isGenerating
            ? t('features.avatarGenerator.generating')
            : t('features.avatarGenerator.generateSeed')}
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={
          isInitialLoading
            ? 'Loading seed phrase...'
            : t('features.avatarGenerator.seedPlaceholder')
        }
        maxLength={32}
        disabled={disabled}
        readOnly={isInitialLoading}
        className="min-h-[60px] resize-none"
      />
      <p className="text-xs text-muted-foreground">
        {t('features.avatarGenerator.seedDescription')}
      </p>
    </div>
  );
};
