import { Button, InputField } from "@/shared/ui";

export const SeedPhrase = () => {
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
          onClick={onGenerateSeed}
          className="text-xs"
        >
          {t('features.avatarGenerator.generateSeed')}
        </Button>
      </div>
      <InputField
        type="text"
        value={formData.seed}
        onChange={e => handleInputChange('seed', e.target.value)}
        placeholder={t('features.avatarGenerator.seedPlaceholder')}
        maxLength={32}
        label=""
      />
      <p className="text-xs text-muted-foreground">
        {t('features.avatarGenerator.seedDescription')}
      </p>
    </div>
  );
};
