// src/features/home/types/utils/buildPropertyTypes.ts
import { Home } from "lucide-react";
import type { AdvertLike } from "../../types/types";
import type { PropertyTypeItem } from "../model";
import { propertyTypeConfig } from "../typesConfig";

export function buildPropertyTypes(data: AdvertLike[]): PropertyTypeItem[] {
  const safe = Array.isArray(data) ? data : [];
  const typeCounts: Record<string, number> = {};

  for (const item of safe) {
    const t = item?.steps?.third;
    if (!t) continue;
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      title: type,
      count,
      icon: propertyTypeConfig[type]?.icon || Home,
      gradient: propertyTypeConfig[type]?.gradient || "from-gray-500 to-blue-500",
      type,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
