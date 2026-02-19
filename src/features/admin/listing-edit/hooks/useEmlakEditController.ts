// src/features/admin/emlak-edit/hooks/useEmlakEditController.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import api from "@/lib/api";
import JSONDATA from "@/app/data.json";

import {
  contractTimes, currencyOptions, deedStatusOptions, defaultFormData,
  directionOptions, heatingOptions, keyOptions, listingTypes,
  propertyCategories, propertyTypes, yesNoOptions, zoningStatusOptions,
} from "@/data/propertyData";

import type { Category, FeatureValues } from "@/types/category";
import type { FormData, MediaItem, SelectionItem, StepState } from "@/types/property";
import { isLocal, isRemote } from "@/types/property";
import type Customer from "@/types/customers";

/* ── Helpers ── */

type Marker = { lat: number; lng: number };

function safeArr<T>(v: T[] | null | undefined): T[] { return Array.isArray(v) ? v : []; }
function createSelectionItem(value: string, selections: string[]): SelectionItem { return { value, selections }; }

function formatThousandsTR(rawDigits: string) {
  const s = rawDigits.replace(/\./g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function findNodeByNameLocal(nodes: any[], name: string): any | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const n of nodes) {
    if (String(n?.name ?? "").toLowerCase().trim() === lower) return n;
    const kids = Array.isArray(n?.children ?? n?.subcategories) ? (n?.children ?? n?.subcategories) : [];
    if (kids.length) {
      const found = findNodeByNameLocal(kids, name);
      if (found) return found;
    }
  }
  return null;
}

function parseFee(fee: unknown): { value: string; type: string } {
  if (typeof fee === "string") {
    const trimmed = fee.trim();
    if (!trimmed) return { value: "0", type: "TL" };
    const parts = trimmed.split(/\s+/);
    return { value: parts[0] ?? "0", type: parts[1] ?? "TL" };
  }
  if (typeof fee === "number") return { value: formatThousandsTR(String(fee)), type: "TL" };
  return { value: "0", type: "TL" };
}

function normalizeCategoriesPayload(payload: any): Category[] {
  const root = payload?.data ?? payload;
  const data = root?.data?.tree ?? root?.data ?? root?.tree ?? root;
  return Array.isArray(data) ? data : [];
}

function normalizeAdvertPayload(payload: any): any {
  return payload?.data?.data ?? payload?.data ?? payload ?? null;
}

const TURKEY_CITIES = JSONDATA.map((city: any) => ({
  province: city.name,
  districts: city.towns.map((district: any) => ({
    district: district.name,
    quarters: district.districts.reduce((acc: any, d: any) => {
      const quarterNames = (d.quarters || []).map((q: any) => q.name);
      return acc.concat(quarterNames);
    }, [] as string[]),
  })),
}));

/* ── Paged fetcher ── */

async function fetchAllPaged<T>(endpoint: string, limit = 100): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  while (true) {
    const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
    const data = res?.data?.data ?? res?.data ?? [];
    const arr: T[] = Array.isArray(data) ? data : [];
    if (!arr.length) break;
    out.push(...arr);
    if (arr.length < limit) break;
    page += 1;
  }
  return out;
}

/* ================================================================== */
/*  Hook                                                              */
/* ================================================================== */

