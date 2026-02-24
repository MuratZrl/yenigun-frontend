// src/features/home/locations/types.ts
export type ListingPhoto = string | { url?: string | null } | null | undefined;

export type AdvertLike = {
  address?: {
    province?: string | null;
    district?: string | null;
  } | null;
  photos?: ListingPhoto[] | null;
};

export type CityConfig = {
  name: string;
  image: string;
};

export type LocationConfig = {
  title: string;
  image: string;
  href: string;
  district: string;
  provinceLabel?: string;
};

export type LocationItem = {
  title: string;
  image: string;
  href: string;
  count: number;
};
