import { useState, useMemo } from 'react';
import { API_BASE_URL } from '../constants';

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
  onError: () => void;
}

interface UseAvatarImageParams {
  id: string;
  alt?: string;
  size?: number;
  filter?: string;
}

/**
 * Хук для получения атрибутов изображения аватара
 * @param params - Параметры изображения
 * @param params.id - Идентификатор аватара
 * @param params.alt - Альтернативный текст для изображения (опционально)
 * @param params.size - Размер изображения в пикселях (опционально)
 * @param params.filter - Фильтр изображения: 'grayscale', 'sepia', 'negative' или пустая строка (опционально)
 * @returns Объект с атрибутами для тега img
 */
export const useAvatarImage = ({ id, alt = 'Avatar', size, filter }: UseAvatarImageParams) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = useMemo(() => {
    if (!id) {
      return '';
    }

    const url = new URL(`${API_BASE_URL}/api/v1/${id}`);

    if (size !== undefined && size >= 4 && size <= 9) {
      url.searchParams.set('size', size.toString());
    }

    if (filter && filter !== '') {
      url.searchParams.set('filter', filter);
    }

    return url.toString();
  }, [id, size, filter]);

  const imageProps: AvatarImageProps = useMemo(
    () => ({
      src: imageUrl,
      alt,
      className: 'w-full h-full object-cover',
      onError: () => setHasError(true),
    }),
    [imageUrl, alt],
  );

  return {
    ...imageProps,
    hasError,
  };
};
