// src/features/ads/ui/detail/components/sections/PriceSummarySection.client.tsx
"use client";

import React, { useMemo } from "react";
import { MapPin } from "lucide-react";

import type { AdvertData, FeatureValue } from "@/types/advert";
import DesktopSpecRow from "../shared/DesktopSpecRow";

type Props = {
  data: AdvertData;
  className?: string;
  fromWhoLabel?: string;
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

function isTruthyString(v: any) {
  return typeof v === "string" && v.trim() !== "";
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "object") return "";
  return String(v).trim();
}

function formatTrDate(input: any): string | null {
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

function boolToVarYok(v: any): string | null {
  if (typeof v === "boolean") return v ? "Var" : "Yok";
  if (isTruthyString(v)) return v.trim();
  return null;
}

function boolToEvetHayir(v: any): string | null {
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (isTruthyString(v)) return v.trim();
  return null;
}

function formatLocation(data: AdvertData): string {
  const p = String((data as any)?.address?.province ?? "").trim();
  const d = String((data as any)?.address?.district ?? "").trim();
  const q = String((data as any)?.address?.quarter ?? "").trim();
  return [p, d, q].filter(Boolean).join(" / ");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PriceSummarySection({
  data,
  className,
  fromWhoLabel = "Sahibinden",
}: Props) {
  const details: any = (data as any)?.details ?? {};
  const contract: any = (data as any)?.contract ?? {};

  const locationText = useMemo(() => formatLocation(data), [data]);

  const uidText = useMemo(() => {
    const uid = (data as any)?.uid;
    if (uid === null || uid === undefined) return "";
    return String(uid).trim();
  }, [data]);

  const stepsSecond = String((data as any)?.steps?.second ?? "").trim();
  const stepsFirst = String((data as any)?.steps?.first ?? "").trim();
  const typeText =
    [stepsSecond, stepsFirst].filter(Boolean).join(" ").trim() || "-";

  const shouldShowDeed =
    stepsSecond.toLowerCase().includes("sat") ||
    stepsSecond.includes("Satılık");

  const createdDateText = useMemo(() => {
    const ts =
      contract?.date ??
      (data as any)?.created?.createdTimestamp ??
      (data as any)?.createdAt ??
      (data as any)?.updatedAt ??
      null;
    return formatTrDate(ts);
  }, [data, contract?.date]);

  const feeText = useMemo(() => {
    const fee = toText((data as any)?.fee).trim();

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

    const amount = (data as any)?.price?.amount;
    const currency = toText((data as any)?.price?.currency) || "TL";
    const currencyLabel = currency === "₺" ? "TL" : currency;
    if (typeof amount === "number" && Number.isFinite(amount)) {
      return `${amount.toLocaleString("tr-TR")} ${currencyLabel}`;
    }
    return "Fiyat yok";
  }, [data]);

  const featureValues: FeatureValue[] = useMemo(() => {
    const raw = (data as any)?.featureValues;
    return Array.isArray(raw) ? (raw as FeatureValue[]) : [];
  }, [data]);

  const featureById = useMemo(() => {
    const m = new Map<string, any>();
    for (const fv of featureValues) {
      const id = String((fv as any)?.featureId ?? "").trim();
      if (!id) continue;
      m.set(id, (fv as any)?.value);
    }
    return m;
  }, [featureValues]);

  const pick = (...candidates: any[]) => {
    for (const c of candidates) {
      const t = toText(c);
      if (t) return t;
    }
    return "";
  };

  const pickFeature = (ids?: string[]) => {
    if (!ids?.length) return "";
    for (const id of ids) {
      const v = featureById.get(id);
      const t = toText(v);
      if (t) return t;
    }
    return "";
  };

  const resolveSpec = (opts: {
    detailsValue?: any;
    idsFallback?: string[];
    formatter?: (v: any) => string | null;
  }) => {
    const d = opts.formatter
      ? opts.formatter(opts.detailsValue)
      : toText(opts.detailsValue);
    if (d && d.trim()) return d;
    const byIds = pickFeature(opts.idsFallback);
    if (byIds) return byIds;
    return "";
  };

  /* ---- Spec rows ---- */

  const desktopRows: Row[] = useMemo(() => {
    const eidsNo =
      toText((data as any)?.eidsNo) ||
      pickFeature(FEATURE_FALLBACK_IDS.eidsNo);
    const eidsDate = formatTrDate((data as any)?.eidsDate) || "";

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
      ...((data as any)?.eidsDate
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
    contract?.time,
    shouldShowDeed,
    fromWhoLabel,
    featureById,
  ]);

  /* ---- Mobile chips ---- */

  const mobileChips = useMemo(() => {
    const chips: Array<{ k: string; v: string }> = [];

    const net = resolveSpec({
      detailsValue: details?.netArea,
      idsFallback: FEATURE_FALLBACK_IDS.netArea,
    });
    const room = resolveSpec({
      detailsValue: details?.roomCount,
      idsFallback: FEATURE_FALLBACK_IDS.roomCount,
    });
    const floor = resolveSpec({
      detailsValue: details?.floor,
      idsFallback: FEATURE_FALLBACK_IDS.floor,
    });
    const heating = resolveSpec({
      detailsValue: details?.heating,
      idsFallback: FEATURE_FALLBACK_IDS.heating,
    });

    if (net) chips.push({ k: "Net m²", v: net });
    if (room) chips.push({ k: "Oda", v: room });
    if (floor) chips.push({ k: "Kat", v: floor });
    if (heating) chips.push({ k: "Isıtma", v: heating });

    return chips.slice(0, 4);
  }, [details, featureById]);

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <section className={["w-full", className || ""].join(" ")}>
      {/* ============================================================ */}
      {/*  DESKTOP                                                     */}
      {/* ============================================================ */}
      <div className="hidden lg:block bg-white px-4 pt-1 pb-4">
        {/* Price + credit link */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xl font-semibold text-blue-700 tracking-tight leading-tight">
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

      {/* ============================================================ */}
      {/*  MOBILE                                                      */}
      {/* ============================================================ */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: price + location + meta */}
          <div className="min-w-0">
            <span className="text-lg font-semibold text-blue-700 leading-tight tracking-tight">
              {feeText}
            </span>

            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={13} className="shrink-0 text-gray-400" />
              <span className="truncate">
                {locationText || "Konum belirtilmemiş"}
              </span>
            </div>

            {(uidText || createdDateText) && (
              <div className="mt-1 text-[11px] text-gray-400">
                {uidText ? `#${uidText}` : ""}
                {uidText && createdDateText ? " · " : ""}
                {createdDateText ?? ""}
              </div>
            )}
          </div>

          {/* Right: credit + type */}
          <div className="shrink-0 text-right space-y-1">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
              Emlak Tipi
            </div>
            <div className="text-xs font-bold text-gray-800">{typeText}</div>
          </div>
        </div>

        {/* Chips */}
        {mobileChips.length > 0 && (
          <>
            <div className="my-3 h-px bg-gray-100" />
            <div className="grid grid-cols-2 gap-2">
              {mobileChips.map((c) => (
                <div
                  key={c.k}
                  className="rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2"
                >
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                    {c.k}
                  </div>
                  <div className="text-sm font-bold text-gray-800 mt-0.5">
                    {c.v}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}