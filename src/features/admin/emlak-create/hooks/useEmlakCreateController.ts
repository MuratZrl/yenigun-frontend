// src/features/admin/emlak-create/hooks/useEmlakCreateController.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import type { Category } from "@/types/category";
import type { Advisor } from "@/types/advert";
import type Customer from "@/types/customers";
import { defaultFormData } from "@/data/propertyData";
import type { FormData, ImageItem, StepState } from "@/types/property";

import {
  createAdvert,
  fetchAllAdvisors,
  fetchAllCustomers,
  fetchCategories,
  uploadAdvertImages,
  uploadAdvertVideo,
} from "../api/emlakCreateApi";

import { buildTurkeyCities } from "../model/buildTurkeyCities";
import { buildCreateAdvertPayload } from "../model/buildCreateAdvertPayload";

function formatNumberTRDigitsOnly(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function useEmlakCreateController() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reOrderImages, setReOrderImages] = useState(false);
  const [marker, setMarker] = useState<any[]>([]);
  const [content, setContent] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isActiveAd, setIsActiveAd] = useState(true);

  const [firstStep, setFirstStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "", name: "", categoryData: null },
  });

  const [secondStep, setSecondStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "", subcategoryData: null },
  });

  const [thirdStep, setThirdStep] = useState<StepState>({
    selected: { isSelect: false, value: "", id: "", subcategoryData: null },
  });

  const [featuresStep, setFeaturesStep] = useState<StepState>({
    selected: { isSelect: false, value: "", featureData: null },
    selections: {},
  });

  const [fourthStep, setFourthStep] = useState<FormData>(defaultFormData);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const turkeyCities = useMemo(() => buildTurkeyCities(), []);

  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch {
        toast.error("Kategoriler yüklenemedi");
        setCategories([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [cs, adv] = await Promise.all([fetchAllCustomers(), fetchAllAdvisors()]);
        setCustomers(cs);
        setAdvisors(adv);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
          setTimeout(() => (window.location.href = "/admin/emlak"), 2000);
          return;
        }
        toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
      }
    })();
  }, []);

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

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => updateFourthStep("title", e.target.value),
    [updateFourthStep]
  );

  const handlePriceValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyDigits = e.target.value.replace(/\./g, "");
      if (!isNaN(Number(onlyDigits)) && onlyDigits.length <= 15) {
        updateNestedFourthStep("price", "value", formatNumberTRDigitsOnly(onlyDigits));
      }
    },
    [updateNestedFourthStep]
  );

  const handlePriceTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => updateNestedFourthStep("price", "type", e.target.value),
    [updateNestedFourthStep]
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(event.target.files || []);
      if (selected.length + images.length > 35) {
        alert("En fazla 35 resim seçebilirsiniz.");
        return;
      }

      const currentLength = images.length;
      const newImages = selected.map((file, idx) => ({
        id: String(currentLength + idx + 1),
        src: file as any,
      }));

      setImages((prev) => prev.concat(newImages));
    },
    [images.length]
  );

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleVideoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (f) setVideoFile(f);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        if (!(fourthStep as any).customer) {
          toast.error("Lütfen bir müşteri seçiniz.");
          return;
        }
        if (!(fourthStep as any).title) {
          toast.error("Lütfen ilan başlığını giriniz.");
          return;
        }

        const requestData = buildCreateAdvertPayload({
          firstStep,
          secondStep,
          thirdStep,
          featuresStep,
          fourthStep,
          content,
          marker,
          isActiveAd,
        });

        const res = await createAdvert(requestData);
        const advertUid = res?.data?.data?.uid;

        if (!advertUid) {
          toast.error("İlan oluşturuldu ama uid alınamadı.");
          return;
        }

        let uploadOk = true;

        const imageFiles = images
          .map((x: any) => x?.src)
          .filter((f: any) => f instanceof File) as File[];

        if (imageFiles.length) {
          const t = toast.loading("İlan resimleri yükleniyor...");
          try {
            await uploadAdvertImages(advertUid, imageFiles);
            toast.success("Resimler başarıyla yüklendi!");
          } catch {
            uploadOk = false;
            toast.warning("İlan oluşturuldu ancak resimler yüklenemedi");
          } finally {
            toast.dismiss(t);
          }
        }

        if (videoFile instanceof File) {
          const t = toast.loading("İlan videosu yükleniyor...");
          try {
            await uploadAdvertVideo(advertUid, videoFile);
            toast.success("Video başarıyla yüklendi!");
          } catch {
            uploadOk = false;
            toast.warning("İlan oluşturuldu ancak video yüklenemedi");
          } finally {
            toast.dismiss(t);
          }
        }

        toast.success(uploadOk ? "✅ İlan ve tüm dosyalar başarıyla oluşturuldu!" : "✅ İlan oluşturuldu! (Bazı dosyalar yüklenemedi)");

        setTimeout(() => router.push("/admin/emlak"), 2000);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          toast.error("Müşteri bulunamadı. Lütfen geçerli bir müşteri seçin.");
          return;
        }
        toast.error(err?.response?.data?.message || "Bir hata oluştu. Lütfen girdiğiniz bilgileri kontrol edin.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      content,
      featuresStep,
      firstStep,
      fourthStep,
      images,
      isActiveAd,
      marker,
      router,
      secondStep,
      thirdStep,
      videoFile,
    ]
  );

  return {
    router,

    activeTab,
    setActiveTab,
    isSubmitting,

    reOrderImages,
    setReOrderImages,

    marker,
    setMarker,

    content,
    setContent,

    customers,
    advisors,
    categories,

    isActiveAd,
    setIsActiveAd,

    firstStep,
    setFirstStep,
    secondStep,
    setSecondStep,
    thirdStep,
    setThirdStep,
    featuresStep,
    setFeaturesStep,

    fourthStep,
    setFourthStep,
    updateFourthStep,
    updateNestedFourthStep,

    images,
    setImages,
    videoFile,
    setVideoFile,

    turkeyCities,

    handleTitleChange,
    handlePriceValueChange,
    handlePriceTypeChange,

    handleImageChange,
    handleRemoveImage,
    handleVideoChange,

    handleSubmit,
  };
}
