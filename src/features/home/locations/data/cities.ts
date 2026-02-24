// src/features/home/locations/data/cities.ts

/**
 * Fallback city images using picsum.photos (seeded so each city always gets the same image).
 * Used when a city's adverts have no photos.
 */
export function getFallbackCityImage(cityName: string): string {
  // Use city name as seed so the same city always gets the same image
  const seed = encodeURIComponent(cityName);
  return `https://picsum.photos/seed/${seed}/600/800`;
}
