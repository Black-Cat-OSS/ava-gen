import { usePalletes } from '@/shared/lib/hooks';
import { PaletteCard } from '@/widgets';

export const PalletesGrid = () => {
  const { data } = usePalletes({ pick: 10, offset: 0 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Color Palettes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items.map(palette => (
          <PaletteCard key={palette.id} palette={palette} type="default" />
        ))}
      </div>
    </div>
  );
};
