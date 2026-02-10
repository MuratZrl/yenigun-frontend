export const getImageUrl = (path: string): string => {
  if (!path) return '/logo.png';
  
  if (path.startsWith('http')) return path;
  
  if (path.startsWith('/public/')) {
    return `${process.env.NEXT_PUBLIC_BACKEND_API}${path}`;
  }
  
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path.replace('/public/', '')}`;
};