// src/features/home/types/typesConfig.ts
import {
  HandCoins,
  KeyRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type PropertyTypeConfig = Record<
  string,
  { icon: LucideIcon; gradient: string }
>;

export const propertyTypeConfig: PropertyTypeConfig = {
  "Satılık": { icon: HandCoins, gradient: "from-blue-500 to-cyan-500" },
  "Kiralık": { icon: KeyRound, gradient: "from-blue-800 to-blue-500" },
};
