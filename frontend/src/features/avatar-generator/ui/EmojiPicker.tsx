import React, { useState } from 'react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { Button } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import type { EmojiPickerProps } from '../types';

/**
 * Component for selecting emoji using emoji-picker-react
 * 
 * Provides a button to open/close emoji picker and displays selected emoji.
 * Uses emoji-picker-react library for emoji selection interface.
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({
  selectedEmoji,
  onEmojiSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  const handleTogglePicker = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {t('features.avatarGenerator.emojiPicker.label')}
      </label>
      
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleTogglePicker}
          disabled={disabled}
          className="flex items-center gap-2 min-w-[120px]"
        >
          <span className="text-lg">{selectedEmoji}</span>
          <span className="text-sm text-muted-foreground">
            {isOpen ? t('features.avatarGenerator.emojiPicker.close') : t('features.avatarGenerator.emojiPicker.open')}
          </span>
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {t('features.avatarGenerator.emojiPicker.selected')}: {selectedEmoji}
        </div>
      </div>

      {isOpen && (
        <div className="relative z-10">
          <div className="absolute top-0 left-0 bg-background border border-border rounded-lg shadow-lg">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
              previewConfig={{
                showPreview: false,
              }}
              searchDisabled={false}
              skinTonesDisabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
