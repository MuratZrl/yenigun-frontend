// src/components/tabs/EditAdDetailsTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Upload, Video, X, Camera, Move, Trash2, GripVertical, CheckCircle, ArrowUp, ArrowDown, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

import RichTextEditor from "@/components/RichTextEditor";
import AdminGoogleMap from "@/components/layout/AdminGoogleMap";

import type { FormData, MediaItem, StepState, TurkeyCity, Advisor } from "@/types/property";
import { isLocal, isRemote } from "@/types/property";
import type Customer from "@/types/customers";
import type { Category, FeatureValues } from "@/types/category";

/* ================================================================== */
/*  Types                                                             */
/* ================================================================== */

type FormDataValue = FormData[keyof FormData];

type MapMarker = { lat: number; lng: number; time?: Date };

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

interface EditAdDetailsTabProps {
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

  /* features (hardcoded) */
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

  /* dynamic features from category tree */
  featureValues: FeatureValues;
  setFeatureValues: React.Dispatch<React.SetStateAction<FeatureValues>>;
  featuresStep: StepState;
  setFeaturesStep: React.Dispatch<React.SetStateAction<StepState>>;
  categories: Category[];
  categoryId: string;
  subcategoryId: string;

  /* step names fallback (edit mode — advert has steps.first/second/third) */
  stepFirst?: string;
  stepSecond?: string;
  stepThird?: string;

  /* location */
  marker: MapMarker[];
  setMarker: (m: MapMarker[]) => void;
  turkeyCities: TurkeyCity[];

  /* media — edit uses MediaItem (remote + local) */
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onPickImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: (id: string) => void;
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  onPickVideo?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  existingVideoUrl?: string | null;

  /* other info */
  customers: Customer[];
  advisors: Advisor[];
  isActiveAd: boolean;
  setIsActiveAd: (v: boolean) => void;
  contractTimes: string[];
  yesNoOptions: string[];
  keyOptions: string[];

  /* submit */
  onSubmit: () => void;
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

function findNodeInTree(nodes: CategoryTreeNode[], id: string | number | undefined): CategoryTreeNode | null {
  if (!id && id !== 0) return null;
  const s = String(id);
  for (const n of nodes) {
    if (String(n?.uid ?? "") === s || String(n?._id ?? "") === s) return n;
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) { const f = findNodeInTree(kids, id); if (f) return f; }
  }
  return null;
}

function findNodeByName(nodes: CategoryTreeNode[], name: string): CategoryTreeNode | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const n of nodes) {
    if (String(n?.name ?? "").toLowerCase().trim() === lower) return n;
    const kids = safeArr(n?.children ?? n?.subcategories);
    if (kids.length) {
      const found = findNodeByName(kids, name);
      if (found) return found;
    }
  }
  return null;
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

function getSafeAddress(address: string | { lat?: number; lng?: number } | null | undefined): string {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object" && address.lat && address.lng) return `Konum: ${address.lat}, ${address.lng}`;
  return "";
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [spliced] = copy.splice(from, 1);
  copy.splice(to, 0, spliced);
  return copy;
}

function formatMB(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) return "";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/* ================================================================== */
/*  Hook: media preview URLs (creates/revokes object URLs)            */
/* ================================================================== */

/**
 * Builds a Map<id, previewUrl> for the given media items.
 * Remote items use their existing URL; local items get an object-URL
 * that is cached and revoked when the item is removed or the hook unmounts.
 *
 * Uses a reducer so the state update inside the effect is a dispatched
 * "external-store sync" rather than a bare setState call.
 */
function mediaPreviewReducer(
  _prev: Map<string, string>,
  next: Map<string, string>,
) {
  return next;
}

