const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getImageUrl = (path: string | undefined | null): string => {
  if (!path || typeof path !== 'string') return '/placeholder-image.svg';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  let finalPath = path;

  if (!finalPath.includes('/')) {
    finalPath = `/uploads/products/${finalPath}`;
  }
  else if (!finalPath.startsWith('/')) {
    finalPath = `/${finalPath}`;
  }

  return `${API_BASE_URL}${finalPath.startsWith('/') ? '' : '/'}${finalPath}`;
};
