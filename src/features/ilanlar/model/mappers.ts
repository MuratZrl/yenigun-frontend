// src/features/ads/model/mappers.ts
import type { FilterState } from "@/types/advert";

/**
 * Frontend filterKey → Backend param mapping
 * ─────────────────────────────────────────────
 * roomCounts      (string[])         → roomCounts (comma-joined)
 * heatings        (string[])         → heating (comma-joined)
 * buildingAges    (string[])         → featureFilters
 * floors          (string[])         → featureFilters
 * bathroomCounts  (string[])         → featureFilters
 * kitchenTypes    (string[])         → featureFilters
 * parking         (string[])         → featureFilters
 * usageStatus     (string[])         → featureFilters
 * furnished       ("Evet"/"Hayır")   → furniture = "true"
 * balcony         (["Var"]/["Yok"])  → balcony = "true"
 * elevator        (["Var"]/["Yok"])  → elevator = "true"
 * inSite          ("Evet"/"Hayır")   → inSite = "true"
 * deedStatus      (string[])         → deed (comma-joined)
 * fromWho         (string)           → featureFilters
 * swap            ("Evet"/"Hayır")   → featureFilters
 * creditEligible  ("Evet"/"Hayır")   → featureFilters
 * categoryId      (string)           → categoryId + categoryName
 * subcategoryId   (string)           → subcategoryId + subcategoryName
 */

const ACTION_KEYWORDS = new Set([
  "Satılık",
  "Kiralık",
  "Günlük Kiralık",
  "Devren Satılık",
  "Devren Kiralık",
  "SATILIK",
  "KİRALIK",
  "GÜNLÜK KİRALIK",
  "DEVREN SATILIK",
  "DEVREN KİRALIK",
]);

const GROUPING_NODES = new Set([
  "Konut",
  "İş Yeri",
  "İşyeri",
  "Arazi",
  "Emlak",
]);

function isAction(value: string): boolean {
  return ACTION_KEYWORDS.has(value);
}

function isGroupingNode(value: string): boolean {
  return GROUPING_NODES.has(value);
}

function nonEmpty(v: any): string | undefined {
  if (!v) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}

function posNum(v: any): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function nonNegNum(v: any): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Get string[] from filter value (handles null, string, string[]) */
function asArr(v: any): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim());
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

/** Check if a "Var"/"Yok" checkbox array includes "Var" */
function hasVar(v: any): boolean {
  const arr = asArr(v);
  return arr.includes("Var");
}

/** Check if an "Evet"/"Hayır" radio is "Evet" */
function isEvet(v: any): boolean {
  if (typeof v === "string") return v.trim() === "Evet";
  if (v === true) return true;
  return false;
}