function useMediaPreviewMap(mediaItems: MediaItem[]): Map<string, string> {
  const cacheRef = useRef<Map<string, string>>(new Map());
  const [map, dispatch] = React.useReducer(mediaPreviewReducer, new Map<string, string>());

  const mediaIdsKey = mediaItems.map(m => m.id).join(",");

  useEffect(() => {
    const cache = cacheRef.current;
    const next = new Map<string, string>();
    for (const item of mediaItems) {
      if (isRemote(item)) { next.set(item.id, item.url); continue; }
      if (isLocal(item)) {
        const existing = cache.get(item.id);
        if (existing) { next.set(item.id, existing); continue; }
        const url = URL.createObjectURL(item.file);
        cache.set(item.id, url);
        next.set(item.id, url);
      }
    }
    dispatch(next);

    // Revoke URLs for removed items
    const aliveIds = new Set(mediaItems.filter(isLocal).map(x => x.id));
    for (const [id, url] of cache.entries()) {
      if (!aliveIds.has(id)) { URL.revokeObjectURL(url); cache.delete(id); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaIdsKey]);

  // Cleanup all on unmount
  useEffect(() => {
    const cache = cacheRef.current;
    return () => { for (const url of cache.values()) URL.revokeObjectURL(url); cache.clear(); };
  }, []);

  return map;
}

/* ================================================================== */
/*  Section wrapper                                                   */
/* ================================================================== */

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
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
          <button type="button" onClick={() => onHide(fieldKey)} title="Bu alanı gizle" className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
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

export default function EditAdDetailsTab(props: EditAdDetailsTabProps) {
  const {
    fourthStep, updateFourthStep, updateNestedFourthStep,
    content, setContent,
    onTitleChange, onPriceValueChange, onPriceTypeChange, onAdminNoteChange,
    currencyOptions,
    onElevatorToggle, onInSiteToggle, onBalconyToggle, onIsFurnishedToggle,
    onHeatingChange, onDeedStatusChange, onWhichSideChange, onZoningStatusChange,
    heatingOptions, deedStatusOptions, directionOptions, zoningStatusOptions,
    featureValues, setFeatureValues, featuresStep, setFeaturesStep,
    categories, categoryId, subcategoryId,
    stepFirst, stepSecond, stepThird,
    marker, setMarker, turkeyCities,
    mediaItems, setMediaItems, onPickImages, onRemoveMedia,
    videoFile, setVideoFile, onPickVideo, existingVideoUrl,
    customers, advisors, isActiveAd, setIsActiveAd,
    contractTimes, yesNoOptions, keyOptions,
    onSubmit, isSubmitting,
  } = props;

  /* ── Hidden fields ── */
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());
  const hideField = useCallback((fieldKey: string) => {
    setHiddenFields(prev => { const next = new Set(prev); next.add(fieldKey); return next; });
  }, []);
  const restoreAllFields = useCallback(() => setHiddenFields(new Set()), []);

  /* ── Dynamic features from category tree ── */
  const allFeatures = useMemo(() => {
    if (!categories?.length) return [];

    // Try ID-based lookup first (works when categories tab was used)
    const targetId = subcategoryId || categoryId;
    const nodes = categories as unknown as CategoryTreeNode[];
    if (targetId) {
      const chain = collectChainToNode(nodes, targetId);
      if (chain?.length) return buildFeaturesFromChain(chain);
      const node = findNodeInTree(nodes, targetId);
      if (node) return buildFeaturesFromChain([node]);
    }

    // Fallback: find nodes by step names (edit mode — advert has steps.first/second/third)
    const stepNames = [stepFirst, stepSecond, stepThird].filter(Boolean) as string[];
    if (!stepNames.length) return [];

    const chain: CategoryTreeNode[] = [];
    for (const name of stepNames) {
      const node = findNodeByName(nodes, name);
      if (node) chain.push(node);
    }
    if (!chain.length) return [];
    return buildFeaturesFromChain(chain);
  }, [categories, categoryId, subcategoryId, stepFirst, stepSecond, stepThird]);

  console.log("EDIT allFeatures:", {
    stepFirst,
    stepSecond, 
    stepThird,
    categoryId,
    subcategoryId,
    categoriesLength: categories?.length,
    featuresCount: allFeatures.length,
    featureNames: allFeatures.map((f) => f.name),
  });

  console.log("EDIT DEBUG:", {
    stepFirst,
    stepSecond,
    stepThird,
    categoryId,
    subcategoryId,
    categoriesLength: categories?.length,
    featuresCount: allFeatures.length,
    featureNames: allFeatures.map((f) => f.name),
  });

  useEffect(() => {
    if (!allFeatures.length) return;
    setFeatureValues((prev) => {
      const next: FeatureValues = { ...(prev ?? {}) };
      let changed = false;
      for (const f of allFeatures) {
        if (!f._id || Object.prototype.hasOwnProperty.call(next, f._id)) continue;
        const t = f.type;
        next[f._id] = t === "boolean" ? false : t === "number" ? 0 : t === "multi_select" ? [] : "";
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [allFeatures, setFeatureValues]);

  const handleFeatureChange = useCallback((id: string, value: string | number | boolean | string[], type?: string) => {
    setFeatureValues(p => ({ ...p, [id]: value }));
    setFeaturesStep((p) => ({ ...p, selections: { ...(p?.selections ?? {}), [id]: { featureId: id, value, featureType: type || "text" } } }));
  }, [setFeatureValues, setFeaturesStep]);

  /* ── Location geocode ── */
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

  /* ── Media preview cache ── */
  const previewSrc = useMediaPreviewMap(mediaItems);

  /* ── Video preview ── */
  const videoObjectUrlRef = useRef<string | null>(null);
  const [localVideoPreview, dispatchVideoPreview] = React.useReducer(
    (_prev: string | null, next: string | null) => next,
    null,
  );

  useEffect(() => {
    if (!videoFile) {
      if (videoObjectUrlRef.current) { URL.revokeObjectURL(videoObjectUrlRef.current); videoObjectUrlRef.current = null; }
      dispatchVideoPreview(null);
      return;
    }
    if (videoObjectUrlRef.current) URL.revokeObjectURL(videoObjectUrlRef.current);
    const url = URL.createObjectURL(videoFile);
    videoObjectUrlRef.current = url;
    dispatchVideoPreview(url);
    return () => { if (videoObjectUrlRef.current) { URL.revokeObjectURL(videoObjectUrlRef.current); videoObjectUrlRef.current = null; } };
  }, [videoFile]);

  const effectiveVideoSrc = localVideoPreview || existingVideoUrl || null;

  /* ── Sort modal ── */
  const [openSortModal, setOpenSortModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveClick = (item: MediaItem) => {
    if (item.kind === "remote") {
      const ok = confirm("Bu fotoğraf yayındaki ilandan silinecek. Devam edilsin mi?");
      if (!ok) return;
    }
    onRemoveMedia(item.id);
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
            <button type="button" onClick={restoreAllFields} className="text-[12px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
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
      {/*  FOTOĞRAFLAR (Edit — MediaItem with remote + local)   */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Fotoğraflar" defaultOpen={true}>
        <input type="file" multiple accept="image/*" onChange={onPickImages} ref={fileInputRef} className="hidden" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] text-gray-500">{mediaItems.length}/35 • Kapak: 1. fotoğraf</span>
          <div className="flex items-center gap-2">
            {mediaItems.length >= 2 && (
              <button type="button" onClick={() => setOpenSortModal(true)} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><ListOrdered size={14} /> Sırala</button>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><Upload size={14} /> Fotoğraf Ekle</button>
          </div>
        </div>

        {mediaItems.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
          >
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-[13px] text-blue-600 font-medium">Resim Yükle</p>
            <p className="text-[11px] text-gray-400 mt-1">PNG, JPG - Maksimum 35 resim</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {mediaItems.map((item, i) => {
              const src = previewSrc.get(item.id) || "";
              const badge = isRemote(item) ? "Mevcut" : "Yeni";
              return (
                <div key={item.id} className={`relative group aspect-square rounded-lg overflow-hidden border ${i === 0 ? "border-yellow-300" : "border-gray-200"}`}>
                  {src ? (
                    <Image src={src} alt={`photo-${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 16vw" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <button type="button" onClick={() => handleRemoveClick(item)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"><X size={12} /></button>
                  {i === 0 && <div className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">Kapak</div>}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1 py-0.5 rounded text-[10px]">#{i + 1}</div>
                  <div className="absolute bottom-1 right-1 bg-white/80 text-gray-600 px-1 py-0.5 rounded text-[9px]">{badge}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  VİDEO                                                 */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Video" defaultOpen={false}>
        <input type="file" accept="video/*" onChange={onPickVideo} ref={videoInputRef} className="hidden" />

        {effectiveVideoSrc ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-black">
              <video controls className="w-full max-h-[280px]"><source src={effectiveVideoSrc} /></video>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-gray-500">
                {videoFile ? `Yeni: ${videoFile.name} (${formatMB(videoFile.size)})` : "Mevcut video"}
              </span>
              <div className="flex gap-2">
                {onPickVideo && (
                  <button type="button" onClick={() => videoInputRef.current?.click()} className="text-[12px] text-blue-600 hover:underline">Değiştir</button>
                )}
                <button type="button" onClick={() => setVideoFile(null)} className="text-[12px] text-red-500 hover:underline">Kaldır</button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
          >
            <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-[13px] text-blue-600 font-medium">Video Yükle</p>
            <p className="text-[11px] text-gray-400 mt-1">MP4, MOV, AVI</p>
          </div>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  MÜŞTERİ & SÖZLEŞME                                   */}
      {/* ────────────────────────────────────────────────────── */}
      <Section title="Müşteri & Sözleşme" defaultOpen={true}>
        <FieldRow label="Müşteri" required>
          <Select
            options={customers.map((c: Customer) => ({
              value: c.uid?.toString() || "",
              label: `${c.name} ${c.surname} - ${c.phones?.[0]?.number || "Telefon yok"}`,
            }))}
            value={fourthStep.customer ? {
              value: fourthStep.customer,
              label: (() => { const c = customers.find((x: Customer) => x.uid?.toString() === fourthStep.customer); return c ? `${c.name} ${c.surname} - ${c.phones?.[0]?.number || ""}` : fourthStep.customer; })(),
            } : null}
            onChange={(v) => updateFourthStep("customer", v?.value ?? "")}
            placeholder="Müşteri seçin"
            isSearchable
            menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
            styles={{ ...selectStyles, menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }) }}
          />
        </FieldRow>

        <FieldRow label="Danışman" required>
          <select value={fourthStep.advisor} onChange={e => updateFourthStep("advisor", e.target.value)} className={selectCls}>
            <option value="">Danışman Seçin</option>
            {advisors.map((a, i) => <option key={`adv-${i}`} value={a.uid?.toString() || ""}>{a.name} {a.surname}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="Sözleşme No">
          <input type="text" value={fourthStep.contract_no} onChange={e => { const val = e.target.value; if (val === "" || /^[0-9\b]+$/.test(val)) updateFourthStep("contract_no", val); }} placeholder="Sözleşme numarası" className={inputCls} />
        </FieldRow>

        <FieldRow label="Sözleşme Tarihi">
          <input type="date" value={fourthStep.contract_date} onChange={e => updateFourthStep("contract_date", e.target.value)} className={inputCls} />
        </FieldRow>

        <FieldRow label="Sözleşme Süresi">
          <select value={selVal(fourthStep.contract_time)} onChange={e => updateNestedFourthStep("contract_time", "value", e.target.value)} className={selectCls}>
            <option value="">Seçiniz</option>
            {contractTimes.map((o, i) => <option key={`ct-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="EIDS">
          <select value={selVal(fourthStep.eids)} onChange={e => updateNestedFourthStep("eids", "value", e.target.value)} className={selectCls}>
            {yesNoOptions.map((o, i) => <option key={`yn-${i}`} value={o}>{o}</option>)}
          </select>
        </FieldRow>

        {fourthStep.eids?.value === "Evet" && (
          <>
            <FieldRow label="EIDS No">
              <input type="text" value={fourthStep.eids?.no || ""} onChange={e => updateNestedFourthStep("eids", "no", e.target.value)} placeholder="EIDS numarası" className={inputCls} />
            </FieldRow>
            <FieldRow label="EIDS Tarihi">
              <input type="date" value={fourthStep.eids?.date || ""} onChange={e => updateNestedFourthStep("eids", "date", e.target.value)} className={inputCls} />
            </FieldRow>
          </>
        )}
      </Section>

      {/* ────────────────────────────────────────────────────── */}
      {/*  GÜNCELLE BUTTON                                       */}
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
              Güncelleniyor...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              İlanı Güncelle
            </>
          )}
        </button>
      </div>

      {/* ── Image sort modal ── */}
      <AnimatePresence>
        {openSortModal && (
          <div className="fixed inset-0 z-[80]">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpenSortModal(false)} />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-5 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Resim Sıralama</h2>
                    <p className="text-[12px] text-gray-500">{mediaItems.length} resim • İlk resim kapak olarak kullanılacaktır</p>
                  </div>
                  <button type="button" onClick={() => setOpenSortModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {mediaItems.map((item, i) => {
                    const src = previewSrc.get(item.id) || "";
                    const badge = isRemote(item) ? "Mevcut" : "Yeni";
                    return (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${i === 0 ? "bg-yellow-50 border-yellow-200" : "border-gray-200"}`}>
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-bold text-[13px]">{i + 1}</div>
                        <div className="w-16 h-12 overflow-hidden rounded bg-gray-100 relative">
                          {src ? <Image src={src} alt="" fill className="object-cover" sizes="64px" /> : <div className="w-full h-full bg-gray-100" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {i === 0 && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded-full">Kapak</span>}
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-full">{badge}</span>
                          </div>
                          <div className="mt-1 text-[13px] font-medium text-gray-900 truncate">
                            {isRemote(item) ? "Mevcut fotoğraf" : isLocal(item) ? item.file.name : "Fotoğraf"}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {isLocal(item) ? `${formatMB(item.file.size)} • ${item.file.type.split("/")[1] || ""}` : "Yayındaki görsel"}
                          </div>
                        </div>
                        <button type="button" onClick={() => setMediaItems(prev => move(prev, i, i - 1))} disabled={i === 0} className={`p-1.5 rounded ${i === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}><ArrowUp size={16} /></button>
                        <button type="button" onClick={() => setMediaItems(prev => move(prev, i, i + 1))} disabled={i === mediaItems.length - 1} className={`p-1.5 rounded ${i === mediaItems.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}><ArrowDown size={16} /></button>
                        <button type="button" onClick={() => handleRemoveClick(item)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                      </div>
                    );
                  })}
                </div>
                <div className="p-5 border-t bg-gray-50 flex justify-end gap-2">
                  <button type="button" onClick={() => setOpenSortModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-[13px] hover:bg-gray-50">Vazgeç</button>
                  <button type="button" onClick={() => setOpenSortModal(false)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-2"><CheckCircle size={16} /> Sıralamayı Tamamla</button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}