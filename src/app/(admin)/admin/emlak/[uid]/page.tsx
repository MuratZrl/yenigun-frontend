// src/app/(admin)/admin/emlak/[uid]/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  Edit,
  MapPin,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminLayout from "@/components/layout/AdminLayout";
import BasicInfoTab from "@/components/tabs/BasicInfoTab";
import MediaTab from "@/components/tabs/EditMediaTab";
import LocationTab from "@/components/tabs/LocationTab";
import DetailsTab from "@/components/tabs/DetailsTab";
import EditOtherInfoTab from "@/components/tabs/EditOtherInfoTab";
import EditFeaturesTab from "@/components/tabs/EditFeaturesTab";

import api from "@/lib/api";
import JSONDATA from "@/app/data.json";

import {
  contractTimes,
  currencyOptions,
  deedStatusOptions,
  defaultFormData,
  directionOptions,
  heatingOptions,
  keyOptions,
  listingTypes,
  propertyCategories,
  propertyTypes,
  yesNoOptions,
  zoningStatusOptions,
} from "@/data/propertyData";

import type { Category, FeatureValues } from "@/types/category";
import type { FormData, MediaItem, SelectionItem, StepState } from "@/types/property";
import { isLocal, isRemote } from "@/types/property";
import type Customer from "@/types/customers";

