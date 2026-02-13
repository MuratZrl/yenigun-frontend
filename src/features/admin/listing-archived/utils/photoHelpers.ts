// src/features/admin/emlak-archived/utils/photoHelpers.ts

/**
 * Checks whether an advert has at least one valid (non-empty string) photo.
 */
export function hasValidPhotos(photos: unknown): boolean {
  if (!Array.isArray(photos)) return false;
  return photos.some(
    (photo) => typeof photo === "string" && photo.trim() !== ""
  );
}

/**
 * Returns the first valid photo URL, or null if none found.
 */
export function getFirstValidPhoto(photos: unknown): string | null {
  if (!Array.isArray(photos)) return null;
  const found = photos.find(
    (photo) => typeof photo === "string" && photo.trim() !== ""
  );
  return typeof found === "string" ? found : null;
}