// src/features/ads/ui/detail/components/sections/panels/DetailsPanel.client.tsx
"use client";
import React, { useMemo } from "react";
import type { AdvertData, FeatureValue } from "@/types/advert";
import { Check, ChevronDown } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

import type { FacilitySection } from "@/features/ilanlar/server/loadAdvertPageData";

type Props = {
  data: AdvertData;
  className?: string;
  emptyText?: string;
  featureNameMap?: Record<string, string>;
  facilitiesSchema?: FacilitySection[];
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  return String(v).trim();
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function CollapsibleBox({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className={cls("group border border-gray-300 bg-white")}>
      <summary
        className={cls(
          "list-none [&::-webkit-details-marker]:hidden",
          "cursor-pointer select-none",
          "px-3 py-2",
          "border-b border-gray-300",
          "bg-gradient-to-b from-[#f7f7f7] to-[#e9e9e9]",
          "flex items-center justify-between",
        )}
      >
        <div className="text-[12px] font-semibold text-gray-900">{title}</div>
        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="p-3">{children}</div>
    </details>
  );
}

/**
 * Extract selected facility values from featureValues by position-matched names.
 */
function slugifyTR(input: string) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Extract selected facility values from featureValues.
 * Priority: fac_* synthetic IDs (from edit form) > old MongoDB IDs (via featureNameMap).
 */
function getSelectedFacilities(
  data: AdvertData,
  featureNameMap?: Record<string, string>,
  facilitiesSchema?: FacilitySection[],
): Map<string, Set<string>> {
  const selected = new Map<string, Set<string>>();
  if (!facilitiesSchema?.length) return selected;

  const raw = (data as any)?.featureValues;
  const featureValues: any[] = Array.isArray(raw) ? raw : [];

  // Build lookups: synthetic fac_* ID → normalized title, and normalized title set
  const syntheticToTitle = new Map<string, string>();
  const facilityTitles = new Set<string>();
  for (const s of facilitiesSchema) {
    const nTitle = normalize(s.title);
    facilityTitles.add(nTitle);
    syntheticToTitle.set(`fac_${slugifyTR(s.title)}`, nTitle);
  }

  // Track which sections were populated by fac_* entries
  const populatedByFac = new Set<string>();

  // First pass: collect fac_* entries (these are from latest edit, take priority)
  for (const fv of featureValues) {
    const featureId = String(fv?.featureId ?? "").trim();
    if (!featureId.startsWith("fac_")) continue;

    const sectionKey = syntheticToTitle.get(featureId);
    if (!sectionKey) continue;

    const items = extractItems(fv?.value);
    if (items.length) {
      const existing = selected.get(sectionKey) ?? new Set<string>();
      items.forEach((item) => existing.add(normalize(item)));
      selected.set(sectionKey, existing);
    }
    // Mark this section as having fac_* data (even if empty — means user cleared it)
    populatedByFac.add(sectionKey);
  }

  // Second pass: fallback to MongoDB-ID entries via featureNameMap
  // Only for sections NOT already populated by fac_* entries
  if (featureNameMap) {
    for (const fv of featureValues) {
      const featureId = String(fv?.featureId ?? "").trim();
      if (!featureId || featureId.startsWith("fac_")) continue;

      const mappedName = featureNameMap[featureId] ?? "";
      if (!mappedName) continue;

      const normalizedName = normalize(mappedName);
      if (!facilityTitles.has(normalizedName)) continue;

      // Skip if fac_* already handled this section
      if (populatedByFac.has(normalizedName)) continue;

      const items = extractItems(fv?.value);
      if (items.length) {
        const existing = selected.get(normalizedName) ?? new Set<string>();
        items.forEach((item) => existing.add(normalize(item)));
        selected.set(normalizedName, existing);
      }
    }
  }

  return selected;
}

function extractItems(val: any): string[] {
  let items: string[] = [];
  if (Array.isArray(val)) {
    items = val.map((x: any) => String(x).trim()).filter(Boolean);
  } else if (typeof val === "string" && val.trim()) {
    items = val.split(",").map((x: string) => x.trim()).filter(Boolean);
  }
  // Skip purely numeric values (mismatched field)
  if (items.length === 1 && /^\d+$/.test(items[0])) return [];
  return items;
}

export default function DetailsPanel({
  data,
  className,
  emptyText = "Detay bilgisi bulunamadı",
  featureNameMap,
  facilitiesSchema,
}: Props) {
  const description = useMemo(() => toText((data as any)?.thoughts), [data]);
  const hasDescription = description.trim().length > 0;

  const selectedFacilities = useMemo(
    () => getSelectedFacilities(data, featureNameMap, facilitiesSchema),
    [data, featureNameMap, facilitiesSchema],
  );

  const hasFacilities = facilitiesSchema && facilitiesSchema.length > 0;

  return (
    <div className={cls("w-full", className)}>
      {/* Açıklama */}
      <CollapsibleBox title="Açıklama" defaultOpen>
        {hasDescription ? (
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={description} />
          </div>
        ) : (
          <div className="text-[12px] text-gray-600">{emptyText}</div>
        )}
      </CollapsibleBox>

      {/* Facilities grid — ALL sections shown */}
      {hasFacilities && (
        <>
          <div className="mt-3" />
          <CollapsibleBox title="Özellikler" defaultOpen>
            <div className="space-y-5">
              {facilitiesSchema!.map((section) => {
                const sectionKey = normalize(section.title);
                const selectedSet = selectedFacilities.get(sectionKey) ?? new Set<string>();
                const hasAnySelected = selectedSet.size > 0;

                return (
                  <div key={section.title}>
                    <div className="text-[13px] font-bold text-[#005299] mb-2">
                      {section.title}
                    </div>

                    <div className="border border-[#b5d0e8] bg-[#f0f7ff] rounded-sm px-4 py-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
                        {section.options.map((opt) => {
                          const isSelected = selectedSet.has(normalize(opt));
                          return (
                            <div
                              key={opt}
                              className={cls(
                                "flex items-center gap-2 text-[12px] py-[2px]",
                                isSelected
                                  ? "text-gray-900"
                                  : hasAnySelected
                                    ? "text-gray-400"
                                    : "text-gray-400",
                              )}
                            >
                              <span className="w-[18px] h-[18px] flex-shrink-0 inline-flex items-center justify-center">
                                {isSelected ? (
                                  <Check size={15} className="text-green-600" strokeWidth={3} />
                                ) : null}
                              </span>
                              <span
                                className={cls(
                                  isSelected
                                    ? "font-bold text-gray-900"
                                    : hasAnySelected
                                      ? "font-normal text-gray-400"
                                      : "font-normal text-gray-400",
                                )}
                              >
                                {opt}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleBox>
        </>
      )}
    </div>
  );
}