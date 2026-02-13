// src/features/ads/ui/components/filter/filterOpenDefaults.ts

export const FILTER_DEFAULT_OPEN = {
  roomCount: false,
  buildingAge: false,
  floor: false,
  totalFloors: false,
  heating: false,
  bathroomCount: false,
  kitchenType: false,
  balcony: false,
  elevator: false,
  parking: false,
  furnished: false,
  usageStatus: false,
  inSite: false,
  creditEligible: false,
  deedStatus: false,
  fromWho: false,
  swap: false,

  // İstersen bazıları açık kalsın:
  // price: true,
  // address: true,
} as const;
