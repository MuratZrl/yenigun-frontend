// src/components/tabs/AdDetailsTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Upload, Video, X, Camera, Move, Trash2, GripVertical, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Select from "react-select";

import RichTextEditor from "@/components/ui/RichTextEditor";
import AdminGoogleMap from "@/components/layout/AdminGoogleMap";

import type { FormData, ImageItem, StepState, TurkeyCity } from "@/types/property";
import type Customer from "@/types/customers";
import type { Advisor } from "@/types/advert";

/* ================================================================== */
/*  Types                                                             */
/* ================================================================== */

type FormDataValue = FormData[keyof FormData];

type MapMarker = { lat: number; lng: number; time?: Date };

type FeatureValue = string | number | boolean | string[];

/** Category tree node used by helpers (flat or nested API shapes) */
type CategoryTreeNode = {
  uid?: string;
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  parentUid?: string;
  parentId?: string;
  children?: CategoryTreeNode[];
  subcategories?: CategoryTreeNode[];
  subCategories?: CategoryTreeNode[];
  attributes?: CategoryAttribute[];
  facilities?: CategoryFacility[];
  features?: { _id: string; name: string; type?: string; options?: string[]; order?: number }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type CategoryAttribute = {
  id?: string;
  _id?: string;
  name?: string;
  type?: string;
  options?: string[];
  order?: number;
};

type CategoryFacility = {
  title?: string;
  features?: string[];
};

/** Built dynamic feature descriptor */
type DynamicFeature = {
  _id: string;
  name: string;
  type: string;
  options: string[];
  required: boolean;
  order?: number;
};

interface IlanDetaylariTabProps {
  /* basic info */
  fourthStep: FormData;
  updateFourthStep: (field: keyof FormData, value: FormDataValue) => void;
  updateNestedFourthStep: (parent: keyof FormData, child: string, value: string) => void;
  content: string;
  setContent: (c: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdminNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currencyOptions: string[];

  /* features */
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  featuresStep: StepState;
  setFeaturesStep: React.Dispatch<React.SetStateAction<StepState>>;
  onElevatorToggle: (v: string) => void;
  onInSiteToggle: (v: string) => void;
  onBalconyToggle: (v: string) => void;
  onIsFurnishedToggle: (v: string) => void;
  onHeatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeedStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWhichSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onZoningStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  heatingOptions: string[];
  deedStatusOptions: string[];
  directionOptions: string[];
  zoningStatusOptions: string[];

  /* location */
  marker: MapMarker[];
  setMarker: (m: MapMarker[]) => void;
  turkeyCities: TurkeyCity[];

  /* media */
  images: ImageItem[];
  setImages: (imgs: ImageItem[]) => void;
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  reOrderImages: boolean;
  setReOrderImages: (v: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;

  /* other info */
  customers: Customer[];
  advisors: Advisor[];
  isActiveAd: boolean;
  setIsActiveAd: (v: boolean) => void;
  contractTimes: string[];
  yesNoOptions: string[];
  keyOptions: string[];

  /* submit */
  onSubmit: (e?: React.SyntheticEvent) => void;
  isSubmitting: boolean;
}

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

function selVal(x: string | number | boolean | { value?: string } | null | undefined): string {
  if (!x && x !== 0 && x !== false) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  if (typeof x === "object" && x !== null && "value" in x) return String(x.value ?? "");
  return String(x);
}

function formatNumber(n: string | number | null | undefined) {
  if (!n && n !== 0) return "";
  const s = String(n).replace(/\./g, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function slugifyTR(input: string) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function mapType(t: string | undefined): string {
  const up = String(t || "").toUpperCase();
  if (up === "TEXT") return "text";
  if (up === "NUMBER") return "number";
  if (up === "SELECT") return "single_select";
  if (up === "MULTI_SELECT" || up === "MULTISELECT") return "multi_select";
  if (up === "BOOLEAN" || up === "BOOL") return "boolean";
  return "text";
}

function collectChainToNode(nodes: CategoryTreeNode[], targetId: string | number | undefined, chain: CategoryTreeNode[] = []): CategoryTreeNode[] | null {
  if (!targetId && targetId !== 0) return null;
  const s = String(targetId);
  for (const n of nodes) {
    if (String(n?.uid ?? "") === s || String(n?._id ?? "") === s) return [...chain, n];
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) { const r = collectChainToNode(kids, targetId, [...chain, n]); if (r) return r; }
  }
  return null;
}

function buildFeaturesFromChain(chain: CategoryTreeNode[]): DynamicFeature[] {
  const attrMap = new Map<string, CategoryAttribute>();
  for (const node of chain) for (const a of safeArr(node?.attributes)) {
    const key = String(a?.id ?? a?._id ?? ""); if (key) attrMap.set(key, a);
  }
  const facMap = new Map<string, Set<string>>();
  for (const node of chain) for (const g of safeArr(node?.facilities)) {
    const title = String(g?.title ?? ""); const feats = safeArr(g?.features);
    if (title && feats.length) { if (!facMap.has(title)) facMap.set(title, new Set()); feats.forEach(x => facMap.get(title)!.add(String(x))); }
  }
  const af = Array.from(attrMap.values()).reduce<DynamicFeature[]>((acc, a) => {
    const _id = String(a?.id ?? a?._id ?? ""); const name = String(a?.name ?? "");
    if (_id && name) acc.push({ _id, name, type: mapType(a?.type), options: safeArr(a?.options), required: false, order: typeof a?.order === "number" ? a.order : undefined });
    return acc;
  }, []);
  const ff: DynamicFeature[] = Array.from(facMap.entries()).map(([title, set]) => ({
    _id: `fac_${slugifyTR(title)}`, name: title, type: "multi_select", options: Array.from(set.values()), required: false,
  }));
  return [...af, ...ff].sort((a, b) => (a?.order ?? 9999) - (b?.order ?? 9999));
}

/**
 * Names of fields already rendered as hardcoded rows.
 * Dynamic features whose name matches any of these (case-insensitive,
 * Turkish-normalized) are excluded so they don't appear twice.
 */
const HARDCODED_FIELD_NAMES = new Set([
  "m2 (brut)", "m2 (net)", "m2 brut", "m2 net", "brut m2", "net m2",
  "oda sayisi", "bina yasi", "bulundugu kat", "kat sayisi",
  "isitma", "banyo sayisi", "balkon", "asansor", "otopark",
  "esyali", "site icinde", "site icerisinde", "tapu durumu", "cephe", "imar durumu",
]);

function normalizeName(name: string): string {
  return String(name || "")
    .toLowerCase().trim()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/²/g, "2")
    .replace(/[^a-z0-9 ()]/g, "")
    .replace(/\s+/g, " ").trim();
}

function isHardcodedField(name: string): boolean {
  return HARDCODED_FIELD_NAMES.has(normalizeName(name));
}

function getSafeAddress(address: string | { lat?: number; lng?: number } | null | undefined): string {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object" && address.lat && address.lng) return `Konum: ${address.lat}, ${address.lng}`;
  return "";
}

/* ================================================================== */
/*  Section wrapper                                                   */
/* ================================================================== */

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
        {open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

/* ================================================================== */
/*  Field row                                                         */
/* ================================================================== */

function FieldRow({ label, required, children, fieldKey, onHide }: { label: string; required?: boolean; children: React.ReactNode; fieldKey?: string; onHide?: (key: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-3 border-b border-gray-100 last:border-b-0 items-start">
      <label className="text-[13px] font-semibold text-gray-800 pt-2 flex items-center gap-1.5">
        {fieldKey && onHide && (
          <button
            type="button"
            onClick={() => onHide(fieldKey)}
            title="Bu alanı gizle"
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
        <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      </label>
      <div>{children}</div>
    </div>
  );
}

/* ================================================================== */
/*  Input styles                                                      */
/* ================================================================== */

const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white";
const selectCls = "w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer";

/* ================================================================== */
/*  Main Component                                                    */
/* ================================================================== */

export default function IlanDetaylariTab(props: IlanDetaylariTabProps) {
  const {
    fourthStep, updateFourthStep, updateNestedFourthStep,
    content, setContent,
    onTitleChange, onPriceValueChange, onPriceTypeChange, onAdminNoteChange,
    currencyOptions,
    firstStep, secondStep, thirdStep,
    featuresStep, setFeaturesStep,
    onElevatorToggle, onInSiteToggle, onBalconyToggle, onIsFurnishedToggle,
    onHeatingChange, onDeedStatusChange, onWhichSideChange, onZoningStatusChange,
    heatingOptions, deedStatusOptions, directionOptions, zoningStatusOptions,
    marker, setMarker, turkeyCities,
    images, setImages, videoFile, setVideoFile, reOrderImages, setReOrderImages,
    onImageChange, onVideoChange, onRemoveImage,
    customers, advisors, isActiveAd, setIsActiveAd,
    contractTimes, yesNoOptions, keyOptions,
    onSubmit, isSubmitting,
  } = props;

  /* ── Hidden fields (user can dismiss irrelevant rows) ── */
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());

  const hideField = useCallback((fieldKey: string) => {
    setHiddenFields(prev => { const next = new Set(prev); next.add(fieldKey); return next; });
  }, []);

  const restoreAllFields = useCallback(() => {
    setHiddenFields(new Set());
  }, []);

  /* ── Dynamic features from category tree ── */
  type FVAction =
    | { type: "merge"; payload: Record<string, FeatureValue> }
    | { type: "set"; key: string; value: FeatureValue };
  const fvReducer = useCallback(
    (state: Record<string, FeatureValue>, action: FVAction): Record<string, FeatureValue> => {
      switch (action.type) {
        case "merge": {
          const next = { ...state, ...action.payload };
          return Object.keys(action.payload).length ? next : state;
        }
        case "set":
          return { ...state, [action.key]: action.value };
        default:
          return state;
      }
    },
    [],
  );
  const [featureValues, dispatchFV] = React.useReducer(fvReducer, {} as Record<string, FeatureValue>);

  const getSelected = (step: StepState) => step?.selected;

  const categoryData = useMemo(() => {
    const first = getSelected(firstStep)?.categoryData;
    const second = getSelected(secondStep)?.subcategoryData;
    const third = getSelected(thirdStep)?.subcategoryData;
    return third || second || first || null;
  }, [firstStep, secondStep, thirdStep]);

  const allFeatures = useMemo((): DynamicFeature[] => {
    if (!categoryData) return [];
    const chain: CategoryTreeNode[] = [];
    const first = getSelected(firstStep)?.categoryData as CategoryTreeNode | null | undefined;
    const second = getSelected(secondStep)?.subcategoryData as CategoryTreeNode | null | undefined;
    const third = getSelected(thirdStep)?.subcategoryData as CategoryTreeNode | null | undefined;
    if (first) chain.push(first);
    if (second) chain.push(second);
    if (third) chain.push(third);
    if (!chain.length) return [];
    return buildFeaturesFromChain(chain).filter((f) => !isHardcodedField(f.name));
  }, [categoryData, firstStep, secondStep, thirdStep]);

  useEffect(() => {
    if (!allFeatures.length) return;
    const additions: Record<string, FeatureValue> = {};
    for (const f of allFeatures) {
      if (!f._id || f._id in featureValues) continue;
      const t = f.type;
      additions[f._id] = t === "boolean" ? false : t === "number" ? 0 : t === "multi_select" ? [] : "";
    }
    if (Object.keys(additions).length) dispatchFV({ type: "merge", payload: additions });
  }, [allFeatures, featureValues]);

  const handleFeatureChange = useCallback((id: string, value: FeatureValue, type?: string) => {
    dispatchFV({ type: "set", key: id, value });
    setFeaturesStep((p) => ({ ...p, selections: { ...(p?.selections as Record<string, unknown> ?? {}), [id]: { featureId: id, value, featureType: type || "text" } } }));
  }, [setFeaturesStep]);

  /* ── Location: district boundary ── */
  const [boundaryCoords, setBoundaryCoords] = useState<{lat:number;lng:number}[]>([]);

  useEffect(() => {
    if (!fourthStep.province || !fourthStep.district || !fourthStep.quarter) return;
    (async () => {
      try {
        const full = `${fourthStep.quarter}, ${fourthStep.district}, ${fourthStep.province}, Türkiye`;
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(full)}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`);
        const data = await res.json();
        if (data.results?.length) {
          const loc = data.results[0].geometry.location;
          setMarker([{ lat: loc.lat, lng: loc.lng, time: new Date() }]);
        }
      } catch {}
    })();
  }, [fourthStep.province, fourthStep.district, fourthStep.quarter, setMarker]);

  /* ── Media refs ── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newImages = [...images];
    const item = newImages.splice(draggedIndex, 1)[0];
    newImages.splice(index, 0, item);
    setImages(newImages);
    setDraggedIndex(null);
  };

  const moveImage = (index: number, dir: "up" | "down") => {
    if ((dir === "up" && index === 0) || (dir === "down" && index === images.length - 1)) return;
    const n = [...images];
    const ni = dir === "up" ? index - 1 : index + 1;
    [n[index], n[ni]] = [n[ni], n[index]];
    setImages(n);
  };

  /* ── Render ── */
  const formattedPrice = formatNumber(fourthStep.price.value);

  const selectStyles = {
    control: (base: Record<string, unknown>) => ({ ...base, border: "1px solid #D1D5DB", borderRadius: "0.375rem", padding: "1px", fontSize: "13px", minHeight: "38px" }),
    menu: (base: Record<string, unknown>) => ({ ...base, zIndex: 50, fontSize: "13px" }),
    menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="space-y-0">

      {/* ────────────────────────────────────────────────────── */}
      {/*  İLAN DETAYLARI                                       */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="İlan Detayları" defaultOpen={true}>
        <FieldRow label="İlan Başlığı" required>
          <input type="text" value={fourthStep.title} onChange={onTitleChange} placeholder="Örn: Deniz Manzaralı Modern Daire" className={inputCls} />
        </FieldRow>

        <FieldRow label="Açıklama" required>
          <RichTextEditor content={content} setContent={setContent} placeholder="İlan açıklamasını detaylı yazın..." />
        </FieldRow>

        <FieldRow label="Fiyat" required>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input type="text" value={formattedPrice} onChange={onPriceValueChange} placeholder="0" className={`${inputCls} pr-16`} />
              <select
                value={fourthStep.price.type}
                onChange={onPriceTypeChange}
                className="absolute right-1 top-1/2 -translate-y-1/2 border-0 bg-gray-100 rounded px-2 py-1 text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                {currencyOptions.map((o, i) => <option key={`cur-${i}`} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </FieldRow>

        {!hiddenFields.has("grossArea") && (
        <FieldRow label="m² (Brüt)" fieldKey="grossArea" onHide={hideField}>
          <input type="number" value={fourthStep.grossArea || ""} onChange={e => updateFourthStep("grossArea", Number(e.target.value))} placeholder="m² brüt alan" className={inputCls} />
        </FieldRow>
        )}

        {!hiddenFields.has("netArea") && (
        <FieldRow label="m² (Net)" fieldKey="netArea" onHide={hideField}>
          <input type="number" value={fourthStep.netArea || ""} onChange={e => updateFourthStep("netArea", Number(e.target.value))} placeholder="m² net alan" className={inputCls} />
        </FieldRow>
        )}

        {!hiddenFields.has("roomCount") && (
        <FieldRow label="Oda Sayısı" fieldKey="roomCount" onHide={hideField}>
          <select value={selVal(fourthStep.roomCount)} onChange={e => updateFourthStep("roomCount", e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            {["1+0","1+1","2+0","2+1","3+0","3+1","3+2","4+1","4+2","5+1","5+2","5+3","6+1","6+2","6+3","7+","8+","9+","10+"].map((v, i) => <option key={`room-${i}`} value={v}>{v}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("buildingAge") && (
        <FieldRow label="Bina Yaşı" fieldKey="buildingAge" onHide={hideField}>
          <select value={selVal(fourthStep.buildingAge)} onChange={e => updateFourthStep("buildingAge", Number(e.target.value))} className={selectCls}>
            <option value="">Seçiniz</option>
            {["0 (Sıfır)","1","2","3","4","5-10","11-15","16-20","21-25","26-30","31+"].map((v, i) => <option key={`age-${i}`} value={v}>{v}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("floor") && (
        <FieldRow label="Bulunduğu Kat" fieldKey="floor" onHide={hideField}>
          <select value={selVal(fourthStep.floor)} onChange={e => updateFourthStep("floor", Number(e.target.value))} className={selectCls}>
            <option value="">Seçiniz</option>
            {["Bodrum Kat","Zemin Kat","Bahçe Katı","Yüksek Giriş","Giriş Kat","Müstakil","Kot 1","Kot 2","Kot 3","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","30+","Çatı Katı","Villa Tipi"].map((v, i) => <option key={`floor-${i}`} value={v}>{v}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("totalFloors") && (
        <FieldRow label="Kat Sayısı" fieldKey="totalFloors" onHide={hideField}>
          <select value={selVal(fourthStep.totalFloor)} onChange={e => updateFourthStep("totalFloor", Number(e.target.value))} className={selectCls}>
            <option value="">Seçiniz</option>
            {Array.from({length: 40}, (_, i) => String(i + 1)).map((v, i) => <option key={`tfloor-${i}`} value={v}>{v}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("heating") && (
        <FieldRow label="Isıtma" fieldKey="heating" onHide={hideField}>
          <select value={selVal(fourthStep.heating)} onChange={onHeatingChange} className={selectCls}>
            <option value="">Seçiniz</option>
            {heatingOptions.map((o, i) => <option key={`heat-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("bathroomCount") && (
        <FieldRow label="Banyo Sayısı" fieldKey="bathroomCount" onHide={hideField}>
          <select value={selVal(fourthStep.bathroomCount)} onChange={e => updateFourthStep("bathroomCount", e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            {["Yok","1","2","3","4","5","6","7+"].map((v, i) => <option key={`bath-${i}`} value={v}>{v}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("balcony") && (
        <FieldRow label="Balkon" fieldKey="balcony" onHide={hideField}>
          <select value={selVal(fourthStep.balcony)} onChange={e => onBalconyToggle(e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            <option value="Evet">Var</option>
            <option value="Hayır">Yok</option>
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("elevator") && (
        <FieldRow label="Asansör" fieldKey="elevator" onHide={hideField}>
          <select value={selVal(fourthStep.elevator)} onChange={e => onElevatorToggle(e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            <option value="Evet">Var</option>
            <option value="Hayır">Yok</option>
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("parking") && (
        <FieldRow label="Otopark" fieldKey="parking" onHide={hideField}>
          <select value={selVal(fourthStep.parking)} onChange={e => updateFourthStep("parking", e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            <option value="Açık Otopark">Açık Otopark</option>
            <option value="Kapalı Otopark">Kapalı Otopark</option>
            <option value="Açık &amp; Kapalı Otopark">Açık &amp; Kapalı Otopark</option>
            <option value="Yok">Yok</option>
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("isFurnished") && (
        <FieldRow label="Eşyalı" fieldKey="isFurnished" onHide={hideField}>
          <select value={selVal(fourthStep.isFurnished)} onChange={e => onIsFurnishedToggle(e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("inSite") && (
        <FieldRow label="Site İçinde" fieldKey="inSite" onHide={hideField}>
          <select value={selVal(fourthStep.inSite)} onChange={e => onInSiteToggle(e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("deedStatus") && (
        <FieldRow label="Tapu Durumu" fieldKey="deedStatus" onHide={hideField}>
          <select value={selVal(fourthStep.deedStatus)} onChange={onDeedStatusChange} className={selectCls}>
            <option value="">Seçiniz</option>
            {deedStatusOptions.map((o, i) => <option key={`deed-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("whichSide") && (
        <FieldRow label="Cephe" fieldKey="whichSide" onHide={hideField}>
          <select value={selVal(fourthStep.whichSide)} onChange={onWhichSideChange} className={selectCls}>
            <option value="">Seçiniz</option>
            {directionOptions.map((o, i) => <option key={`dir-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>
        )}

        {!hiddenFields.has("zoningStatus") && (
        <FieldRow label="İmar Durumu" fieldKey="zoningStatus" onHide={hideField}>
          <select value={selVal(fourthStep.zoningStatus)} onChange={onZoningStatusChange} className={selectCls}>
            <option value="">Seçiniz</option>
            {zoningStatusOptions.map((o, i) => <option key={`zone-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>
        )}

        {/* Dynamic features from category tree */}
        {allFeatures.map((f) => !hiddenFields.has(f._id) && (
          <FieldRow key={f._id} label={f.name} fieldKey={f._id} onHide={hideField}>
            {f.type === "boolean" ? (
              <select value={featureValues[f._id] === true ? "Evet" : featureValues[f._id] === false ? "Hayır" : ""} onChange={e => handleFeatureChange(f._id, e.target.value === "Evet", "boolean")} className={selectCls}>
                <option value="">Seçiniz</option>
                <option value="Evet">Evet</option>
                <option value="Hayır">Hayır</option>
              </select>
            ) : f.type === "single_select" || f.type === "select" ? (
              <select value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, e.target.value, "single_select")} className={selectCls}>
                <option value="">Seçiniz</option>
                {(f.options ?? []).map((o: string, i: number) => <option key={`${f._id}-opt-${i}`} value={o}>{o}</option>)}
              </select>
            ) : f.type === "multi_select" ? (
              <div className="flex flex-wrap gap-3">
                {(f.options ?? []).map((o: string, i: number) => {
                  const raw = featureValues[f._id];
                  const sel: string[] = Array.isArray(raw) ? raw : [];
                  const checked = sel.includes(o);
                  return (
                    <label key={`${f._id}-ms-${i}`} className="flex items-center gap-1.5 text-[13px] text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={() => handleFeatureChange(f._id, checked ? sel.filter((x) => x !== o) : [...sel, o], "multi_select")} className="rounded border-gray-300" />
                      {o}
                    </label>
                  );
                })}
              </div>
            ) : f.type === "number" ? (
              <input type="number" value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, Number(e.target.value), "number")} className={inputCls} />
            ) : (
              <input type="text" value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, e.target.value, "text")} className={inputCls} />
            )}
          </FieldRow>
        ))}

        <FieldRow label="Admin Notu">
          <textarea value={fourthStep.adminNote} onChange={onAdminNoteChange} rows={3} placeholder="Sadece adminlerin göreceği notlar..." className={inputCls} />
          <p className="text-[11px] text-gray-400 mt-1">Bu not sadece admin panelinde görüntülenecektir.</p>
        </FieldRow>

        {hiddenFields.size > 0 && (
          <div className="py-3">
            <button
              type="button"
              onClick={restoreAllFields}
              className="text-[12px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Gizlenen alanları geri getir ({hiddenFields.size})
            </button>
          </div>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  ADRES BİLGİLERİ                                      */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Adres Bilgileri" defaultOpen={true}>
        <FieldRow label="İl" required>
          <Select
            options={turkeyCities.map((c) => ({ value: c.province, label: c.province }))}
            value={fourthStep.province ? { value: fourthStep.province, label: fourthStep.province } : null}
            onChange={(v) => updateFourthStep("province", v?.value ?? "")}
            placeholder="İl seçin"
            styles={selectStyles}
          />
        </FieldRow>

        <FieldRow label="İlçe" required>
          <Select
            options={turkeyCities.find((c) => c.province === fourthStep.province)?.districts?.map((d) => ({ value: d.district, label: d.district })) ?? []}
            value={fourthStep.district ? { value: fourthStep.district, label: fourthStep.district } : null}
            onChange={(v) => updateFourthStep("district", v?.value ?? "")}
            placeholder="İlçe seçin"
            noOptionsMessage={() => "Önce il seçin"}
            styles={selectStyles}
          />
        </FieldRow>

        <FieldRow label="Mahalle" required>
          <Select
            options={turkeyCities.find((c) => c.province === fourthStep.province)?.districts?.find((d) => d.district === fourthStep.district)?.quarters?.map((q) => ({ value: q, label: q })) ?? []}
            value={fourthStep.quarter ? { value: fourthStep.quarter, label: fourthStep.quarter } : null}
            onChange={(v) => updateFourthStep("quarter", v?.value ?? "")}
            placeholder="Mahalle seçin"
            noOptionsMessage={() => "Önce ilçe seçin"}
            styles={selectStyles}
          />
        </FieldRow>

        <FieldRow label="Adres">
          <input type="text" value={getSafeAddress(fourthStep.address)} onChange={e => updateFourthStep("address", e.target.value)} placeholder="Tam adres" className={inputCls} />
        </FieldRow>

        <FieldRow label="Parsel No">
          <input type="text" value={fourthStep.parsel || ""} onChange={e => updateFourthStep("parsel", e.target.value)} placeholder="Parsel numarası" className={inputCls} />
        </FieldRow>

        <div className="border border-gray-200 rounded-lg h-80 bg-gray-50 mt-2 overflow-hidden">
          <AdminGoogleMap markers={marker} setMarkers={setMarker} boundaryCoords={boundaryCoords} />
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  FOTOĞRAFLAR                                           */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Fotoğraflar" defaultOpen={true}>
        <input type="file" multiple accept="image/*" onChange={onImageChange} ref={fileInputRef} className="hidden" />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        >
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-[13px] text-blue-600 font-medium">Resim Yükle</p>
          <p className="text-[11px] text-gray-400 mt-1">PNG, JPG - Maksimum 35 resim</p>
        </div>

        {images.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-gray-700">Yüklenen Resimler ({images.length})</span>
              <button type="button" onClick={() => setReOrderImages(true)} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><Move size={14} /> Sırala</button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {images.map((img, i) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(img.src)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => onRemoveImage(img.id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"><X size={12} /></button>
                  {i === 0 && <div className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">Kapak</div>}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1 py-0.5 rounded text-[10px]">#{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  VİDEO                                                 */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Video" defaultOpen={false}>
        <input type="file" accept="video/*" onChange={onVideoChange} ref={videoInputRef} className="hidden" />

        <div
          onClick={() => videoInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        >
          <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-[13px] text-blue-600 font-medium">Video Yükle</p>
          <p className="text-[11px] text-gray-400 mt-1">MP4, MOV, AVI - Maksimum 100MB</p>
        </div>

        {videoFile && (
          <div className="mt-3 p-3 border border-green-200 rounded-lg bg-green-50 flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <Video className="text-green-600" size={16} />
              <span className="font-medium text-green-800">{videoFile.name}</span>
            </div>
            <button type="button" onClick={() => setVideoFile(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
          </div>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  MÜŞTERİ & SÖZLEŞME                                   */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Müşteri & Sözleşme" defaultOpen={true}>
        <FieldRow label="Müşteri" required>
          <Select
            options={[
              { value: "", label: "Müşteri Seçin" },
              ...customers.map((c: Customer) => ({
                value: c.uid,
                label: `${c.name} ${c.surname} - ${c.phones?.[0]?.number || "Telefon yok"}`,
              })),
            ]}
            value={fourthStep.customer ? {
              value: fourthStep.customer,
              label: (() => { const c = customers.find((x: Customer) => x.uid === fourthStep.customer); return c ? `${c.name} ${c.surname}` : ""; })(),
            } : null}
            onChange={(v) => updateFourthStep("customer", v?.value ?? "")}
            placeholder="Müşteri seçin"
            menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
            styles={{ ...selectStyles, menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }) }}
          />
        </FieldRow>

        <FieldRow label="Danışman" required>
          <select value={fourthStep.advisor} onChange={e => updateFourthStep("advisor", e.target.value)} className={selectCls}>
            <option value="">Danışman Seçin</option>
            {advisors.map((a, i) => <option key={`adv-${i}`} value={a.uid?.toString() ?? ""}>{a.name} {a.surname}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="Sözleşme No">
          <input type="text" value={fourthStep.contract_no} onChange={e => updateFourthStep("contract_no", e.target.value)} placeholder="Sözleşme numarası" className={inputCls} />
        </FieldRow>

        <FieldRow label="Sözleşme Tarihi">
          <input type="date" value={fourthStep.contract_date} onChange={e => updateFourthStep("contract_date", e.target.value)} className={inputCls} />
        </FieldRow>

        <FieldRow label="Sözleşme Süresi">
          <select value={fourthStep.contract_time.value} onChange={e => updateNestedFourthStep("contract_time", "value", e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            {contractTimes.map((o, i) => <option key={`ct-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="EIDS">
          <select value={fourthStep.eids.value} onChange={e => updateNestedFourthStep("eids", "value", e.target.value)} className={selectCls}>
            {yesNoOptions.map((o, i) => <option key={`yn-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>

        {fourthStep.eids.value === "Evet" && (
          <>
            <FieldRow label="EIDS No">
              <input type="text" value={fourthStep.eids.no} onChange={e => updateNestedFourthStep("eids", "no", e.target.value)} placeholder="EIDS numarası" className={inputCls} />
            </FieldRow>
            <FieldRow label="EIDS Tarihi">
              <input type="date" value={fourthStep.eids.date} onChange={e => updateNestedFourthStep("eids", "date", e.target.value)} className={inputCls} />
            </FieldRow>
          </>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  DEVAM BUTTON                                          */}
      {/* ────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-green-600 text-white text-[14px] font-semibold rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Yayınlanıyor...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              İlanı Yayınla
            </>
          )}
        </button>
      </div>

      {/* ── Image reorder modal ── */}
      {reOrderImages && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setReOrderImages(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Resim Sıralama</h2>
                  <p className="text-[12px] text-gray-500">{images.length} resim</p>
                </div>
                <button type="button" onClick={() => setReOrderImages(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 ${i === 0 ? "bg-yellow-50 border-yellow-200" : "border-gray-200"} ${draggedIndex === i ? "border-blue-500 bg-blue-50" : ""}`}
                    draggable
                    onDragStart={() => setDraggedIndex(i)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(i)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-bold text-[13px]">{i + 1}</div>
                    <div className="w-16 h-12 overflow-hidden rounded bg-gray-100">
                      <img src={URL.createObjectURL(img.src)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-[13px]">
                      <p className="font-medium text-gray-900 truncate">{img.src.name}</p>
                      <p className="text-gray-400">{(img.src.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    {i === 0 && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded-full">Kapak</span>}
                    <button type="button" onClick={() => moveImage(i, "up")} disabled={i === 0} className={`p-1 rounded ${i === 0 ? "opacity-30" : "hover:bg-gray-100"}`}>↑</button>
                    <button type="button" onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className={`p-1 rounded ${i === images.length - 1 ? "opacity-30" : "hover:bg-gray-100"}`}>↓</button>
                    <button type="button" onClick={() => onRemoveImage(img.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    <div className="p-1 text-gray-400 cursor-grab"><GripVertical size={16} /></div>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t bg-gray-50 flex justify-end">
                <button type="button" onClick={() => setReOrderImages(false)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-2"><CheckCircle size={16} /> Sıralamayı Tamamla</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