export function buildApiFilters(
  filterValues: FilterState,
  currentFeatureFilters: Record<string, any> = {},
) {
  const apiFilters: any = {};
  const f = filterValues as any;

  // ═══════════════════════════════════════════════
  // Location
  // ═══════════════════════════════════════════════
  if (f.location && f.location !== "Hepsi") {
    apiFilters.city = f.location;
    if (f.district && f.district !== "Hepsi") {
      apiFilters.district = f.district;
    }
    if (f.quarter && f.quarter !== "Hepsi") {
      apiFilters.quarter = f.quarter;
    }
  }

  // ═══════════════════════════════════════════════
  // Category / Type from "type" path
  // ═══════════════════════════════════════════════
  if (f.type && f.type !== "Hepsi") {
    const parts = f.type.split(" > ").map((s: string) => s.trim()).filter(Boolean);

    let action: string | null = null;
    let subType: string | null = null;
    let groupNode: string | null = null;
    const searchExtras: string[] = [];

    for (const part of parts) {
      if (isGroupingNode(part)) {
        groupNode = part;
        continue;
      }
      if (isAction(part)) {
        action = part;
      } else if (!subType) {
        subType = part;
      } else {
        searchExtras.push(part);
      }
    }

      // If only a grouping node was selected (e.g. "Konut", "İş Yeri"),
      // send it as category so backend filters by it
      if (subType) {
        apiFilters.category = subType;
      } else if (groupNode) {
        apiFilters.category = groupNode;
      }
      
      if (action) apiFilters.type = action;

    if (searchExtras.length > 0) {
      const existingSearch = (f.keyword || "").trim();
      const extra = searchExtras.join(" ");
      apiFilters.search = existingSearch ? `${existingSearch} ${extra}` : extra;
    }
  }

  // ═══════════════════════════════════════════════
  // Category ID / Subcategory ID (new system)
  // ═══════════════════════════════════════════════
  if (nonEmpty(f.categoryId)) {
    apiFilters.categoryId = f.categoryId;
    if (nonEmpty(f.categoryName)) apiFilters.categoryName = f.categoryName;
  }
  if (nonEmpty(f.subcategoryId)) {
    apiFilters.subcategoryId = f.subcategoryId;
    if (nonEmpty(f.subcategoryName)) apiFilters.subcategoryName = f.subcategoryName;
  }

  // ═══════════════════════════════════════════════
  // Price
  // ═══════════════════════════════════════════════
  const minP = posNum(f.minPrice);
  const maxP = posNum(f.maxPrice);
  if (minP !== undefined) apiFilters.minPrice = minP;
  if (maxP !== undefined) apiFilters.maxPrice = maxP;
  if (nonEmpty(f.currency)) apiFilters.currency = f.currency;

  // ═══════════════════════════════════════════════
  // Keyword / Search
  // ═══════════════════════════════════════════════
  if (f.keyword && f.keyword.trim() !== "" && !apiFilters.search) {
    apiFilters.search = f.keyword.trim();
  }

  // ═══════════════════════════════════════════════
  // Sort
  // ═══════════════════════════════════════════════
  apiFilters.sortBy = f.sortBy || "date";
  apiFilters.sortOrder = f.sortOrder || "desc";

  // ═══════════════════════════════════════════════
  // Room Counts → backend "roomCounts" (comma-separated)
  // filterKey: "roomCounts" (string[])
  // ═══════════════════════════════════════════════
  const rooms = asArr(f.roomCounts);
  if (rooms.length > 0) {
    apiFilters.roomCounts = rooms.join(",");
  }

  // ═══════════════════════════════════════════════
  // Heating → backend "heating" (comma-separated)
  // filterKey: "heatings" (string[])
  // ═══════════════════════════════════════════════
  const heats = asArr(f.heatings);
  if (heats.length > 0) {
    apiFilters.heating = heats.join(",");
  }

  // ═══════════════════════════════════════════════
  // Area (gross & net) — from AreaBox
  // ═══════════════════════════════════════════════
  const minGA = nonNegNum(f.minGrossArea);
  const maxGA = nonNegNum(f.maxGrossArea);
  if (minGA !== undefined) apiFilters.minGrossArea = minGA;
  if (maxGA !== undefined) apiFilters.maxGrossArea = maxGA;

  const minNA = nonNegNum(f.minNetArea);
  const maxNA = nonNegNum(f.maxNetArea);
  if (minNA !== undefined) apiFilters.minNetArea = minNA;
  if (maxNA !== undefined) apiFilters.maxNetArea = maxNA;

  // ═══════════════════════════════════════════════
  // Boolean toggles
  // ═══════════════════════════════════════════════

  // Elevator: filterKey "elevator" stores ["Var"] or ["Yok"]
  if (hasVar(f.elevator)) {
    apiFilters.elevator = "true";
  }

  // Balcony: filterKey "balcony" stores ["Var"] or ["Yok"]
  if (hasVar(f.balcony)) {
    apiFilters.balcony = "true";
  }

  // InSite: filterKey "inSite" stores "Evet" or "Hayır"
  if (isEvet(f.inSite)) {
    apiFilters.inSite = "true";
  }

  // Furnished: filterKey "furnished" stores "Evet" or "Hayır"
  if (isEvet(f.furnished)) {
    apiFilters.furniture = "true";
  }

  // ═══════════════════════════════════════════════
  // Deed Status → backend "deed" (comma-separated for regex)
  // filterKey: "deedStatus" (string[])
  // ═══════════════════════════════════════════════
  const deeds = asArr(f.deedStatus);
  if (deeds.length > 0) {
    apiFilters.deed = deeds.join(",");
  }

  // ═══════════════════════════════════════════════
  // Feature Filters (dynamic attributes from featureFilters state)
  // ═══════════════════════════════════════════════
  const featureFiltersArray = Object.entries(currentFeatureFilters)
    .filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (typeof value === "number" && value === 0) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (value.min === null && value.max === null) return false;
        if (value.min === 0 && value.max === 0) return false;
      }
      return true;
    })
    .map(([featureId, value]) => {
      let formattedValue: any = value;
      if (Array.isArray(value)) formattedValue = value.join(",");
      if (typeof value === "boolean") formattedValue = value ? "true" : "false";
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (value.min !== null && value.max !== null) formattedValue = `${value.min}-${value.max}`;
        else if (value.min !== null) formattedValue = `${value.min}`;
        else if (value.max !== null) formattedValue = `${value.max}`;
      }
      return { featureId, value: formattedValue };
    });

  // ═══════════════════════════════════════════════
  // Filters that don't have direct backend params
  // → send as featureFilters
  // ═══════════════════════════════════════════════

  // Building Age: filterKey "buildingAges" (string[])
  const ages = asArr(f.buildingAges);
  if (ages.length > 0) {
    featureFiltersArray.push({ featureId: "buildingAge", value: ages.join(",") });
  }

  // Floor: filterKey "floors" (string[])
  const flrs = asArr(f.floors);
  if (flrs.length > 0) {
    featureFiltersArray.push({ featureId: "floor", value: flrs.join(",") });
  }

  // Bathroom Count: filterKey "bathroomCounts" (string[])
  const baths = asArr(f.bathroomCounts);
  if (baths.length > 0) {
    featureFiltersArray.push({ featureId: "bathroomCount", value: baths.join(",") });
  }

  // Kitchen Type: filterKey "kitchenTypes" (string[])
  const kitchens = asArr(f.kitchenTypes);
  if (kitchens.length > 0) {
    featureFiltersArray.push({ featureId: "kitchenType", value: kitchens.join(",") });
  }

  // Parking: filterKey "parking" (string[])
  const parks = asArr(f.parking);
  if (parks.length > 0) {
    featureFiltersArray.push({ featureId: "parking", value: parks.join(",") });
  }

  // Usage Status: filterKey "usageStatus" (string[])
  const usage = asArr(f.usageStatus);
  if (usage.length > 0) {
    featureFiltersArray.push({ featureId: "usageStatus", value: usage.join(",") });
  }

  // From Who: filterKey "fromWho" (string)
  const fromWho = nonEmpty(f.fromWho);
  if (fromWho) {
    featureFiltersArray.push({ featureId: "fromWho", value: fromWho });
  }

  // Swap: filterKey "swap" ("Evet"/"Hayır")
  if (isEvet(f.swap)) {
    featureFiltersArray.push({ featureId: "swap", value: "true" });
  }

  // Credit Eligible: filterKey "creditEligible" ("Evet"/"Hayır")
  if (isEvet(f.creditEligible)) {
    featureFiltersArray.push({ featureId: "creditEligible", value: "true" });
  }

  if (featureFiltersArray.length > 0) apiFilters.featureFilters = featureFiltersArray;

  return apiFilters;
}