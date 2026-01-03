import { PaletteCard } from '@/widgets';
import type { Pallete } from '@/entities';
import { usePalletesSuspense } from '@/shared/lib/hooks';

/**
 * Сетка отображения палитр цветов
 * @param props - Пропсы компонента
 * @param props.data - Данные палитр с пагинацией
 * @param props.title - Заголовок страницы
 * @returns JSX элемент с сеткой палитр
 */
const PalletesGrid = () => {
  const { data } = usePalletesSuspense({ pick: 50, offset: 0 });

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items?.map((palette: Pallete) => (
          <PaletteCard key={palette.id} palette={palette} type="default" />
        ))}
      </div>
    </div>
  );
};

export default PalletesGrid;
