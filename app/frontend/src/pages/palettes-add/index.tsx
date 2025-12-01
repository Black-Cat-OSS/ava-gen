import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui';
import { useCreatePalette } from '@/features/color-palette/hooks';

/**
 * Интерфейс формы создания палитры
 */
interface PaletteFormData {
  name: string;
  key: string;
  primaryColor: string;
  foreignColor: string;
}

/**
 * Генерирует случайный цвет в формате hex
 * @returns Строка цвета в формате #RRGGBB
 */
const generateRandomColor = (): string => {
  const randomHex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomHex}`;
};

/**
 * Страница создания новой цветовой палитры
 * Позволяет пользователю создать палитру из двух цветов
 * с функцией случайной генерации
 */
const PalettesAdd = () => {
  const navigate = useNavigate();
  const { mutate: createPalette, isPending } = useCreatePalette();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaletteFormData>({
    defaultValues: {
      name: '',
      key: '',
      primaryColor: '#FF6B6B',
      foreignColor: '#4ECDC4',
    },
  });

  const primaryColor = watch('primaryColor');
  const foreignColor = watch('foreignColor');

  /**
   * Генерирует случайные цвета для обоих полей
   */
  const handleRandomize = () => {
    setValue('primaryColor', generateRandomColor());
    setValue('foreignColor', generateRandomColor());
  };

  /**
   * Обрабатывает отправку формы
   */
  const onSubmit = (data: PaletteFormData) => {
    setError(null);
    createPalette(
      {
        name: data.name,
        key: data.key,
        primaryColor: data.primaryColor,
        foreignColor: data.foreignColor,
      },
      {
        onSuccess: () => {
          navigate({ to: '/palettes' });
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to create palette');
        },
      },
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Palette</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Palette Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter palette name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Key Field */}
          <div>
            <label htmlFor="key" className="block text-sm font-medium mb-2">
              Palette Key
            </label>
            <input
              id="key"
              type="text"
              {...register('key', {
                required: 'Key is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Key must contain only lowercase letters, numbers, and hyphens',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., my-palette"
            />
            {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>}
          </div>

          {/* Colors Section */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Colors</h2>
              <Button type="button" onClick={handleRandomize} variant="outline" size="sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Randomize
              </Button>
            </div>

            <div className="space-y-4">
              {/* Primary Color */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="primaryColor" className="block text-sm font-medium mb-2">
                    Primary Color
                  </label>
                  <input
                    id="primaryColor"
                    type="text"
                    {...register('primaryColor', {
                      required: 'Primary color is required',
                      pattern: {
                        value: /^#[0-9A-Fa-f]{6}$/,
                        message: 'Must be a valid hex color (e.g., #FF6B6B)',
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#FF6B6B"
                  />
                  {errors.primaryColor && (
                    <p className="mt-1 text-sm text-red-600">{errors.primaryColor.message}</p>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <div
                    className="w-16 h-10 rounded-md border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>

              {/* Foreign Color */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="foreignColor" className="block text-sm font-medium mb-2">
                    Secondary Color
                  </label>
                  <input
                    id="foreignColor"
                    type="text"
                    {...register('foreignColor', {
                      required: 'Secondary color is required',
                      pattern: {
                        value: /^#[0-9A-Fa-f]{6}$/,
                        message: 'Must be a valid hex color (e.g., #4ECDC4)',
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#4ECDC4"
                  />
                  {errors.foreignColor && (
                    <p className="mt-1 text-sm text-red-600">{errors.foreignColor.message}</p>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <div
                    className="w-16 h-10 rounded-md border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: foreignColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={() => navigate({ to: '/palettes' })}
              variant="outline"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Palette'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PalettesAdd;