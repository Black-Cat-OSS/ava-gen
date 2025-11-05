import { useState } from 'react';

/**
 * Хук для генерации seed-фразы через random-word-api
 *
 * @returns {Object} Объект с функцией генерации и состоянием загрузки
 * @example
 * ```tsx
 * const { generateSeed, isGenerating } = useSeedGenerator();
 * const seed = await generateSeed();
 * ```
 */
export const useSeedGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Генерирует seed-фразу из 12 случайных слов
   *
   * @returns {Promise<string>} Строка с 12 словами, соединенными через дефис
   * @throws {Error} Если не удалось получить слова от API
   */
  const generateSeed = async (): Promise<string> => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=12');

      if (!response.ok) {
        throw new Error('Failed to generate seed phrase');
      }

      const words: string[] = await response.json();

      // Соединяем слова через дефис и ограничиваем до 32 символов
      const seedPhrase = words.join('-').slice(0, 32);

      return seedPhrase;
    } catch (error) {
      console.error('Error generating seed phrase:', error);
      // В случае ошибки возвращаем фолбэк seed
      return `seed-${Date.now().toString(36)}`.slice(0, 32);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSeed,
    isGenerating,
  };
};
