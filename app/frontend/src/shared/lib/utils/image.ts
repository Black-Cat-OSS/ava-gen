type ImageSizes = 4 | 5 | 6 | 7 | 8 | 9;
type ImageFilters = 'grayscale' | 'sepia' | 'negative' | 'lowpoly';

type Params = {
  filter?: ImageFilters;
  size?: ImageSizes;
};

export const getImageUrl = (id: string, params: Params) => {
  return (
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/${id}` +
    Object.entries(params).reduce((acc, [key, value]) => acc + `${key}=${value}&`, '?')
  );
};
