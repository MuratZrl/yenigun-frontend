export const getImageUrl = (path: string): string => {
  if (!path) return '/logo.png';
  
  // Eğer path zaten tam URL ise direkt döndür
  if (path.startsWith('http')) return path;
  
  // Eğer path /public/ ile başlıyorsa, base URL'yi ekle
  if (path.startsWith('/public/')) {
    return `${process.env.NEXT_PUBLIC_BACKEND_API}${path}`;
  }
  
  // Eğer sadece dosya adı ise, image URL'sini kullan
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path.replace('/public/', '')}`;
};