// src/features/home/highlights/types.ts
export type ListingPhoto = string | { url?: string | null } | null | undefined;

export type Listing = {
  uid: string;
  title?: string | null;
  fee?: string | number | null;

  photos?: ListingPhoto[] | null;

  address?: {
    province?: string | null;
    district?: string | null;
  } | null;

  steps?: {
    first?: string | null;
    second?: string | null;
  } | null;

  details?: {
    acre?: string | number | null | false;
  } | null;

  features?: {
    bedrooms?: string | number | null;
    bathrooms?: string | number | null;
    size?: string | number | null;
  } | null;

  thoughts?: string | null;
  isHighlight?: boolean | null;
};

export type HighlightProps = {
  data: Listing[];
};
