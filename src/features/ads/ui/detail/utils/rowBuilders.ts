// Row building utilities for PriceSummarySection
import type { AdvertData, FeatureValue } from "@/types/advert";
import { formatDateTR, formatAnyValue } from "./valueFormat";
import {
  resolveSpec,
  formatVarYok,
  formatEvetHayir,
  pickFirst,
  type FeatureResolutionContext,
} from "./featureResolution";
import { FEATURE_FALLBACK_IDS, DETAILS_FIELD_LABELS } from "../constants/featureIds";
import type { Row, MobileChip } from "../types";
import { resolveFeatureLabel } from "@/features/ads/model/featureLabels";

export type RowBuilderContext = {
  data: AdvertData;
  uidText: string;
  createdDateText: string;
  typeText: string;
  fromWhoLabel: string;
  shouldShowDeed: boolean;
  details: any;
  contract: any;
  featureContext: FeatureResolutionContext;
};

const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

/**
 * Builds main desktop spec rows
 */
export function buildDesktopRows(ctx: RowBuilderContext): Row[] {
  const {
    data,
    uidText,
    createdDateText,
    typeText,
    fromWhoLabel,
    shouldShowDeed,
    details,
    contract,
    featureContext,
  } = ctx;

  const eidsNo =
    formatAnyValue((data as any)?.eidsNo) ||
    resolveSpec({ idsFallback: FEATURE_FALLBACK_IDS.eidsNo, context: featureContext });
  const eidsDate = formatDateTR((data as any)?.eidsDate) || "";

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
        context: featureContext,
      }),
    },
    {
      label: "m² (Net)",
      value: resolveSpec({
        detailsValue: details?.netArea,
        labelFallback: "m² (Net)",
        idsFallback: FEATURE_FALLBACK_IDS.netArea,
        context: featureContext,
      }),
    },
    {
      label: "Oda Sayısı",
      value: resolveSpec({
        detailsValue: details?.roomCount,
        labelFallback: "Oda Sayısı",
        idsFallback: FEATURE_FALLBACK_IDS.roomCount,
        context: featureContext,
      }),
    },
    {
      label: "Bina Yaşı",
      value: resolveSpec({
        detailsValue: details?.buildingAge,
        labelFallback: "Bina Yaşı",
        idsFallback: FEATURE_FALLBACK_IDS.buildingAge,
        context: featureContext,
      }),
    },
    {
      label: "Bulunduğu Kat",
      value: resolveSpec({
        detailsValue: details?.floor,
        labelFallback: "Bulunduğu Kat",
        idsFallback: FEATURE_FALLBACK_IDS.floor,
        context: featureContext,
      }),
    },
    {
      label: "Kat Sayısı",
      value: resolveSpec({
        detailsValue: details?.totalFloor,
        labelFallback: "Kat Sayısı",
        idsFallback: FEATURE_FALLBACK_IDS.totalFloor,
        context: featureContext,
      }),
    },
    {
      label: "Isıtma",
      value: resolveSpec({
        detailsValue: details?.heating,
        labelFallback: "Isıtma",
        idsFallback: FEATURE_FALLBACK_IDS.heating,
        context: featureContext,
      }),
    },
    {
      label: "Banyo Sayısı",
      value: resolveSpec({
        detailsValue: details?.bathCount,
        labelFallback: "Banyo Sayısı",
        idsFallback: FEATURE_FALLBACK_IDS.bathCount,
        context: featureContext,
      }),
    },

    {
      label: "Balkon",
      value: pickFirst(
        formatVarYok(details?.balcony),
        featureContext.featureByLabel.get("balkon")
      ),
    },
    {
      label: "Asansör",
      value: pickFirst(
        formatVarYok(details?.elevator),
        featureContext.featureByLabel.get("asansör")
      ),
    },
    {
      label: "Eşyalı",
      value: pickFirst(
        formatEvetHayir(details?.furniture),
        featureContext.featureByLabel.get("eşyalı")
      ),
    },
    {
      label: "Site İçerisinde",
      value: pickFirst(
        formatEvetHayir(details?.inSite),
        featureContext.featureByLabel.get("site içerisinde")
      ),
    },
    {
      label: "Site Adı",
      value: resolveSpec({
        detailsValue: details?.siteName,
        labelFallback: "Site Adı",
        idsFallback: FEATURE_FALLBACK_IDS.siteName,
        context: featureContext,
      }),
    },
    {
      label: "Otopark",
      value: resolveSpec({
        detailsValue: details?.parking || details?.park,
        labelFallback: "Otopark",
        idsFallback: FEATURE_FALLBACK_IDS.parking,
        context: featureContext,
      }),
    },

    ...(contract?.time
      ? [{ label: "Kontrat Süresi", value: formatAnyValue(contract.time) }]
      : []),

    ...(eidsNo ? [{ label: "EIDS No", value: eidsNo }] : []),

    ...((data as any)?.eidsDate ? [{ label: "EIDS Tarihi", value: eidsDate || "-" }] : []),

    ...(shouldShowDeed
      ? [{ label: "Tapu Durumu", value: formatAnyValue(details?.deed) }]
      : []),

    { label: "Kimden", value: fromWhoLabel, valueClassName: "text-red-600" },

    ...(details?.swap !== undefined
      ? [
          {
            label: "Takas",
            value: pickFirst(formatEvetHayir(details?.swap), formatAnyValue(details?.swap)),
          },
        ]
      : []),
  ];

  // Filter empty rows (keep important ones)
  return rows.filter((r) => r.important || (r.value && r.value.trim() !== ""));
}

