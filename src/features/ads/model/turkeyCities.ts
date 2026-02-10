// src/features/ads/model/turkeyCities.ts
import JSONDATA from "@/app/data.json";

export type TurkeyCities = Array<{
  province: string;
  districts: Array<{
    district: string;
    quarters: string[];
  }>;
}>;

export const turkeyCities: TurkeyCities = JSONDATA.map((city: any) => {
  return {
    province: city.name,
    districts: city.towns.map((district: any) => {
      return {
        district: district.name,
        quarters: district.districts.reduce((acc: any, d: any) => {
          const quarterNames = d.quarters.map((q: any) => q.name);
          return acc.concat(quarterNames);
        }, []),
      };
    }),
  };
});