type TabDef = {
  id: number;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

type Marker = { lat: number; lng: number };

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

const TABS_BASE: TabDef[] = [
  { id: 1, label: "Temel Bilgiler", icon: Settings },
  { id: 2, label: "Medya", icon: Camera },
  { id: 3, label: "Konum", icon: MapPin },
  { id: 4, label: "Detaylar", icon: Users },
  { id: 5, label: "Özellikler", icon: Star },
  { id: 6, label: "Diğer", icon: Users },
];

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function createSelectionItem(value: string, selections: string[]): SelectionItem {
  return { value, selections };
}

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function formatThousandsTR(rawDigits: string) {
  const s = rawDigits.replace(/\./g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseFee(fee: unknown): { value: string; type: string } {
  if (typeof fee === "string") {
    const trimmed = fee.trim();
    if (!trimmed) return { value: "0", type: "TL" };
    const parts = trimmed.split(/\s+/);
    const v = parts[0] ?? "0";
    const t = parts[1] ?? "TL";
    return { value: v, type: t };
  }
  if (typeof fee === "number") return { value: formatThousandsTR(String(fee)), type: "TL" };
  return { value: "0", type: "TL" };
}

function normalizeCategoriesPayload(payload: any): Category[] {
  const data = payload?.data?.data ?? payload?.data ?? payload;
  return Array.isArray(data) ? data : [];
}

function normalizeAdvertPayload(payload: any): any {
  return payload?.data?.data ?? payload?.data ?? payload ?? null;
}

export default function EditAdvertPage() {
  const params = useParams();
  const router = useRouter();
  const advertUid = String((params as any)?.uid ?? "");

  const tabContainerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [advertData, setAdvertData] = useState<any>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [marker, setMarker] = useState<Marker[]>([]);
  const [content, setContent] = useState("");
  const [isActiveAd, setIsActiveAd] = useState(true);

  const [featureValues, setFeatureValues] = useState<FeatureValues>({});

  const [firstStep, setFirstStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "" },
    selections: propertyTypes,
  });

  const [secondStep, setSecondStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "" },
    selections: listingTypes,
  });

  const [thirdStep, setThirdStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "" },
    selections: propertyCategories,
  });

  const [fourthStep, setFourthStep] = useState<FormData>({
    ...defaultFormData,
    price: { value: "", type: "TL", selections: currencyOptions },
  });

  const [featuresStep, setFeaturesStep] = useState<StepState>({
    selected: { isSelect: false, value: "", featureData: null },
    selections: {},
  });

  const tabs: TabDef[] = useMemo(() => {
    if (!advertData) return TABS_BASE;

    if (advertData.isFeatures) {
      return TABS_BASE.filter((t) => t.label !== "Detaylar");
    }
    return TABS_BASE.filter((t) => t.label !== "Özellikler");
  }, [advertData]);

  const activeIndex = useMemo(() => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    return idx >= 0 ? idx : 0;
  }, [tabs, activeTab]);

  const progressPct = useMemo(() => {
    if (!tabs.length) return 0;
    return ((activeIndex + 1) / tabs.length) * 100;
  }, [tabs.length, activeIndex]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id ?? 1);
    }
  }, [tabs, activeTab]);

  const updateFourthStep = useCallback((field: keyof FormData, value: any) => {
    setFourthStep((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedFourthStep = useCallback(
    (parentField: keyof FormData, childField: string, value: any) => {
      setFourthStep((prev) => ({
        ...prev,
        [parentField]: {
          ...(prev[parentField] as any),
          [childField]: value,
        },
      }));
    },
    []
  );

  const setSelectionValue = useCallback((field: keyof FormData, value: string) => {
    setFourthStep((prev) => {
      const cur = prev[field] as any;
      if (!cur || typeof cur !== "object") return prev;
      return { ...prev, [field]: { ...cur, value } };
    });
  }, []);

  const setYesNoSelection = useCallback((field: keyof FormData, value: string) => {
    const v = value === "Evet" ? "Evet" : "Hayır";
    setFourthStep((prev) => ({ ...prev, [field]: createSelectionItem(v, yesNoOptions) as any }));
  }, []);

  const applyAdvertToState = useCallback(
    (ad: any) => {
      setAdvertData(ad);

      const s1 = ad?.steps?.first ?? "";
      const s2 = ad?.steps?.second ?? "";
      const s3 = ad?.steps?.third ?? "";

      setFirstStep((prev) => ({
        ...prev,
        selected: { ...(prev.selected as any), isSelect: true, value: s1 },
        selections: propertyTypes,
      }));

      setSecondStep((prev) => ({
        ...prev,
        selected: { ...(prev.selected as any), isSelect: true, value: s2 },
        selections: listingTypes,
      }));

      setThirdStep((prev) => ({
        ...prev,
        selected: { ...(prev.selected as any), isSelect: true, value: s3 },
        selections: propertyCategories,
      }));

      const featuresObj: FeatureValues = {};
      if (Array.isArray(ad?.featureValues)) {
        for (const f of ad.featureValues) {
          if (f?.featureId && f?.value !== undefined) featuresObj[String(f.featureId)] = f.value;
        }
      }
      setFeatureValues(featuresObj);

      const initFeatureState: StepState = {
        selected: { isSelect: false, value: "", featureData: null },
        selections: {},
      };
      Object.entries(featuresObj).forEach(([featureId, value]) => {
        (initFeatureState.selections as any)[featureId] = {
          featureId,
          value,
          featureType: "text",
        };
      });
      setFeaturesStep(initFeatureState);

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
        eids: {
          no: ad?.eidsNo ?? ad?.eids?.no ?? "",
          date: ad?.eidsDate ?? ad?.eids?.date ?? "",
          value: ad?.eidsNo ? "Evet" : "Hayır",
        },
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
      setMediaItems(
        photos.map((url, i) => ({
          id: `remote-${i}-${url}`,
          kind: "remote",
          url,
        }))
      );

      const mc = ad?.address?.mapCoordinates ?? ad?.mapCoordinates;
      if (mc && typeof mc === "object" && typeof mc.lat === "number" && typeof mc.lng === "number") {
        setMarker([{ lat: mc.lat, lng: mc.lng }]);
      } else {
        setMarker([]);
      }

      if (ad?.video && typeof ad.video === "string") {
        // Video yönetimi EditMediaTab içinde ise ayrıca state tutmaya gerek yok,
        // ama videoFile kullanıcı seçince buraya geliyor.
      }
    },
    []
  );

  const fetchAllPaged = useCallback(async <T,>(endpoint: string, limit = 100): Promise<T[]> => {
    const out: T[] = [];
    let page = 1;

    // Backend bazı endpointlerde {data:{data:[]}} bazı yerlerde direkt [] döndürebiliyor.
    // Bu yüzden normalize edeceğiz.
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [allCustomers, allAdvisors] = await Promise.all([
          fetchAllPaged<Customer>("/admin/customers", 100),
          fetchAllPaged<any>("/admin/users", 100),
        ]);
        if (cancelled) return;
        setCustomers(allCustomers);
        setAdvisors(allAdvisors);
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 401) {
          toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
          router.push("/admin/emlak");
          return;
        }
        toast.error("Müşteri/Danışman verileri yüklenemedi.");
      }
    }

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [fetchAllPaged, router]);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      if (!advertUid) {
        toast.error("UID yok. Sayfa parametresi hatalı.");
        router.push("/admin/emlak");
        return;
      }

      setIsLoading(true);
      try {
        const [catsRes, advertRes] = await Promise.all([
          api.get("/admin/categories"),
          api.get(`/admin/adverts/${advertUid}`),
        ]);

        if (cancelled) return;

        const cats = normalizeCategoriesPayload(catsRes);
        setCategories(cats);

        const advert = normalizeAdvertPayload(advertRes);
        if (!advert) {
          toast.error("İlan bulunamadı");
          router.push("/admin/emlak");
          return;
        }

        applyAdvertToState(advert);
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 404) {
          toast.error("İlan bulunamadı");
          router.push("/admin/emlak");
          return;
        }
        toast.error("İlan verileri yüklenemedi");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPage();
    return () => {
      cancelled = true;
    };
  }, [advertUid, applyAdvertToState, router]);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setMediaItems((prev) => {
      const currentCount = prev.length;
      const newOnes: MediaItem[] = files.map((file, idx) => ({
        id: `local-${Date.now()}-${idx}`,
        kind: "local",
        file,
      }));

      if (currentCount + newOnes.length > 35) {
        toast.error("En fazla 35 resim seçebilirsiniz.");
        return prev;
      }
      return [...prev, ...newOnes];
    });

    event.target.value = "";
  }, []);

  const removeMediaItem = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleVideoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    setVideoFile(selected ?? null);
  }, []);

  const handleChangeAcreText = useCallback((input: string) => {
    const numeric = onlyDigits(input);
    const m2 = `${numeric.slice(numeric.length > 3 ? numeric.length - 3 : 0)} m²`;
    const acre = numeric.length >= 4 ? `${numeric[numeric.length - 4]} dönüm ` : "";
    const decare = numeric.length >= 5 ? `${numeric.slice(0, numeric.length - 4)} hektar ` : "";

    setFourthStep((prev) => ({
      ...prev,
      acre: Number(numeric || 0),
      acreText: `${decare}${acre}${m2}`,
    }));
  }, []);

  const handleFileUpdates = useCallback(async () => {
    let uploadSuccess = true;

    const keepRemoteUrls = mediaItems.filter(isRemote).map((it) => it.url);
    const localFiles = mediaItems.filter(isLocal).map((it) => it.file);

    const shouldUpdateImages = localFiles.length > 0 || keepRemoteUrls.length > 0;
    if (shouldUpdateImages) {
      try {
        const t = toast.loading("İlan Resimleri Güncelleniyor...");
        const fd = new FormData();

        fd.append("uid", String(Number(advertUid)));
        fd.append("images", JSON.stringify(keepRemoteUrls));
        localFiles.forEach((f) => fd.append("images", f));

        await api.post("/admin/update-advert-images", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.dismiss(t);
        toast.success("✅ Resimler başarıyla güncellendi!");
      } catch (err) {
        uploadSuccess = false;
        toast.warning("İlan güncellendi ancak resimler güncellenemedi");
      }
    }

    if (videoFile && videoFile instanceof File) {
      try {
        const t = toast.loading("İlan Videosu Güncelleniyor...");
        const fd = new FormData();
        fd.append("uid", String(Number(advertUid)));
        fd.append("video", videoFile);

        await api.post("/admin/update-advert-video", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.dismiss(t);
        toast.success("✅ Video başarıyla güncellendi!");
      } catch (err) {
        uploadSuccess = false;
        toast.warning("İlan güncellendi ancak video yüklenemedi");
      }
    }

    return uploadSuccess;
  }, [advertUid, mediaItems, videoFile]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      if (!fourthStep.customer) {
        toast.error("Lütfen bir müşteri seçiniz.");
        return;
      }
      if (!fourthStep.title) {
        toast.error("Lütfen ilan başlığını giriniz.");
        return;
      }

      setIsSubmitting(true);
      try {
        const eidsDateTimestamp = fourthStep.eids?.date ? new Date(fourthStep.eids.date as any).getTime() : null;
        const contractDateTimestamp = fourthStep.contract_date
          ? new Date(fourthStep.contract_date as any).getTime()
          : Date.now();

        const feeValue = fourthStep.price?.value || "0";
        const feeType = fourthStep.price?.type || "TL";
        const formattedFee = `${feeValue} ${feeType}`;

        const featureValuesArray = Object.entries(featureValues)
          .filter(([, value]) => value !== undefined && value !== null && value !== "")
          .map(([featureId, value]) => ({ featureId, value }));

        const requestData: any = {
          uid: Number(advertUid),
          steps: {
            first: firstStep.selected?.value || "",
            second: secondStep.selected?.value || "",
            third: thirdStep.selected?.value || "",
          },
          title: fourthStep.title || "",
          customer: Number(fourthStep.customer) || 0,
          contract: {
            no: fourthStep.contract_no || "",
            date: contractDateTimestamp,
            time: fourthStep.contract_time?.value || "",
          },
          advisor: {
            uid: Number(fourthStep.advisor) || 0,
            peopleCanSeeProfile: fourthStep.advisor_profile?.value === "Evet",
          },
          eidsNo: fourthStep.eids?.no || "",
          eidsDate: eidsDateTimestamp,
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
          fee: formattedFee,
          address: {
            province: fourthStep.province || "",
            district: fourthStep.district || "",
            quarter: fourthStep.quarter || "",
            full_address: String(fourthStep.address || ""),
            mapCoordinates:
              marker && marker[0]
                ? { lat: marker[0].lat || 0, lng: marker[0].lng || 0 }
                : { lat: 0, lng: 0 },
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
          featureValues: featureValuesArray,
        };

        await api.post("/admin/update-advert", requestData);
        await handleFileUpdates();

        toast.success("✅ İlan başarıyla güncellendi!");
        router.push("/admin/emlak");
      } catch (err: any) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || "Bilinmeyen hata";
        toast.error(`Hata: ${status ?? "-"} - ${msg}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      advertUid,
      content,
      featureValues,
      firstStep.selected?.value,
      fourthStep,
      handleFileUpdates,
      isActiveAd,
      isSubmitting,
      marker,
      router,
      secondStep.selected?.value,
      thirdStep.selected?.value,
    ]
  );

  const renderTabContent = useMemo(() => {
    const currentTab = tabs[activeIndex];
    if (!currentTab) return null;

    switch (currentTab.label) {
      case "Temel Bilgiler":
        return (
          <BasicInfoTab
            fourthStep={fourthStep}
            content={content}
            setContent={setContent}
            onTitleChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("title", e.target.value)}
            onPriceValueChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const raw = (e.target.value || "").replace(/\./g, "");
              if (!raw) return updateNestedFourthStep("price", "value", "");
              if (isNaN(Number(raw))) return;
              if (raw.length > 15) return;
              updateNestedFourthStep("price", "value", formatThousandsTR(raw));
            }}
            onPriceTypeChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateNestedFourthStep("price", "type", e.target.value)
            }
            onAdminNoteChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFourthStep("adminNote", e.target.value)}
            currencyOptions={currencyOptions}
          />
        );

      case "Medya":
        return (
          <MediaTab
            mediaItems={mediaItems}
            setMediaItems={setMediaItems}
            onPickImages={handleImageChange}
            onRemove={removeMediaItem}
            max={35}
          />
        );

      case "Konum":
        return (
          <LocationTab
            fourthStep={fourthStep}
            marker={marker as any}
            setMarker={setMarker as any}
            onProvinceChange={(v: any) => updateFourthStep("province", v)}
            onDistrictChange={(v: any) => updateFourthStep("district", v)}
            onQuarterChange={(v: any) => updateFourthStep("quarter", v)}
            onAddressChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("address", e.target.value)}
            onParselChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("parsel", e.target.value)}
            turkeyCities={TURKEY_CITIES as any}
          />
        );

      case "Detaylar":
        if (advertData?.isFeatures) return null;
        return (
          <DetailsTab
            fourthStep={fourthStep}
            firstStep={firstStep}
            secondStep={secondStep}
            onRoomCountChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("roomCount", e.target.value)}
            onFloorChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("floor", Number(e.target.value))}
            onTotalFloorChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("totalFloor", Number(e.target.value))}
            onBuildingAgeChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("buildingAge", Number(e.target.value))}
            onNetAreaChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("netArea", Number(e.target.value))}
            onGrossAreaChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("grossArea", Number(e.target.value))}
            onBalconyCountChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("balconyCount", Number(e.target.value))}
            onAcreChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAcreText(e.target.value)}
            onElevatorToggle={(v: string) => setYesNoSelection("elevator", v)}
            onInSiteToggle={(v: string) => setYesNoSelection("inSite", v)}
            onBalconyToggle={(v: string) => setYesNoSelection("balcony", v)}
            onIsFurnishedToggle={(v: string) => setYesNoSelection("isFurnished", v)}
            onHeatingChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("heating", e.target.value)}
            onDeedStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("deedStatus", e.target.value)}
            onWhichSideChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("whichSide", e.target.value)}
            onZoningStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("zoningStatus", e.target.value)}
            heatingOptions={heatingOptions}
            deedStatusOptions={deedStatusOptions}
            directionOptions={directionOptions}
            zoningStatusOptions={zoningStatusOptions}
          />
        );

      case "Özellikler":
        return (
          <EditFeaturesTab
            fourthStep={fourthStep}
            firstStep={firstStep}
            secondStep={secondStep}
            thirdStep={thirdStep}
            featuresStep={featuresStep}
            setFeaturesStep={setFeaturesStep}
            onElevatorToggle={(v: string) => setYesNoSelection("elevator", v)}
            onInSiteToggle={(v: string) => setYesNoSelection("inSite", v)}
            onBalconyToggle={(v: string) => setYesNoSelection("balcony", v)}
            onIsFurnishedToggle={(v: string) => setYesNoSelection("isFurnished", v)}
            onHeatingChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("heating", e.target.value)}
            onDeedStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("deedStatus", e.target.value)}
            onWhichSideChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("whichSide", e.target.value)}
            onZoningStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("zoningStatus", e.target.value)}
            heatingOptions={heatingOptions}
            deedStatusOptions={deedStatusOptions}
            directionOptions={directionOptions}
            zoningStatusOptions={zoningStatusOptions}
            featureValues={featureValues}
            setFeatureValues={setFeatureValues}
            categories={categories}
            categoryId={advertData?.categoryId}
            subcategoryId={advertData?.subcategoryId}
          />
        );

      case "Diğer":
        return (
          <EditOtherInfoTab
            fourthStep={fourthStep}
            customers={customers}
            advisors={advisors}
            isActiveAd={isActiveAd}
            setIsActiveAd={setIsActiveAd}
            onCustomerChange={(v: any) => updateFourthStep("customer", v)}
            onAdvisorChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFourthStep("advisor", e.target.value)}
            onContractNoChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              if (val === "" || /^[0-9\b]+$/.test(val)) updateFourthStep("contract_no", val);
            }}
            onContractDateChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("contract_date", e.target.value)}
            onContractTimeChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("contract_time", e.target.value)}
            onEidsValueChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNestedFourthStep("eids", "value", e.target.value)}
            onEidsNoChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNestedFourthStep("eids", "no", e.target.value)}
            onEidsDateChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNestedFourthStep("eids", "date", e.target.value)}
            onKeyChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectionValue("key", e.target.value)}
            onAdvisorProfileToggle={(v: string) => setYesNoSelection("advisor_profile", v)}
            onAgendaEmlakToggle={(v: string) => setYesNoSelection("agenda_emlak", v)}
            onHomepageEmlakToggle={(v: string) => setYesNoSelection("homepage_emlak", v)}
            onNewEmlakToggle={(v: string) => setYesNoSelection("new_emlak", v)}
            onChanceEmlakToggle={(v: string) => setYesNoSelection("chance_emlak", v)}
            onSpecialEmlakToggle={(v: string) => setYesNoSelection("special_emlak", v)}
            onOnwebEmlakToggle={(v: string) => setYesNoSelection("onweb_emlak", v)}
            contractTimes={contractTimes}
            yesNoOptions={yesNoOptions}
            keyOptions={keyOptions}
          />
        );

      default:
        return null;
    }
  }, [
    activeIndex,
    advertData?.categoryId,
    advertData?.isFeatures,
    advertData?.subcategoryId,
    advisors,
    categories,
    content,
    customers,
    featureValues,
    featuresStep,
    firstStep,
    fourthStep,
    handleChangeAcreText,
    handleImageChange,
    isActiveAd,
    marker,
    mediaItems,
    removeMediaItem,
    secondStep,
    setFeatureValues,
    setFeaturesStep,
    setSelectionValue,
    setYesNoSelection,
    tabs,
    thirdStep,
    updateFourthStep,
    updateNestedFourthStep,
  ]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">İlan verileri yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Edit className="text-blue-500" size={24} />
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">İlanı Düzenle</h1>
                </div>
                <p className="text-gray-600 text-sm lg:text-base truncate">
                  {firstStep.selected?.value && secondStep.selected?.value && thirdStep.selected?.value
                    ? `${firstStep.selected.value} • ${secondStep.selected.value} • ${thirdStep.selected.value}`
                    : "İlan bilgilerini düzenleyin"}
                </p>
              </div>

              <Link
                href="/admin/emlak"
                className="bg-custom-orange text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Emlaklara Dön</span>
                <span className="sm:hidden">Geri</span>
              </Link>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 h-1.5 w-full">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              <div className="p-4 lg:p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="relative">
                    <div ref={tabContainerRef} className="flex overflow-x-auto pb-2 -mb-2 scrollbar-hide mx-8">
                      <div className="flex space-x-1 min-w-max">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = tab.id === tabs[activeIndex]?.id;

                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={[
                                "group flex items-center gap-2 pb-3 px-3 font-medium text-xs lg:text-sm border-b-2",
                                "transition-all duration-200 whitespace-nowrap relative shrink-0",
                                "min-w-[100px] lg:min-w-[120px] justify-center",
                                isActive
                                  ? "border-blue-500 text-blue-600 bg-blue-50"
                                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300",
                              ].join(" ")}
                            >
                              <div
                                className={[
                                  "p-1.5 rounded-lg transition-colors shrink-0",
                                  isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                                ].join(" ")}
                              >
                                <Icon size={16} />
                              </div>

                              <span className="font-medium text-xs lg:text-sm text-center leading-tight">{tab.label}</span>

                              {isActive && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-h-[400px] lg:min-h-[500px] max-h-[60vh] overflow-y-auto scrollbar-hide">
                  {renderTabContent}
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    {fourthStep.title ? (
                      <>
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                        <span className="font-medium text-gray-800 truncate max-w-[200px]">{fourthStep.title}</span>
                      </>
                    ) : (
                      "Henüz başlık girilmedi"
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setActiveTab((t) => {
                        const idx = tabs.findIndex((x) => x.id === t);
                        const prev = Math.max(0, idx - 1);
                        return tabs[prev]?.id ?? t;
                      })}
                      disabled={activeIndex === 0}
                      whileHover={{ scale: activeIndex === 0 ? 1 : 1.02 }}
                      whileTap={{ scale: activeIndex === 0 ? 1 : 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
                    >
                      <ArrowLeft size={16} />
                      Geri
                    </motion.button>

                    {activeIndex < tabs.length - 1 ? (
                      <motion.button
                        type="button"
                        onClick={() => setActiveTab((t) => {
                          const idx = tabs.findIndex((x) => x.id === t);
                          const next = Math.min(tabs.length - 1, idx + 1);
                          return tabs[next]?.id ?? t;
                        })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold"
                      >
                        İleri
                        <ArrowRight size={16} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200 font-semibold"
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
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
