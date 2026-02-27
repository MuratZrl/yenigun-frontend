// src/features/ads/ui/detail/components/sections/PriceSummarySection.client.tsx
"use client";

import React, { useCallback, useMemo } from "react";
import { MapPin } from "lucide-react";

import type { AdvertData, Contract, Details, FeatureValue } from "@/types/advert";
import DesktopSpecRow from "../shared/DesktopSpecRow";

type Props = {
  data: AdvertData;
  className?: string;
};

type Row = {
  label: string;
  value: string;
  important?: boolean;
  valueClassName?: string;
};

const FEATURE_FALLBACK_IDS: Record<string, string[]> = {
  grossArea: ["6968858ccd76859b79ca9451"],
  netArea: ["6968859ccd76859b79ca9475"],
  roomCount: ["696885f0cd76859b79ca949a"],
  buildingAge: ["6968868ccd76859b79ca94c0"],
  floor: ["69688813cd76859b79ca94e7"],
  totalFloor: ["6968891ccd76859b79ca950f"],
  heating: ["69688994cd76859b79ca9538"],
  bathCount: ["696889dfcd76859b79ca9562"],
  parking: ["69688a12cd76859b79ca958d"],
  siteName: ["69688c91cd76859b79ca97df"],
  eidsNo: ["69688c3fcd76859b79ca9772"],
  priceAmount: ["6968c87ccd76859b79ca9c16"],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isTruthyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

function toText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "object") return "";
  return String(v).trim();
}