/**
 * Builds extra rows from details object that aren't already in desktop rows
 */
export function buildDetailsExtraRows(details: any, existingLabels: Set<string>): Row[] {
  const out: Row[] = [];
  const d: any = details ?? {};

  for (const key of Object.keys(d)) {
    const label = String(DETAILS_FIELD_LABELS[key] ?? key).trim();
    if (!label) continue;

    if (existingLabels.has(trLower(label))) continue;

    const raw = d[key];

    let val = "";
    if (key === "elevator" || key === "balcony") val = formatVarYok(raw) ?? "";
    else if (key === "inSite" || key === "furniture" || key === "swap")
      val = formatEvetHayir(raw) ?? "";
    else val = formatAnyValue(raw);

    if (!val || !val.trim()) continue;

    out.push({ label, value: val });
  }

  out.sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
  return out;
}

/**
 * Builds extra rows from feature values that aren't already displayed
 */
export function buildFeatureExtraRows(
  featureValues: FeatureValue[],
  existingLabels: Set<string>
): Row[] {
  const out: Row[] = [];

  for (const fv of featureValues) {
    const id = String((fv as any)?.featureId ?? "").trim();
    const value = formatAnyValue((fv as any)?.value);
    if (!value) continue;

    const label = resolveFeatureLabel({
      featureId: id,
      title: (fv as any)?.title,
      name: (fv as any)?.name,
    });

    if (existingLabels.has(trLower(label))) continue;
    out.push({ label, value });
  }

  out.sort((a, b) => a.label.localeCompare(b.label, "tr-TR"));
  return out;
}

/**
 * Builds mobile chips (max 4 key specs)
 */
export function buildMobileChips(
  details: any,
  featureContext: FeatureResolutionContext
): MobileChip[] {
  const chips: MobileChip[] = [];

  const net = resolveSpec({
    detailsValue: details?.netArea,
    labelFallback: "m² (Net)",
    idsFallback: FEATURE_FALLBACK_IDS.netArea,
    context: featureContext,
  });

  const room = resolveSpec({
    detailsValue: details?.roomCount,
    labelFallback: "Oda Sayısı",
    idsFallback: FEATURE_FALLBACK_IDS.roomCount,
    context: featureContext,
  });

  const floor = resolveSpec({
    detailsValue: details?.floor,
    labelFallback: "Bulunduğu Kat",
    idsFallback: FEATURE_FALLBACK_IDS.floor,
    context: featureContext,
  });

  const heating = resolveSpec({
    detailsValue: details?.heating,
    labelFallback: "Isıtma",
    idsFallback: FEATURE_FALLBACK_IDS.heating,
    context: featureContext,
  });

  if (net) chips.push({ k: "Net m²", v: net });
  if (room) chips.push({ k: "Oda", v: room });
  if (floor) chips.push({ k: "Kat", v: floor });
  if (heating) chips.push({ k: "Isıtma", v: heating });

  return chips.slice(0, 4);
}
