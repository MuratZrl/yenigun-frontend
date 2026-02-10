// src/features/admin/emlak-create/model/buildTurkeyCities.ts
import JSONDATA from "@/app/data.json";

export type TurkeyCities = Array<{
  province: string;
  districts: Array<{ district: string; quarters: string[] }>;
}>;

export function buildTurkeyCities(): TurkeyCities {
  return (JSONDATA as any[]).map((city: any) => ({
    province: city.name,
    districts: city.towns.map((town: any) => ({
      district: town.name,
      quarters: town.districts.reduce((acc: string[], d: any) => {
        const names = (d.quarters || []).map((q: any) => q.name);
        return acc.concat(names);
      }, []),
    })),
  }));
}
