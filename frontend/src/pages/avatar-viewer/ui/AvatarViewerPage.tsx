import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@tanstack/react-router';
import { Button, FailImage } from '@/shared/ui';
import { useAvatars } from '@/shared/lib';
import { avatarApi } from '@/shared/api';
import { Link } from '@tanstack/react-router';
import { AvatarLinkCopy } from '@/features/avatar-link-copy';
import { useLocalTranslations } from '@/features/avatar-link-copy/hooks';
import { AVAILABLE_SIZES, AVAILABLE_FILTERS } from '../constants';
import { ErrorBoundary } from './ErrorBoundary';
import { NotFound } from './NotFound';
import { AvatarInformation } from './AvatarInformation';

export const AvatarViewerPage = () => {
  useLocalTranslations();
  const { t } = useTranslation();
  const search = useSearch({ from: '/avatar-viewer' });
  const { data, isLoading, isError, error } = useAvatars({ pick: 100 });

  const [size, setSize] = useState(128);
  const [filter, setFilter] = useState('');

  const avatar = data?.avatars?.find(a => a.id === search.id);

  const selectedSizeLabel = AVAILABLE_SIZES.find(s => s.value === size)?.label || `${size}px`;

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('pages.avatarViewer.title')}
          </h1>
          <p className="text-muted-foreground">{t('pages.avatarViewer.subtitle')}</p>
        </div>

        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">{t('pages.avatarViewer.backToGallery')}</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('pages.avatarViewer.loading')}</p>
          </div>
        )}

        {isError && (
          <ErrorBoundary error={error} />
        )}

        {data && !avatar && search.id && (
          <NotFound />
        )}

        {!search.id && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t('pages.avatarViewer.noAvatarSelected')}</p>
            <Link to="/">
              <Button variant="outline">{t('pages.avatarViewer.backToGallery')}</Button>
            </Link>
          </div>
        )}

        {avatar && (
          <>
            <AvatarInformation avatar={avatar} />

            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                {t('pages.avatarViewer.avatarPreview')}
              </h2>

              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div
                    className="bg-muted rounded-lg overflow-hidden shadow-lg"
                    style={{
                      width: Math.min(size * 2, 512),
                      height: Math.min(size * 2, 512),
                      aspectRatio: '1',
                    }}
                  >
                    <img
                      src={avatarApi.getImageUrl(avatar.id, filter, size)}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      onError={() => <FailImage />}
                    />
                  </div>

                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                      {selectedSizeLabel}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-medium text-foreground mb-4 text-center">
                    {t('pages.avatarViewer.allSizes')}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {AVAILABLE_SIZES.map(sizeOption => (
                      <div key={sizeOption.value} className="text-center">
                        <div
                          className="bg-muted rounded overflow-hidden mx-auto border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                          style={{
                            width: Math.min(sizeOption.value, 64),
                            height: Math.min(sizeOption.value, 64),
                            aspectRatio: '1',
                          }}
                          onClick={() => setSize(sizeOption.value)}
                        >
                          <img
                            src={avatarApi.getImageUrl(avatar.id, filter, sizeOption.value)}
                            alt={`${avatar.name} - ${sizeOption.label}`}
                            className="w-full h-full object-cover"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{sizeOption.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-medium text-foreground mb-4 text-center">
                    {t('pages.avatarViewer.allFilters')}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {AVAILABLE_FILTERS.map(filterOption => (
                      <div key={filterOption.value} className="text-center">
                        <div
                          className="bg-muted rounded overflow-hidden mx-auto border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                          style={{
                            width: 64,
                            height: 64,
                            aspectRatio: '1',
                          }}
                          onClick={() => setFilter(filterOption.value)}
                        >
                          <img
                            src={avatarApi.getImageUrl(avatar.id, filterOption.value, 64)}
                            alt={`${avatar.name} - ${filterOption.label}`}
                            className="w-full h-full object-cover"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{filterOption.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <AvatarLinkCopy
                avatarId={avatar.id}
                size={size}
                filter={filter}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