function formatTrDate(input: unknown): string | null {
  if (!input) return null;
  const d =
    typeof input === "number" || typeof input === "string"
      ? new Date(input)
      : input instanceof Date
        ? input
        : null;

  if (!d || Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR");
}

function boolToVarYok(v: unknown): string | null {
  if (typeof v === "boolean") return v ? "Var" : "Yok";
  if (isTruthyString(v)) return v.trim();
  return null;
}

function boolToEvetHayir(v: unknown): string | null {
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (isTruthyString(v)) return v.trim();
  return null;
}

function formatLocation(data: AdvertData): string {
  const p = String(data.address?.province ?? "").trim();
  const d = String(data.address?.district ?? "").trim();
  const q = String(data.address?.quarter ?? "").trim();
  return [p, d, q].filter(Boolean).join(" / ");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PriceSummarySection({
  data,
  className,
}: Props) {
  const details = useMemo<Details & Record<string, unknown>>(
    () => ({ ...data.details }) as Details & Record<string, unknown>,
    [data.details],
  );
  const contract = useMemo(
    () => data.contract ?? ({} as Partial<Contract>),
    [data.contract],
  );

  const locationText = useMemo(() => formatLocation(data), [data]);

  const uidText = useMemo(() => {
    const uid = data.uid;
    if (uid === null || uid === undefined) return "";
    return String(uid).trim();
  }, [data]);

  const stepsSecond = String(data.steps?.second ?? "").trim();
  const stepsFirst = String(data.steps?.first ?? "").trim();
  const typeText =
    [stepsSecond, stepsFirst].filter(Boolean).join(" ").trim() || "-";

  const shouldShowDeed =
    stepsSecond.toLowerCase().includes("sat") ||
    stepsSecond.includes("Satılık");

  const createdDateText = useMemo(() => {
    const ts =
      data.created?.createdTimestamp ??
      null;
    return formatTrDate(ts);
  }, [data]);

  const feeText = useMemo(() => {
    const fee = toText(data.fee).trim();

    if (fee) {
      // Remove trailing currency symbols/labels to avoid duplication
      const cleaned = fee
        .replace(/\s*(TL|₺|USD|\$|EUR|€|GBP|£)\s*/gi, "")
        .trim();
      // Extract currency from the fee string
      const currencyMatch = fee.match(/(TL|₺|USD|\$|EUR|€|GBP|£)/i);
      const currency = currencyMatch ? currencyMatch[1] : "TL";
      const label = currency === "₺" ? "TL" : currency;
      return cleaned ? `${cleaned} ${label}` : fee;
    }

    return "Fiyat yok";
  }, [data]);

  const featureValues: FeatureValue[] = useMemo(() => {
    return Array.isArray(data.featureValues) ? data.featureValues : [];
  }, [data]);

  const featureById = useMemo(() => {
    const m = new Map<string, string | number>();
    for (const fv of featureValues) {
      const id = String(fv.featureId ?? "").trim();
      if (!id) continue;
      m.set(id, fv.value);
    }
    return m;
  }, [featureValues]);

  const pick = useCallback((...candidates: (string | null | undefined)[]) => {
    for (const c of candidates) {
      const t = toText(c);
      if (t) return t;
    }
    return "";
  }, []);

  const pickFeature = useCallback((ids?: string[]) => {
    if (!ids?.length) return "";
    for (const id of ids) {
      const v = featureById.get(id);
      const t = toText(v);
      if (t) return t;
    }
    return "";
  }, [featureById]);

  const resolveSpec = useCallback((opts: {
    detailsValue?: unknown;
    idsFallback?: string[];
    formatter?: (v: unknown) => string | null;
  }) => {
    const d = opts.formatter
      ? opts.formatter(opts.detailsValue)
      : toText(opts.detailsValue);
    if (d && d.trim()) return d;
    const byIds = pickFeature(opts.idsFallback);
    if (byIds) return byIds;
    return "";
  }, [pickFeature]);

  /* ---- Spec rows ---- */

  const desktopRows: Row[] = useMemo(() => {
    const eidsNo =
      toText(data.eidsNo) ||
      pickFeature(FEATURE_FALLBACK_IDS.eidsNo);
    const eidsDate = formatTrDate(data.eidsDate) || "";

    const rows: Row[] = [
      { label: "İlan No", value: uidText || "-", important: true },
      { label: "İlan Tarihi", value: createdDateText || "-" },
      { label: "Emlak Tipi", value: typeText || "-" },
      {
        label: "m² (Brüt)",
        value: resolveSpec({
          detailsValue: details?.grossArea,
          idsFallback: FEATURE_FALLBACK_IDS.grossArea,
        }),
      },
      {
        label: "m² (Net)",
        value: resolveSpec({
          detailsValue: details?.netArea,
          idsFallback: FEATURE_FALLBACK_IDS.netArea,
        }),
      },
      {
        label: "Oda Sayısı",
        value: resolveSpec({
          detailsValue: details?.roomCount,
          idsFallback: FEATURE_FALLBACK_IDS.roomCount,
        }),
      },
      {
        label: "Bina Yaşı",
        value: resolveSpec({
          detailsValue: details?.buildingAge,
          idsFallback: FEATURE_FALLBACK_IDS.buildingAge,
        }),
      },
      {
        label: "Bulunduğu Kat",
        value: resolveSpec({
          detailsValue: details?.floor,
          idsFallback: FEATURE_FALLBACK_IDS.floor,
        }),
      },
      {
        label: "Kat Sayısı",
        value: resolveSpec({
          detailsValue: details?.totalFloor,
          idsFallback: FEATURE_FALLBACK_IDS.totalFloor,
        }),
      },
      {
        label: "Isıtma",
        value: resolveSpec({
          detailsValue: details?.heating,
          idsFallback: FEATURE_FALLBACK_IDS.heating,
        }),
      },
      {
        label: "Banyo Sayısı",
        value: resolveSpec({
          detailsValue: details?.bathCount,
          idsFallback: FEATURE_FALLBACK_IDS.bathCount,
        }),
      },
      { label: "Balkon", value: pick(boolToVarYok(details?.balcony)) },
      { label: "Asansör", value: pick(boolToVarYok(details?.elevator)) },
      { label: "Eşyalı", value: pick(boolToEvetHayir(details?.furniture)) },
      {
        label: "Site İçerisinde",
        value: pick(boolToEvetHayir(details?.inSite)),
      },
      {
        label: "Site Adı",
        value: resolveSpec({
          detailsValue: details?.siteName,
          idsFallback: FEATURE_FALLBACK_IDS.siteName,
        }),
      },
      {
        label: "Otopark",
        value: resolveSpec({
          detailsValue: details?.parking || details?.park,
          idsFallback: FEATURE_FALLBACK_IDS.parking,
        }),
      },
      ...(contract?.time
        ? [{ label: "Kontrat Süresi", value: toText(contract.time) }]
        : []),
      ...(eidsNo ? [{ label: "EIDS No", value: eidsNo }] : []),
      ...(data.eidsDate
        ? [{ label: "EIDS Tarihi", value: eidsDate || "-" }]
        : []),
      ...(shouldShowDeed
        ? [{ label: "Tapu Durumu", value: toText(details?.deed) }]
        : []),
      ...(details?.swap !== undefined
        ? [
            {
              label: "Takas",
              value: pick(
                boolToEvetHayir(details?.swap),
                toText(details?.swap)
              ),
            },
          ]
        : []),
    ];

    return rows.filter(
      (r) => r.important || (r.value && r.value.trim() !== "")
    );
  }, [
    data,
    uidText,
    createdDateText,
    typeText,
    details,
    contract,
    shouldShowDeed,
    pick,
    pickFeature,
    resolveSpec,
  ]);

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <section className={["w-full", className || ""].join(" ")}>
      {/* Price + Spec rows (unified desktop + mobile) */}
      <div className="bg-white px-4 pt-1 pb-4">
        {/* Price */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-lg sm:text-xl font-semibold text-blue-700 tracking-tight leading-tight">
            {feeText}
          </span>
        </div>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={13} className="shrink-0 text-gray-400" />
          <span className="truncate">
            {locationText || "Konum belirtilmemiş"}
          </span>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gray-200" />

        {/* Spec rows */}
        <div className="space-y-0">
          {desktopRows.map((r) => (
            <DesktopSpecRow
              key={r.label}
              label={r.label}
              value={r.value}
              important={r.important}
              valueClassName={r.valueClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}