export function useEmlakEditController() {
  const params = useParams();
  const router = useRouter();
  const advertUid = String((params as any)?.uid ?? "");

  /* ── UI state ── */
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Data ── */
  const [advertData, setAdvertData] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  /* ── Media ── */
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);

  /* ── Map / content / active ── */
  const [marker, setMarker] = useState<Marker[]>([]);
  const [content, setContent] = useState("");
  const [isActiveAd, setIsActiveAd] = useState(true);

  /* ── Features ── */
  const [featureValues, setFeatureValues] = useState<FeatureValues>({});

  /* ── Steps ── */
  const [firstStep, setFirstStep] = useState<StepState>({ selected: { isSelect: false, value: "", id: "" }, selections: propertyTypes });
  const [secondStep, setSecondStep] = useState<StepState>({ selected: { isSelect: false, value: "", id: "" }, selections: listingTypes });
  const [thirdStep, setThirdStep] = useState<StepState>({ selected: { isSelect: false, value: "", id: "" }, selections: propertyCategories });
  const [fourthStep, setFourthStep] = useState<FormData>({ ...defaultFormData, price: { value: "", type: "TL", selections: currencyOptions } });
  const [featuresStep, setFeaturesStep] = useState<StepState>({ selected: { isSelect: false, value: "", featureData: null }, selections: {} });

  const turkeyCities = useMemo(() => TURKEY_CITIES, []);

  /* ── Fourth step updaters ── */

  const updateFourthStep = useCallback((field: keyof FormData, value: any) => {
    setFourthStep((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedFourthStep = useCallback((parentField: keyof FormData, childField: string, value: any) => {
    setFourthStep((prev) => ({ ...prev, [parentField]: { ...(prev[parentField] as any), [childField]: value } }));
  }, []);

  /* ── Apply advert to state ── */

  const applyAdvertToState = useCallback((ad: any) => {
    setAdvertData(ad);

    setFirstStep((prev) => ({ ...prev, selected: { ...(prev.selected as any), isSelect: true, value: ad?.steps?.first ?? "" } }));
    setSecondStep((prev) => ({ ...prev, selected: { ...(prev.selected as any), isSelect: true, value: ad?.steps?.second ?? "" } }));
    setThirdStep((prev) => ({ ...prev, selected: { ...(prev.selected as any), isSelect: true, value: ad?.steps?.third ?? "" } }));

    const featuresObj: FeatureValues = {};
    console.log("RAW ad.featureValues from API:", JSON.stringify(ad?.featureValues, null, 2));

    if (Array.isArray(ad?.featureValues)) {
      for (const f of ad.featureValues) {
        if (f?.featureId && f?.value !== undefined) featuresObj[String(f.featureId)] = f.value;
      }
    }
    setFeatureValues(featuresObj);

    const initFS: StepState = { selected: { isSelect: false, value: "", featureData: null }, selections: {} };
    Object.entries(featuresObj).forEach(([fid, val]) => {
      (initFS.selections as any)[fid] = { featureId: fid, value: val, featureType: "text" };
    });
    setFeaturesStep(initFS);

    const { value: feeValue, type: feeType } = parseFee(ad?.fee);

    setFourthStep({
      ...defaultFormData,
      title: ad?.title ?? "",
      description: ad?.description ?? "",
      customer: String(ad?.customer?.uid ?? ad?.customer ?? ""),
      contract_no: ad?.contract?.no ?? ad?.contractNo ?? "",
      contract_date: ad?.contract?.date ?? ad?.contractDate ?? "",
      contract_time: createSelectionItem(ad?.contract?.time ?? ad?.contractTime ?? "", contractTimes),
      advisor: String(ad?.advisor?.uid ?? ad?.advisor ?? ""),
      advisor_profile: createSelectionItem(ad?.advisor?.peopleCanSeeProfile ? "Evet" : "Hayır", yesNoOptions),
      eids: { no: ad?.eidsNo ?? ad?.eids?.no ?? "", date: ad?.eidsDate ?? ad?.eids?.date ?? "", value: ad?.eidsNo ? "Evet" : "Hayır" },
      key: createSelectionItem(ad?.whoseKey ?? "Yenigün Emlak", keyOptions),
      adminNote: ad?.adminNote ?? "",
      price: { value: feeValue, type: feeType, selections: currencyOptions },
      province: ad?.address?.province ?? ad?.province ?? "",
      district: ad?.address?.district ?? ad?.district ?? "",
      quarter: ad?.address?.quarter ?? ad?.quarter ?? "",
      address: ad?.address?.full_address ?? ad?.address ?? "",
      parsel: ad?.address?.parcel ?? ad?.parcel ?? "",
      roomCount: ad?.details?.roomCount ?? ad?.roomCount ?? "",
      netArea: ad?.details?.netArea ?? ad?.netArea ?? 0,
      grossArea: ad?.details?.grossArea ?? ad?.grossArea ?? 0,
      buildingAge: ad?.details?.buildingAge ?? ad?.buildingAge ?? 0,
      elevator: createSelectionItem(ad?.details?.elevator ? "Evet" : "Hayır", yesNoOptions),
      inSite: createSelectionItem(ad?.details?.inSite ? "Evet" : "Hayır", yesNoOptions),
      whichSide: createSelectionItem(ad?.details?.whichSide ?? ad?.whichSide ?? "", directionOptions),
      acre: ad?.details?.acre ? parseInt(String(ad.details.acre)) : ad?.acre ?? 0,
      acreText: ad?.details?.acre ?? ad?.acreText ?? "",
      floor: ad?.details?.floor ?? ad?.floor ?? 0,
      totalFloor: ad?.details?.totalFloor ?? ad?.totalFloor ?? 0,
      balcony: createSelectionItem(ad?.details?.balcony ? "Evet" : "Hayır", yesNoOptions),
      balconyCount: ad?.details?.balconyCount ?? ad?.balconyCount ?? 0,
      isFurnished: createSelectionItem(ad?.details?.furniture ? "Evet" : "Hayır", yesNoOptions),
      heating: createSelectionItem(ad?.details?.heating ?? ad?.heating ?? "", heatingOptions),
      deedStatus: createSelectionItem(ad?.details?.deed ?? ad?.deedStatus ?? "", deedStatusOptions),
      zoningStatus: createSelectionItem(ad?.details?.zoningStatus ?? ad?.zoningStatus ?? "", zoningStatusOptions),
      bathroomCount: ad?.details?.bathroomCount ?? ad?.bathroomCount ?? "",
      parking: ad?.details?.parking ?? ad?.parking ?? "",
      agenda_emlak: createSelectionItem(ad?.questions?.agendaEmlak ? "Evet" : "Hayır", yesNoOptions),
      homepage_emlak: createSelectionItem(ad?.questions?.homepageEmlak ? "Evet" : "Hayır", yesNoOptions),
      new_emlak: createSelectionItem(ad?.questions?.new_emlak ? "Evet" : "Hayır", yesNoOptions),
      chance_emlak: createSelectionItem(ad?.questions?.chance_emlak ? "Evet" : "Hayır", yesNoOptions),
      special_emlak: createSelectionItem(ad?.questions?.special_emlak ? "Evet" : "Hayır", yesNoOptions),
      onweb_emlak: createSelectionItem(ad?.questions?.onweb_emlak ? "Evet" : "Hayır", yesNoOptions),
    });

    setContent(ad?.thoughts ?? "");
    setIsActiveAd(ad?.active !== false);

    const photos: string[] = safeArr<string>(ad?.photos ?? ad?.images);
    setMediaItems(photos.map((url, i) => ({ id: `remote-${i}-${url}`, kind: "remote" as const, url })));

    const mc = ad?.address?.mapCoordinates ?? ad?.mapCoordinates;
    if (mc && typeof mc === "object" && typeof mc.lat === "number" && typeof mc.lng === "number") {
      setMarker([{ lat: mc.lat, lng: mc.lng }]);
    } else {
      setMarker([]);
    }

    if (ad?.video && typeof ad.video === "string") setExistingVideoUrl(ad.video);
  }, []);

  /* ── Load customers & advisors ── */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, a] = await Promise.all([
          fetchAllPaged<Customer>("/admin/customers", 100),
          fetchAllPaged<any>("/admin/users", 100),
        ]);
        if (!cancelled) { setCustomers(c); setAdvisors(a); }
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 401) { toast.error("Oturum süresi doldu."); router.push("/admin/emlak"); return; }
        toast.error("Müşteri/Danışman verileri yüklenemedi.");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  /* ── Load advert + categories ── */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!advertUid) { toast.error("UID yok."); router.push("/admin/emlak"); return; }
      setIsLoading(true);
      try {
        const [catsRes, advertRes] = await Promise.all([
          api.get("/admin/categories/tree"),
          api.get(`/admin/adverts/${advertUid}`),
        ]);
        if (cancelled) return;
        setCategories(normalizeCategoriesPayload(catsRes));
        const advert = normalizeAdvertPayload(advertRes);
        if (!advert) { toast.error("İlan bulunamadı"); router.push("/admin/emlak"); return; }
        applyAdvertToState(advert);
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) { toast.error("İlan bulunamadı"); router.push("/admin/emlak"); return; }
        toast.error("İlan verileri yüklenemedi");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [advertUid, applyAdvertToState, router]);

  /* ── Media handlers ── */

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setMediaItems((prev) => {
      const newOnes: MediaItem[] = files.map((file, idx) => ({ id: `local-${Date.now()}-${idx}`, kind: "local" as const, file }));
      if (prev.length + newOnes.length > 35) { toast.error("En fazla 35 resim."); return prev; }
      return [...prev, ...newOnes];
    });
    event.target.value = "";
  }, []);

  const removeMediaItem = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleVideoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFile(event.target.files?.[0] ?? null);
  }, []);

  /* ── File uploads ── */

  const handleFileUpdates = useCallback(async () => {
    let ok = true;
    const keepRemoteUrls = mediaItems.filter(isRemote).map((it) => it.url);
    const localFiles = mediaItems.filter(isLocal).map((it) => it.file);

    if (localFiles.length > 0 || keepRemoteUrls.length > 0) {
      try {
        const t = toast.loading("Resimler güncelleniyor...");
        const fd = new FormData();
        fd.append("uid", String(Number(advertUid)));
        fd.append("images", JSON.stringify(keepRemoteUrls));
        localFiles.forEach((f) => fd.append("images", f));
        await api.post("/admin/update-advert-images", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.dismiss(t);
        toast.success("✅ Resimler güncellendi!");
      } catch {
        ok = false;
        toast.warning("Resimler güncellenemedi");
      }
    }

    if (videoFile instanceof File) {
      try {
        const t = toast.loading("Video güncelleniyor...");
        const fd = new FormData();
        fd.append("uid", String(Number(advertUid)));
        fd.append("video", videoFile);
        await api.post("/admin/update-advert-video", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.dismiss(t);
        toast.success("✅ Video güncellendi!");
      } catch {
        ok = false;
        toast.warning("Video yüklenemedi");
      }
    }

    return ok;
  }, [advertUid, mediaItems, videoFile]);

  /* ── Submit ── */

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!fourthStep.customer) { toast.error("Lütfen bir müşteri seçiniz."); return; }
    if (!fourthStep.title) { toast.error("Lütfen ilan başlığını giriniz."); return; }

    setIsSubmitting(true);
    try {
      const eidsTs = fourthStep.eids?.date ? new Date(fourthStep.eids.date as any).getTime() : null;
      const contractTs = fourthStep.contract_date ? new Date(fourthStep.contract_date as any).getTime() : Date.now();
      const feeValue = fourthStep.price?.value || "0";
      const feeType = fourthStep.price?.type || "TL";

      


      // Collect all fac_* section keys being submitted
const facKeys = new Set(
  Object.keys(featureValues).filter((k) => k.startsWith("fac_"))
);

// Build a set of facility section titles (normalized) that fac_* entries cover
const facTitleSet = new Set<string>();
for (const k of facKeys) {
  // fac_ic-ozellikler → "ic-ozellikler" → used as identifier
  facTitleSet.add(k);
}

// If we have the category tree, find MongoDB-ID facility entries to exclude
// (they're stale duplicates of the fac_* entries)
const staleFacilityIds = new Set<string>();
if (categories?.length) {
  const stepNames = [
    firstStep.selected?.value,
    secondStep.selected?.value,
    thirdStep.selected?.value,
  ].filter(Boolean) as string[];

  // Collect facility feature names from category chain
  const facilityNames = new Set<string>();
    for (const name of stepNames) {
      const node = findNodeByNameLocal(categories, name);
      if (!node) continue;
      const facilities = Array.isArray(node.facilities) ? node.facilities : [];
      for (const g of facilities) {
        const title = String(g?.title ?? "").trim();
        if (title) facilityNames.add(title.toLowerCase().trim());
      }
    }

    // Find MongoDB-ID entries in current featureValues whose names match facility sections
    // These are the old duplicates we want to exclude
    if (facilityNames.size > 0 && advertData?.featureValues) {
      // Use position-based matching to identify which MongoDB IDs are facility entries
      // (same logic the server uses)
      for (const fv of advertData.featureValues) {
        const fid = String(fv?.featureId ?? "").trim();
        if (!fid || fid.startsWith("fac_")) continue;
        const val = fv?.value;
        // If value is an array, it's likely a multi_select facility entry
        if (Array.isArray(val)) {
          staleFacilityIds.add(fid);
        }
      }
    }
  }

  const fvArr = Object.entries(featureValues)
    .filter(([fid, v]) => {
      if (v === undefined || v === null) return false;
      // Keep fac_* entries (even empty arrays — they represent cleared facilities)
      if (fid.startsWith("fac_")) return true;
      // Exclude stale MongoDB-ID facility duplicates
      if (staleFacilityIds.has(fid)) return false;
      // Exclude empty strings for non-facility entries
      if (v === "") return false;
      return true;
    })
    .map(([fid, v]) => ({ featureId: fid, value: v }));

      const req: any = {
        uid: Number(advertUid),
        steps: {
          first: firstStep.selected?.value || "",
          second: secondStep.selected?.value || "",
          third: thirdStep.selected?.value || "",
        },
        title: fourthStep.title || "",
        customer: Number(fourthStep.customer) || 0,
        contract: { no: fourthStep.contract_no || "", date: contractTs, time: fourthStep.contract_time?.value || "" },
        advisor: { uid: Number(fourthStep.advisor) || 0, peopleCanSeeProfile: fourthStep.advisor_profile?.value === "Evet" },
        eidsNo: fourthStep.eids?.no || "",
        eidsDate: eidsTs,
        questions: {
          agendaEmlak: fourthStep.agenda_emlak?.value === "Evet",
          homepageEmlak: fourthStep.homepage_emlak?.value === "Evet",
          new_emlak: fourthStep.new_emlak?.value === "Evet",
          chance_emlak: fourthStep.chance_emlak?.value === "Evet",
          special_emlak: fourthStep.special_emlak?.value === "Evet",
          onweb_emlak: fourthStep.onweb_emlak?.value === "Evet",
        },
        thoughts: content || "",
        adminNote: fourthStep.adminNote || "",
        whoseKey: fourthStep.key?.value || "Yenigün Emlak",
        fee: `${feeValue} ${feeType}`,
        address: {
          province: fourthStep.province || "",
          district: fourthStep.district || "",
          quarter: fourthStep.quarter || "",
          full_address: String(fourthStep.address || ""),
          mapCoordinates: marker?.[0] ? { lat: marker[0].lat || 0, lng: marker[0].lng || 0 } : { lat: 0, lng: 0 },
          parcel: fourthStep.parsel || "",
        },
        active: isActiveAd,
        details: {
          roomCount: fourthStep.roomCount || null,
          netArea: Number(fourthStep.netArea) || null,
          grossArea: Number(fourthStep.grossArea) || null,
          buildingAge: Number(fourthStep.buildingAge) || null,
          elevator: fourthStep.elevator?.value === "Evet",
          inSite: fourthStep.inSite?.value === "Evet",
          whichSide: fourthStep.whichSide?.value || "",
          acre: fourthStep.acre ? `${fourthStep.acre} m²` : null,
          zoningStatus: fourthStep.zoningStatus?.value || "",
          floor: Number(fourthStep.floor) || null,
          totalFloor: Number(fourthStep.totalFloor) || null,
          balcony: fourthStep.balcony?.value === "Evet",
          balconyCount: Number(fourthStep.balconyCount) || null,
          furniture: fourthStep.isFurnished?.value === "Evet",
          heating: fourthStep.heating?.value || "",
          deed: fourthStep.deedStatus?.value || "",
        },
        featureValues: fvArr,
      };

      await api.post("/admin/update-advert", req);
      await handleFileUpdates();
      toast.success("✅ İlan başarıyla güncellendi!");
      router.push("/admin/emlak");
    } catch (err: any) {
      const s = err?.response?.status;
      const m = err?.response?.data?.message || err?.message || "Bilinmeyen hata";
      toast.error(`Hata: ${s ?? "-"} - ${m}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [advertUid, content, featureValues, firstStep.selected?.value, fourthStep, handleFileUpdates, isActiveAd, isSubmitting, marker, router, secondStep.selected?.value, thirdStep.selected?.value]);

  /* ── Derived ── */

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("title", e.target.value),
    [updateFourthStep],
  );

  const handlePriceValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = (e.target.value || "").replace(/\./g, "");
      if (!raw) return updateNestedFourthStep("price", "value", "");
      if (isNaN(Number(raw)) || raw.length > 15) return;
      updateNestedFourthStep("price", "value", formatThousandsTR(raw));
    },
    [updateNestedFourthStep],
  );

  const handlePriceTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateNestedFourthStep("price", "type", e.target.value),
    [updateNestedFourthStep],
  );

  return {
    router,
    advertUid,

    activeTab,
    setActiveTab,
    isSubmitting,
    isLoading,

    advertData,
    customers,
    advisors,
    categories,

    mediaItems,
    setMediaItems,
    videoFile,
    setVideoFile,
    existingVideoUrl,

    marker,
    setMarker,
    content,
    setContent,
    isActiveAd,
    setIsActiveAd,

    featureValues,
    setFeatureValues,

    firstStep,
    setFirstStep,
    secondStep,
    setSecondStep,
    thirdStep,
    setThirdStep,
    fourthStep,
    setFourthStep,
    featuresStep,
    setFeaturesStep,

    updateFourthStep,
    updateNestedFourthStep,

    turkeyCities,

    handleTitleChange,
    handlePriceValueChange,
    handlePriceTypeChange,
    handleImageChange,
    removeMediaItem,
    handleVideoChange,
    handleSubmit,
  };
}