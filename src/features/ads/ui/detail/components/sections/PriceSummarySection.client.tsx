// src/features/ads/ui/detail/components/sections/PriceSummarySection.client.tsx
"use client";

import React, { useMemo } from "react";
import { MapPin, Flag } from "lucide-react";
import type { AdvertData, FeatureValue } from "@/types/advert";
import DesktopSpecRow from "../shared/DesktopSpecRow";

import { resolveFeatureLabel } from "@/features/ads/model/featureLabels";

type Props = {
  data: AdvertData;
  className?: string;

  complaintText?: string;
  onComplaintClick?: () => void;

  fromWhoLabel?: string;

  creditOffersText?: string;
  creditOffersHref?: string;
  onCreditOffersClick?: () => void;
};

function isTruthyString(v: any) {
  return typeof v === "string" && v.trim() !== "";
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
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
  const parts = [p, d, q].filter(Boolean);
  return parts.join(" / ");
}

type Row = {
  label: string;
  value: string;
  important?: boolean;
  valueClassName?: string;
};

export default function PriceSummarySection({
  data,
  className,

  complaintText = "İlan ile ilgili Şikayetim Var",
  onComplaintClick,
  fromWhoLabel = "Sahibinden",

  creditOffersText = "Kredi Teklifleri",
  creditOffersHref,
  onCreditOffersClick,
}: Props) {
  const locationText = useMemo(() => formatLocation(data), [data]);

  const uidText = useMemo(() => {
    const uid = (data as any)?.uid;
    if (uid === null || uid === undefined) return "";
    return String(uid).trim();
  }, [data]);

  const stepsSecond = String((data as any)?.steps?.second ?? "").trim();
  const stepsFirst = String((data as any)?.steps?.first ?? "").trim();
  const typeText = [stepsSecond, stepsFirst].filter(Boolean).join(" ").trim() || "-";

  const details: any = (data as any)?.details ?? {};
  const contract: any = (data as any)?.contract ?? {};

  const shouldShowDeed =
    stepsSecond.toLowerCase().includes("sat") || stepsSecond.includes("Satılık");

  const createdDateText = useMemo(() => {
    // İlan tarihi için contract.date daha mantıklı (backend bunu dolu getiriyor olabilir)
    const ts =
      contract?.date ??
      (data as any)?.created?.createdTimestamp ??
      (data as any)?.createdAt ??
      (data as any)?.updatedAt ??
      null;
    return formatTrDate(ts);
  }, [data, contract?.date]);

  const feeText = useMemo(() => {
    const fee = toText((data as any)?.fee);
    if (fee) return fee;

    const amount = (data as any)?.price?.amount;
    const currency = toText((data as any)?.price?.currency) || "TL";
    if (typeof amount === "number" && Number.isFinite(amount)) return `${amount.toLocaleString("tr-TR")} ${currency}`;
    return "Fiyat yok";
  }, [data]);

  const featureValues: FeatureValue[] = useMemo(() => {
    const raw = (data as any)?.featureValues;
    return Array.isArray(raw) ? (raw as FeatureValue[]) : [];
  }, [data]);

  // featureId -> value map
  const featureById = useMemo(() => {
    const m = new Map<string, any>();
    for (const fv of featureValues) {
      const id = String((fv as any)?.featureId ?? "").trim();
      if (!id) continue;
      m.set(id, (fv as any)?.value);
    }
    return m;
  }, [featureValues]);

  // name/title varsa (backend resolve ettiyse) onu kullanarak label->value map
  const featureByLabel = useMemo(() => {
    const m = new Map<string, any>();
    for (const fv of featureValues) {
      const key = toText((fv as any)?.title || (fv as any)?.name).trim();
      if (!key) continue;
      m.set(key.toLowerCase(), (fv as any)?.value);
    }
    return m;
  }, [featureValues]);

  // Burayı kendi backendindeki featureId’lere göre doldurursun.
  // Not: Aşağıdaki id’ler senin paylaştığın /advert/adverts/336 response’undan “muhtemel” eşleşmelerle eklenmiştir.
  // Eğer farklı kategorilerde değişiyorsa, backend’in feature resolve yapması en doğru çözümdür.
  const FEATURE_FALLBACK_IDS: Record<
    string,
    string[]
  > = useMemo(
    () => ({
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
    }),
    [],
  );

  const pickFeature = (ids: string[]) => {
    for (const id of ids) {
      const v = featureById.get(id);
      const t = toText(v);
      if (t) return t;
    }
    return "";
  };

  const pickByResolvedLabel = (label: string) => {
    const v = featureByLabel.get(label.toLowerCase());
    const t = toText(v);
    return t || "";
  };

  const pick = (...candidates: any[]) => {
    for (const c of candidates) {
      const t = toText(c);
      if (t) return t;
    }
    return "";
  };

  const resolveSpec = (opts: {
    detailsValue?: any;
    labelFallback?: string; // backend title/name varsa buradan bulmaya çalışır
    idsFallback?: string[]; // featureId’lerle fallback
    formatter?: (v: any) => string | null;
  }) => {
    const d = opts.formatter ? opts.formatter(opts.detailsValue) : toText(opts.detailsValue);
    if (d && d.trim()) return d;

    if (opts.labelFallback) {
      const byLabel = pickByResolvedLabel(opts.labelFallback);
      if (byLabel) return byLabel;
    }

    if (opts.idsFallback && opts.idsFallback.length) {
      const byIds = pickFeature(opts.idsFallback);
      if (byIds) return byIds;
    }

    return "";
  };

  const desktopRows: Row[] = useMemo(() => {
    const eidsNo = toText((data as any)?.eidsNo) || resolveSpec({ idsFallback: FEATURE_FALLBACK_IDS.eidsNo });
    const eidsDate = formatTrDate((data as any)?.eidsDate) || "";

    const rows: Row[] = [
      { label: "İlan No", value: uidText || "-", important: true },
      { label: "İlan Tarihi", value: createdDateText || "-" },
      { label: "Emlak Tipi", value: typeText || "-" },

      {
        label: "m² (Brüt)",
        value: resolveSpec({
          detailsValue: details?.grossArea,
          labelFallback: "m² (Brüt)",
          idsFallback: FEATURE_FALLBACK_IDS.grossArea,
        }),
      },
      {
        label: "m² (Net)",
        value: resolveSpec({
          detailsValue: details?.netArea,
          labelFallback: "m² (Net)",
          idsFallback: FEATURE_FALLBACK_IDS.netArea,
        }),
      },
      {
        label: "Oda Sayısı",
        value: resolveSpec({
          detailsValue: details?.roomCount,
          labelFallback: "Oda Sayısı",
          idsFallback: FEATURE_FALLBACK_IDS.roomCount,
        }),
      },
      {
        label: "Bina Yaşı",
        value: resolveSpec({
          detailsValue: details?.buildingAge,
          labelFallback: "Bina Yaşı",
          idsFallback: FEATURE_FALLBACK_IDS.buildingAge,
        }),
      },
      {
        label: "Bulunduğu Kat",
        value: resolveSpec({
          detailsValue: details?.floor,
          labelFallback: "Bulunduğu Kat",
          idsFallback: FEATURE_FALLBACK_IDS.floor,
        }),
      },
      {
        label: "Kat Sayısı",
        value: resolveSpec({
          detailsValue: details?.totalFloor,
          labelFallback: "Kat Sayısı",
          idsFallback: FEATURE_FALLBACK_IDS.totalFloor,
        }),
      },
      {
        label: "Isıtma",
        value: resolveSpec({
          detailsValue: details?.heating,
          labelFallback: "Isıtma",
          idsFallback: FEATURE_FALLBACK_IDS.heating,
        }),
      },
      {
        label: "Banyo Sayısı",
        value: resolveSpec({
          detailsValue: details?.bathCount,
          labelFallback: "Banyo Sayısı",
          idsFallback: FEATURE_FALLBACK_IDS.bathCount,
        }),
      },

      {
        label: "Balkon",
        value: pick(boolToVarYok(details?.balcony), pickByResolvedLabel("Balkon")),
      },
      {
        label: "Asansör",
        value: pick(boolToVarYok(details?.elevator), pickByResolvedLabel("Asansör")),
      },
      {
        label: "Eşyalı",
        value: pick(boolToEvetHayir(details?.furniture), pickByResolvedLabel("Eşyalı")),
      },
      {
        label: "Site İçerisinde",
        value: pick(boolToEvetHayir(details?.inSite), pickByResolvedLabel("Site İçerisinde")),
      },
      {
        label: "Site Adı",
        value: resolveSpec({
          detailsValue: details?.siteName,
          labelFallback: "Site Adı",
          idsFallback: FEATURE_FALLBACK_IDS.siteName,
        }),
      },
      {
        label: "Otopark",
        value: resolveSpec({
          detailsValue: details?.parking || details?.park,
          labelFallback: "Otopark",
          idsFallback: FEATURE_FALLBACK_IDS.parking,
        }),
      },

      ...(contract?.time
        ? [{ label: "Kontrat Süresi", value: toText(contract.time) }]
        : []),

      ...(eidsNo
        ? [{ label: "EIDS No", value: eidsNo }]
        : []),

      ...((data as any)?.eidsDate
        ? [{ label: "EIDS Tarihi", value: eidsDate || "-" }]
        : []),

      ...(shouldShowDeed
        ? [{ label: "Tapu Durumu", value: toText(details?.deed) }]
        : []),

      { label: "Kimden", value: fromWhoLabel, valueClassName: "text-red-600" },

      ...(details?.swap !== undefined
        ? [{ label: "Takas", value: pick(boolToEvetHayir(details?.swap), toText(details?.swap)) }]
        : []),
    ];

    // boş satırları temizle (important olanlar hariç)
    return rows.filter((r) => r.important || (r.value && r.value.trim() !== ""));
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
    featureByLabel,
    FEATURE_FALLBACK_IDS,
  ]);

  // PriceSummarySection.client.tsx içine, desktopRows useMemo'sunun ALTINA ekle:
  const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

  const detailsExtraRows: Row[] = useMemo(() => {

  const LABELS: Record<string, string> = {
    roomCount: "Oda Sayısı",
    netArea: "m² (Net)",
    grossArea: "m² (Brüt)",
    buildingAge: "Bina Yaşı",
    elevator: "Asansör",
    inSite: "Site İçerisinde",
    whichSide: "Cephe",
    acre: "Dönüm",
    zoningStatus: "İmar Durumu",
    floor: "Bulunduğu Kat",
    totalFloor: "Kat Sayısı",
    balcony: "Balkon",
    balconyCount: "Balkon Sayısı",
    furniture: "Eşyalı",
    heating: "Isıtma",
    deed: "Tapu Durumu",
    siteName: "Site Adı",
    swap: "Takas",
  };

  const already = new Set(desktopRows.map((r) => trLower(r.label)));

  const out: Row[] = [];
  const d: any = details ?? {};

  for (const key of Object.keys(d)) {
    const label = String(LABELS[key] ?? key).trim();
    if (!label) continue;

    if (already.has(trLower(label))) continue;

    const raw = d[key];

    let val = "";
    if (key === "elevator" || key === "balcony") val = boolToVarYok(raw) ?? "";
    else if (key === "inSite" || key === "furniture" || key === "swap") val = boolToEvetHayir(raw) ?? "";
    else val = toText(raw);

    if (!val || !val.trim()) continue;

    out.push({ label, value: val });
  }

    out.sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
    return out;
  }, [details, desktopRows]);

  const featureExtraRows: Row[] = useMemo(() => {
    const already = new Set(desktopRows.map((r) => trLower(r.label)));
    const out: Row[] = [];

    for (const fv of featureValues) {
      const id = String((fv as any)?.featureId ?? "").trim();
      const value = toText((fv as any)?.value);
      if (!value) continue;

      const label = resolveFeatureLabel({
        featureId: id,
        title: (fv as any)?.title,
        name: (fv as any)?.name,
      });

      if (already.has(trLower(label))) continue;
      out.push({ label, value });
    }

    out.sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
    return out;
  }, [featureValues, desktopRows, trLower]);

  const mobileChips = useMemo(() => {
    const chips: Array<{ k: string; v: string }> = [];

    const net = resolveSpec({
      detailsValue: details?.netArea,
      labelFallback: "m² (Net)",
      idsFallback: FEATURE_FALLBACK_IDS.netArea,
    });

    const room = resolveSpec({
      detailsValue: details?.roomCount,
      labelFallback: "Oda Sayısı",
      idsFallback: FEATURE_FALLBACK_IDS.roomCount,
    });

    const floor = resolveSpec({
      detailsValue: details?.floor,
      labelFallback: "Bulunduğu Kat",
      idsFallback: FEATURE_FALLBACK_IDS.floor,
    });

    const heating = resolveSpec({
      detailsValue: details?.heating,
      labelFallback: "Isıtma",
      idsFallback: FEATURE_FALLBACK_IDS.heating,
    });

    if (net) chips.push({ k: "Net m²", v: net });
    if (room) chips.push({ k: "Oda", v: room });
    if (floor) chips.push({ k: "Kat", v: floor });
    if (heating) chips.push({ k: "Isıtma", v: heating });

    return chips.slice(0, 4);
  }, [details, featureById, featureByLabel, FEATURE_FALLBACK_IDS]);

  const CreditOffersEl = (
    <a
      href={creditOffersHref || "#"}
      onClick={(e) => {
        if (!creditOffersHref) e.preventDefault();
        onCreditOffersClick?.();
      }}
      className="text-[12px] font-semibold text-blue-700 hover:underline whitespace-nowrap"
    >
      {creditOffersText}
    </a>
  );

  return (
    <section className={["w-full", className || ""].join(" ")}>
      {/* DESKTOP */}
      <div className="hidden lg:block bg-white px-4 pt-0 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[15px] font-bold text-blue-700 leading-tight">{feeText}</div>
          {CreditOffersEl}
        </div>

        <div className="mt-2 text-[12px] text-blue-700 font-semibold">
          {locationText || "Konum belirtilmemiş"}
        </div>

        <div className="mt-2 border-b border-gray-200" />

        <div className="mt-2">
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

        {detailsExtraRows.length > 0 && (
          <>
            <div className="mt-3 border-t border-gray-200" />
            <div className="mt-2 text-[12px] font-semibold text-gray-700">Diğer Bilgiler</div>
            {detailsExtraRows.map((r) => (
              <DesktopSpecRow key={`d-${r.label}`} label={r.label} value={r.value} />
            ))}
          </>
        )}

        {featureExtraRows.length > 0 && (
          <>
            <div className="mt-3 border-t border-gray-200" />
            <div className="mt-2 text-[12px] font-semibold text-gray-700">Tüm Özellikler</div>
            {featureExtraRows.map((r) => (
              <DesktopSpecRow key={`f-${r.label}`} label={r.label} value={r.value} />
            ))}
          </>
        )}

        <div className="mt-1 pt-3 flex justify-center">
          <button
            type="button"
            onClick={onComplaintClick}
            className="text-[12px] text-blue-700 hover:underline inline-flex items-center gap-2"
          >
            <Flag size={14} className="text-gray-500" />
            {complaintText}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[16px] font-bold text-blue-700 leading-tight">{feeText}</div>

            <div className="mt-1 text-[12px] text-gray-600 flex items-center gap-1">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span className="truncate">{locationText || "Konum belirtilmemiş"}</span>
            </div>

            {(uidText || createdDateText) && (
              <div className="mt-1 text-[11px] text-gray-400">
                {uidText ? `#${uidText}` : ""}
                {uidText && createdDateText ? " • " : ""}
                {createdDateText ? createdDateText : ""}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            {CreditOffersEl}
            <div className="mt-1 text-[11px] text-gray-500">Emlak Tipi</div>
            <div className="text-[12px] font-semibold text-gray-900">{typeText}</div>
          </div>
        </div>

        <div className="mt-3 border-b border-gray-200" />

        {mobileChips.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {mobileChips.map((c) => (
              <div key={c.k} className="border border-gray-200 rounded-md px-2 py-2 bg-gray-50">
                <div className="text-[10px] text-gray-500">{c.k}</div>
                <div className="text-[12px] font-semibold text-gray-900">{c.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
