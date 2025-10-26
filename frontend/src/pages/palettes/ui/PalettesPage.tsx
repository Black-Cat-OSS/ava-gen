import { useEffect, useState } from 'react';

interface Palette {
  id: string;
  name: string;
  key: string;
  primaryColor: string;
  foreignColor: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  offset: number;
  pick: number;
  hasMore: boolean;
}

/**
 * Palettes management page
 * Displays all available color palettes with ability to view, edit, and delete them
 */
export const PalettesPage = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchPalettes();
  }, []);

  const fetchPalettes = async (reset = false, loadOffset?: number) => {
    try {
      const currentOffset = loadOffset !== undefined ? loadOffset : (reset ? 0 : offset);
      
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/palettes?pick=10&offset=${currentOffset}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch palettes: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (reset) {
        setPalettes(data.palettes || []);
        setOffset(0);
      } else {
        setPalettes(prev => [...prev, ...(data.palettes || [])]);
      }
      
      setPagination(data.pagination || null);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (pagination?.hasMore && !loadingMore) {
      const newOffset = offset + 10;
      setOffset(newOffset);
      await fetchPalettes(false, newOffset);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this palette?')) {
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/palettes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete palette');
      }

      fetchPalettes(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete palette');
    }
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading palettes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Color Palettes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {palettes.map(palette => (
          <div
            key={palette.id}
            className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{palette.name}</h3>
              <button
                onClick={() => handleDelete(palette.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div
                  className="h-12 rounded-md mb-2"
                  style={{ backgroundColor: palette.primaryColor }}
                />
                <p className="text-sm text-gray-600">Primary: {palette.primaryColor}</p>
              </div>
              <div className="flex-1">
                <div
                  className="h-12 rounded-md mb-2"
                  style={{ backgroundColor: palette.foreignColor }}
                />
                <p className="text-sm text-gray-600">Foreign: {palette.foreignColor}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Key: {palette.key}
            </div>
          </div>
        ))}
      </div>

      {palettes.length === 0 && (
        <div className="text-center py-12 text-gray-500">No palettes found</div>
      )}

      {pagination?.hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
