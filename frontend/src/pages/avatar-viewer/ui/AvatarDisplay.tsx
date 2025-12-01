import { useMemo, useState } from 'react';
import { FailImage } from '@/shared/ui';
import { AVAILABLE_SIZES, AVAILABLE_FILTERS } from '../constants';
import { API_BASE_URL } from '@/shared/lib/constants';

interface AvatarDisplayProps {
  id: string;
  current: {
    size: number;
    filter: string;
  };
  alt?: string;
  className?: string;
}

/**
 * Компонент для отображения аватара с поддержкой нескольких вариантов.
 * Создает все комбинации размеров и фильтров, но отображает только текущий вариант.
 * Остальные варианты предзагружаются для быстрого переключения.
 *
 * @param props - Параметры компонента
 * @param props.id - Идентификатор аватара
 * @param props.current - Объект с текущими значениями размера и фильтра
 * @param props.current.size - Текущий размер аватара (4-9)
 * @param props.current.filter - Текущий фильтр ('', 'grayscale', 'sepia', 'negative')
 * @param props.alt - Альтернативный текст для изображения
 * @param props.className - Дополнительные CSS классы
 */
export const AvatarDisplay = ({ id, current, alt = 'Avatar', className }: AvatarDisplayProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const allImageVariants = useMemo(() => {
    return AVAILABLE_SIZES.flatMap(sizeOption =>
      AVAILABLE_FILTERS.map(filterOption => ({
        size: sizeOption.value,
        filter: filterOption.value,
        key: `${sizeOption.value}-${filterOption.value}`,
      })),
    );
  }, []);

  const currentKey = useMemo(
    () => `${current.size}-${current.filter || ''}`,
    [current.size, current.filter],
  );

  const getImageUrl = (size: number, filter: string) => {
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
  };

  const handleImageError = (key: string) => {
    setImageErrors(prev => new Set(prev).add(key));
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {allImageVariants.map(variant => {
        const isCurrent = variant.key === currentKey;
        const hasError = imageErrors.has(variant.key);
        const imageUrl = getImageUrl(variant.size, variant.filter);

        if (isCurrent && hasError) {
          return (
            <div key={variant.key} style={{ display: isCurrent ? 'block' : 'none' }}>
              <FailImage />
            </div>
          );
        }

        return (
          <img
            key={variant.key}
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            style={{
              display: isCurrent && !hasError ? 'block' : 'none',
            }}
            loading={isCurrent ? 'eager' : 'lazy'}
            fetchPriority={isCurrent ? 'high' : 'low'}
            onError={() => handleImageError(variant.key)}
          />
        );
      })}
    </div>
  );
};
