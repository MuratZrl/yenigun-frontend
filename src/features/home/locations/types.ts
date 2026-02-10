// src/features/home/locations/types.ts
export type AdvertLike = {
  address?: {
    district?: string | null;
  } | null;
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
  provinceLabel: string;
};
