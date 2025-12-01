import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@tanstack/react-router';
import { Button, Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { Link } from '@tanstack/react-router';
import { AVAILABLE_SIZES, AVAILABLE_FILTERS, IMAGE_VIEW_SIZE } from '../constants';
import { AvatarDisplay } from './AvatarDisplay';

export const AvatarViewerPage = () => {
  const { t } = useTranslation();
  const search = useSearch({ from: '/avatar-viewer' });
  const [size, setSize] = useState<number>(6);
  const [filter, setFilter] = useState<string>('');

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t('pages.avatarViewer.title')}</h1>
        <p className="text-muted-foreground">{t('pages.avatarViewer.subtitle')}</p>
      </div>

      {!search.id && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{t('pages.avatarViewer.noAvatarSelected')}</p>
          <Link to="/">
            <Button variant="outline">{t('pages.avatarViewer.backToGallery')}</Button>
          </Link>
        </div>
      )}

      {search.id && (
        <>
          <div className="flex justify-center items-center mb-8">
            <div
              style={{
                width: IMAGE_VIEW_SIZE,
                height: IMAGE_VIEW_SIZE,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AvatarDisplay
                id={search.id}
                current={{ size, filter }}
                alt={t('pages.avatarViewer.avatar')}
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('pages.avatarViewer.allSizes')}
          </h2>
          <Tabs
            value={size?.toString() || '6'}
            onValueChange={value => setSize(Number.parseInt(value, 10))}
          >
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              {AVAILABLE_SIZES.map(sizeOption => (
                <TabsTrigger key={sizeOption.value} value={sizeOption.value.toString()}>
                  {sizeOption.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('pages.avatarViewer.allFilters')}
          </h2>
          <Tabs
            value={filter || 'none'}
            onValueChange={value => setFilter(value === 'none' ? '' : value)}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {AVAILABLE_FILTERS.map(filterOption => (
                <TabsTrigger key={filterOption.value} value={filterOption.value || 'none'}>
                  {filterOption.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </>
      )}
    </div>
  );
};
