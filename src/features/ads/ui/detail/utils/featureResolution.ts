// src/features/ads/ui/detail/utils/featureResolution.ts

import { formatAnyValue, formatBooleanTR } from "./valueFormat";
import type { FeatureValue } from "@/types/advert";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type FeatureResolutionContext = {
  featureById: Map<string, any>;
  featureByLabel: Map<string, any>;
};

export type ResolveSpecOptions = {
  /** Primary value from details object */
  detailsValue?: any;
  /** Label key to look up in featureByLabel map */
  labelFallback?: string;
  /** Feature IDs to look up in featureById map (accepts readonly arrays) */
  idsFallback?: readonly string[];
  /** Custom formatter — if omitted, formatAnyValue is used */
  formatter?: (v: any) => string | null;
  /** Feature resolution context (ID + label maps) */
  context: FeatureResolutionContext;
};

/* ------------------------------------------------------------------ */
/*  Core resolver                                                      */
/* ------------------------------------------------------------------ */

/**
 * Resolves a spec value with a 3-tier fallback chain:
 *   1. details object value
 *   2. featureByLabel lookup
 *   3. featureById lookup
 */
export function resolveSpec(opts: ResolveSpecOptions): string {
  const { detailsValue, labelFallback, idsFallback, formatter, context } = opts;

  // 1 — details value
  const detailsText = formatter
    ? formatter(detailsValue)
    : formatAnyValue(detailsValue);
  if (detailsText?.trim()) return detailsText;

  // 2 — label-based lookup
  if (labelFallback) {
    const byLabel = context.featureByLabel.get(labelFallback.toLowerCase());
    const text = formatAnyValue(byLabel);
    if (text) return text;
  }

  // 3 — ID-based lookup
  if (idsFallback?.length) {
    for (const id of idsFallback) {
      const value = context.featureById.get(id);
      const text = formatAnyValue(value);
      if (text) return text;
    }
  }

  return "";
}

/* ------------------------------------------------------------------ */
/*  Boolean formatters                                                 */
/* ------------------------------------------------------------------ */

/** Boolean → "Var" / "Yok", passthrough for truthy strings */
export function formatVarYok(v: any): string | null {
  if (typeof v === "boolean") return v ? "Var" : "Yok";
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

/** Boolean → "Evet" / "Hayır", passthrough for truthy strings */
export function formatEvetHayir(v: any): string | null {
  if (typeof v === "boolean") return formatBooleanTR(v);
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

/* ------------------------------------------------------------------ */
/*  Context builder                                                    */
/* ------------------------------------------------------------------ */

/**
 * Builds the dual-map context from raw featureValues array.
 * Call once per render (inside useMemo) and pass to resolveSpec.
 */
export function buildFeatureContext(
  featureValues: FeatureValue[]
): FeatureResolutionContext {
  const featureById = new Map<string, any>();
  const featureByLabel = new Map<string, any>();

  for (const fv of featureValues) {
    const id = String((fv as any)?.featureId ?? "").trim();
    if (id) featureById.set(id, (fv as any)?.value);

    const label = formatAnyValue(
      (fv as any)?.title || (fv as any)?.name
    ).trim();
    if (label) featureByLabel.set(label.toLowerCase(), (fv as any)?.value);
  }

  return { featureById, featureByLabel };
}

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

/** Returns the first non-empty formatted value from candidates */
export function pickFirst(...candidates: any[]): string {
  for (const c of candidates) {
    const text = formatAnyValue(c);
    if (text) return text;
  }
  return "";
}