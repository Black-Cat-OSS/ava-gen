import { PaletteCard } from '@/widgets';
import type { ApiPagination } from '@/shared/api';
import type { Pallete } from '@/entities';

/**
 * Пропсы компонента PalletesGrid
 */
type PalletesGridProps = {
  /**
   * Данные палитр с пагинацией
   */
  data?: ApiPagination<Pallete>;
  /**
   * Заголовок страницы
   */
  title: string;
};

/**
 * Сетка отображения палитр цветов
 * @param props - Пропсы компонента
 * @param props.data - Данные палитр с пагинацией
 * @param props.title - Заголовок страницы
 * @returns JSX элемент с сеткой палитр
 */
const PalletesGrid = ({ data, title }: PalletesGridProps) => {
  if (!data) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items?.map((palette: Pallete) => (
          <PaletteCard key={palette.id} palette={palette} type="default" />
        ))}
      </div>
    </div>
  );
};

export default PalletesGrid;
