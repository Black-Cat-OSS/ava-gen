import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Button, ErrorBoundary, Separator, Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { Link } from '@tanstack/react-router';
import { AVAILABLE_SIZES, AVAILABLE_FILTERS, IMAGE_VIEW_SIZE } from '../constants';
import { AvatarDisplay } from './AvatarDisplay';
import { AvatarLinkCopy } from '@/features/avatar-link-copy';

export const AvatarViewerPage = () => {
  const { t } = useTranslation();
  const search = useSearch({ from: '/avatar-viewer' });
  const navigate = useNavigate({ from: '/avatar-viewer' });
  const [size, setSize] = useState<number>(search.size || 6);
  const [filter, setFilter] = useState<string>(search.filter || '');
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (search.size !== undefined && search.size !== size) {
      setSize(search.size);
    }
    if (search.filter !== undefined && search.filter !== filter) {
      setFilter(search.filter || '');
    }
  }, [search.size, search.filter, size, filter]);

  const handleSizeChange = (newSize: number) => {
    isInternalUpdate.current = true;
    setSize(newSize);
    navigate({
      search: prev => ({
        ...prev,
        size: newSize,
      }),
    });
  };

  const handleFilterChange = (newFilter: string) => {
    const filterValue = newFilter === 'none' ? '' : newFilter;
    isInternalUpdate.current = true;
    setFilter(filterValue);
    navigate({
      search: prev => ({
        ...prev,
        filter: filterValue || undefined,
      }),
    });
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t('pages.avatarViewer.title')}</h1>
        <p className="text-muted-foreground">{t('pages.avatarViewer.subtitle')}</p>
      </div>

      {!search.id && (
        <ErrorBoundary>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t('pages.avatarViewer.noAvatarSelected')}</p>
            <Link to="/">
              <Button variant="outline">{t('pages.avatarViewer.backToGallery')}</Button>
            </Link>
          </div>
        </ErrorBoundary>
      )}

      {search.id && (
        <div className="grid grid-cols-[1fr_0.5fr] gap-4">
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

          <div>
            <h6 className=" font-semibold text-foreground mb-2">
              {t('pages.avatarViewer.allSizes')}
            </h6>
            <Tabs
              value={size?.toString() || '6'}
              onValueChange={value => handleSizeChange(Number.parseInt(value, 10))}
            >
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                {AVAILABLE_SIZES.map(sizeOption => (
                  <TabsTrigger key={sizeOption.value} value={sizeOption.value.toString()}>
                    {sizeOption.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <h6 className=" font-semibold text-foreground mt-4 mb-2">
              {t('pages.avatarViewer.allFilters')}
            </h6>
            <Tabs value={filter || 'none'} onValueChange={handleFilterChange}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {AVAILABLE_FILTERS.map(filterOption => (
                  <TabsTrigger key={filterOption.value} value={filterOption.value || 'none'}>
                    {filterOption.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Separator className="my-8 bg-gray-300/70" />

            <AvatarLinkCopy avatarId={search.id} size={size} filter={filter} />
          </div>
        </div>
      )}
    </div>
  );
};
