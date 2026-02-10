// src/features/home/types/typesConfig.ts
import {
  Home,
  Building,
  LandPlot,
  Building2,
  Calendar,
  Store,
  Castle,
  House,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type PropertyTypeConfig = Record<
  string,
  { icon: LucideIcon; gradient: string }
>;

export const propertyTypeConfig: PropertyTypeConfig = {
  Daire: { icon: Home, gradient: "from-blue-500 to-cyan-500" },
  Villa: { icon: Castle, gradient: "from-indigo-500 to-purple-500" },
  "Müstakil Ev": { icon: House, gradient: "from-green-500 to-teal-500" },
  Residence: { icon: Building2, gradient: "from-orange-500 to-red-500" },
  Ofis: { icon: Calendar, gradient: "from-purple-500 to-pink-500" },
  "Dükkan - Mağaza": { icon: Store, gradient: "from-cyan-500 to-blue-500" },
  Arsa: { icon: LandPlot, gradient: "from-yellow-500 to-orange-500" },
  Apartman: { icon: Building, gradient: "from-gray-500 to-blue-500" },
};
