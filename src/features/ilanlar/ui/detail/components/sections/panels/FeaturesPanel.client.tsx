// src/features/ads/ui/detail/components/sections/panels/FeaturesPanel.client.tsx
"use client";

import React, { useMemo } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { AdvertData, Feature, FeatureValue } from "@/types/advert";

type Props = {
  data: AdvertData;
  className?: string;

  title?: string; // default: "Özellikler"
  // Sadece bu başlıkları göstermek istiyorsun
  allowedSections?: string[];

  // Eğer elinde feature tanımları (name + options) varsa buradan geç
  // Örn: subcategory.features veya category.features
  featuresSchema?: Feature[];
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  return String(v).trim();
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function valueToSelectedSet(v: any): Set<string> {
  if (Array.isArray(v)) return new Set(v.map((x) => normalize(toText(x))).filter(Boolean));
  const t = normalize(toText(v));
  return t ? new Set([t]) : new Set();
}

const DEFAULT_SECTIONS = [
  "Cephe",
  "Dış Özellikler",
  "Muhit",
  "Ulaşım",
  "Manzara",
  "Konut Tipi",
];

export default function FeaturesPanel({
  data,
  className,
  title = "Özellikler",
  allowedSections = DEFAULT_SECTIONS,
  featuresSchema,
}: Props) {
  const featureValues: FeatureValue[] = useMemo(() => {
    const raw = (data as any)?.featureValues;
    return Array.isArray(raw) ? (raw as FeatureValue[]) : [];
  }, [data]);

  const valueByFeatureId = useMemo(() => {
    const m = new Map<string, any>();
    for (const fv of featureValues) {
      const id = String((fv as any)?.featureId ?? "").trim();
      if (!id) continue;
      m.set(id, (fv as any)?.value);
    }
    return m;
  }, [featureValues]);

  // Schema yoksa: sadece seçili değerleri göster (options listesini bilmiyorsun çünkü)
  const fallbackSelectedBySection = useMemo(() => {
    const m = new Map<string, string[]>();

    // Basit fallback: featureValue içinde title/name varsa onu section gibi kullan
    for (const fv of featureValues) {
      const possibleName = toText((fv as any)?.title || (fv as any)?.name);
      const sectionName = possibleName || "";
      if (!sectionName) continue;
      const val = (fv as any)?.value;
      const arr = Array.isArray(val) ? val.map(toText).filter(Boolean) : [toText(val)].filter(Boolean);
      if (!arr.length) continue;

      const key = sectionName;
      m.set(key, [...(m.get(key) || []), ...arr]);
    }

    return m;
  }, [featureValues]);

  const schemaByName = useMemo(() => {
    const list = Array.isArray(featuresSchema) ? featuresSchema : [];
    const m = new Map<string, Feature>();
    for (const f of list) m.set(normalize(f.name), f);
    return m;
  }, [featuresSchema]);

  return (
    <div className={cls("bg-white", className)}>
      {/* ÖZELLİKLER HEADER */}
      <div className="px-3 py-2 border-t border-gray-300 border-b border-gray-300 bg-white flex items-center justify-between">
        <div className="font-semibold text-[12px] text-gray-900">{title}</div>
        <span className="text-gray-400 text-[12px] select-none"> </span>
      </div>

      {/* SECTIONS */}
      <div>
        {allowedSections.map((sectionName) => {
          const schema = schemaByName.get(normalize(sectionName));

          // Schema varsa: options listesini çiz ve selected’ları işaretle
          if (schema && Array.isArray(schema.options) && schema.options.length) {
            const rawVal = valueByFeatureId.get(schema._id);
            const selected = valueToSelectedSet(rawVal);

            return (
              <details key={sectionName} open className="group border-b border-gray-200">
                <summary className="list-none cursor-pointer select-none px-3 py-2 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-[12px] text-blue-700">{sectionName}</span>
                  <ChevronDown size={16} className="text-gray-500 transition-transform group-open:rotate-180" />
                </summary>

                <div className="px-3 py-3">
                  <div className="border border-gray-200 bg-[#fff9e8] p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2 text-[12px]">
                      {schema.options.map((opt) => {
                        const label = toText(opt);
                        const isOn = selected.has(normalize(label));
                        return (
                          <div
                            key={label}
                            className={cls(
                              "flex items-center gap-2",
                              isOn ? "opacity-100 text-gray-900" : "opacity-40 text-gray-500",
                            )}
                          >
                            <span className="w-4 h-4 inline-flex items-center justify-center">
                              {isOn ? <Check size={14} className="text-emerald-600" /> : null}
                            </span>
                            <span className={cls(isOn ? "font-semibold" : "")}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </details>
            );
          }

          // Schema yoksa: bu section için seçili değerleri göster (en azından boş kalmasın)
          const fallback = fallbackSelectedBySection.get(sectionName) || [];

          if (!fallback.length) {
            return (
              <details key={sectionName} open className="group border-b border-gray-200">
                <summary className="list-none cursor-pointer select-none px-3 py-2 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-[12px] text-blue-700">{sectionName}</span>
                  <ChevronDown size={16} className="text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3 py-3">
                  <div className="text-[12px] text-gray-500">Bu bölüm için özellik bilgisi bulunamadı.</div>
                </div>
              </details>
            );
          }

          return (
            <details key={sectionName} open className="group border-b border-gray-200">
              <summary className="list-none cursor-pointer select-none px-3 py-2 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-between">
                <span className="font-semibold text-[12px] text-blue-700">{sectionName}</span>
                <ChevronDown size={16} className="text-gray-500 transition-transform group-open:rotate-180" />
              </summary>

              <div className="px-3 py-3">
                <div className="border border-gray-200 bg-[#fff9e8] p-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2 text-[12px]">
                    {fallback.map((t) => (
                      <div key={t} className="flex items-center gap-2 opacity-100 text-gray-900">
                        <span className="w-4 h-4 inline-flex items-center justify-center">
                          <Check size={14} className="text-emerald-600" />
                        </span>
                        <span className="font-semibold">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
