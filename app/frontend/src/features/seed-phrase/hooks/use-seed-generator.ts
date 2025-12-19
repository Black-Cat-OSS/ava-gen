import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Функция для получения случайных слов из API
 *
 * @returns {Promise<string>} Seed-фраза из 12 слов
 */
const fetchRandomWords = async (): Promise<string> => {
  const response = await fetch('https://random-word-api.herokuapp.com/word?number=12');

  if (!response.ok) {
    throw new Error('Failed to fetch random words');
  }

  const words: string[] = await response.json();
  return words.join('-');
};

/**
 * Хук для автоматической загрузки seed-фразы при монтировании
 *
 * @returns {Object} Объект с seed-фразой и состоянием загрузки
 * @example
 * ```tsx
 * const { data: seed, isLoading } = useInitialSeed();
 * ```
 */
export const useInitialSeed = () => {
  return useQuery({
    queryKey: ['seed-phrase', 'initial'],
    queryFn: fetchRandomWords,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

/**
 * Хук для генерации новой seed-фразы по требованию
 *
 * @returns {Object} Объект с мутацией для генерации seed
 * @example
 * ```tsx
 * const { mutateAsync: generateSeed, isPending } = useSeedGenerator();
 * const newSeed = await generateSeed();
 * ```
 */
export const useSeedGenerator = () => {
  return useMutation({
    mutationFn: fetchRandomWords,
  });
};
