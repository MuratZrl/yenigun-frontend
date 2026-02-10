// src/components/tabs/CategoriesTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight, X } from "lucide-react";

import api from "@/lib/api";
import type { StepState } from "@/types/property";

type Id = string;

// 1) TYPE'ları genişlet (dosyanın üst tarafı)
type CategoryAttribute = {
  id: string;
  type: string;          // TEXT, NUMBER, SELECT vs
  options?: string[];
  required?: boolean;
  name: string;
  order?: number;
};

type CategoryFacilityGroup = {
  title: string;
  features: string[];
};

type NestedSubCategory = {
  _id: Id;
  uid: number;
  parentUid: number | null;
  name: string;

  // ✅ Backend’den geliyor, kaybetme
  attributes?: CategoryAttribute[];
  facilities?: CategoryFacilityGroup[];

  subcategories?: NestedSubCategory[];
};

type UiCategory = NestedSubCategory & { value: string };

interface CombinedCategoryTabProps {
  firstStep: StepState;
  setFirstStep: React.Dispatch<React.SetStateAction<StepState>>;

  secondStep: StepState;
  setSecondStep: React.Dispatch<React.SetStateAction<StepState>>;

  thirdStep: StepState;
  setThirdStep: React.Dispatch<React.SetStateAction<StepState>>;

  onNext?: () => void;
}

const CATEGORIES_ENDPOINT = "/admin/categories";

function safeArr<T>(v: any): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function slugifyTR(input: string) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isAbortError(e: any) {
  return e?.name === "AbortError" || e?.code === "ERR_CANCELED";
}

function getSelected(step: StepState): any {
  return (step as any)?.selected ?? {};
}

function patchSelected(
  setStep: React.Dispatch<React.SetStateAction<StepState>>,
  patch: Record<string, any>
) {
  setStep((prev) => {
    const prevSel = getSelected(prev);
    return {
      ...prev,
      selected: {
        ...prevSel,
        ...patch,
      },
    } as StepState;
  });
}

/**
 * Backend response'un gerçek şekli:
 * { success:true, data: { categories: [ { _id, uid, parentUid, name, ... } ] } }
 * Buradan tree kuruyoruz.
 */
function unwrapFlatCategories(resLike: any): any[] {
  const root = resLike?.data ?? resLike;
  const arr =
    root?.data?.categories ??
    root?.data?.data?.categories ??
    root?.categories ??
    root?.data?.categories ??
    root?.data?.data ??
    root?.data ??
    root;

  return Array.isArray(arr) ? arr : [];
}

// 2) buildTreeFromFlat içinde node oluştururken attributes/facilities'i ekle

function buildTreeFromFlat(flat: any[]): NestedSubCategory[] {
  const map = new Map<number, NestedSubCategory>();

  for (const c of safeArr<any>(flat)) {
    const uidRaw = c?.uid;
    const parentRaw = c?.parentUid;

    const uid = typeof uidRaw === "number" ? uidRaw : Number(uidRaw);
    const parentUid =
      parentRaw === null || typeof parentRaw === "undefined" ? null : Number(parentRaw);

    if (!Number.isFinite(uid)) continue;

    map.set(uid, {
      _id: String(c?._id ?? c?.id ?? ""),
      uid,
      parentUid,
      name: String(c?.name ?? c?.title ?? c?.label ?? "İsimsiz Kategori"),

      // ✅ kritik kısım: metadata’yı taşımak
      attributes: safeArr<CategoryAttribute>(c?.attributes),
      facilities: safeArr<CategoryFacilityGroup>(c?.facilities),

      subcategories: [],
    });
  }

  const roots: NestedSubCategory[] = [];

  for (const node of map.values()) {
    if (node.parentUid == null) {
      roots.push(node);
      continue;
    }
    const parent = map.get(node.parentUid);
    if (parent) {
      parent.subcategories = parent.subcategories ?? [];
      parent.subcategories.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (n: NestedSubCategory) => {
    n.subcategories = safeArr<NestedSubCategory>(n.subcategories).sort((a, b) =>
      a.name.localeCompare(b.name, "tr")
    );
    n.subcategories.forEach(sortRec);
  };
  roots.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  roots.forEach(sortRec);

  return roots;
}

/**
 * UI'nın 1. kolonu için root'u otomatik “flatten”:
 * Eğer tek root varsa (genelde "Emlak") onun çocuklarını ana kategori gibi göster.
 */
function pickMainForUI(treeRoots: NestedSubCategory[]): NestedSubCategory[] {
  if (treeRoots.length === 1) {
    const only = treeRoots[0];
    const kids = safeArr<NestedSubCategory>(only.subcategories);
    if (kids.length > 0) return kids;
  }
  return treeRoots;
}

export default function CombinedCategoryTab({
  firstStep,
  setFirstStep,
  secondStep,
  setSecondStep,
  thirdStep,
  setThirdStep,
  onNext,
}: CombinedCategoryTabProps) {
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const loadCategories = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(CATEGORIES_ENDPOINT, { signal: ac.signal } as any);

      const flat = unwrapFlatCategories(res);
      const tree = buildTreeFromFlat(flat);
      const main = pickMainForUI(tree);

      const ui: UiCategory[] = main.map((n) => ({
        ...n,
        value: slugifyTR(n.name),
      }));

      setCategories(ui);
    } catch (e: any) {
      if (isAbortError(e)) return;

      const status = e?.response?.status;
      if (status === 401) setError("Yetkisiz (401). Admin oturumu/token sorunu var.");
      else if (status === 403) setError("Erişim yok (403). Yetki sorunu var.");
      else if (status === 404) setError("Endpoint bulunamadı (404). Route yanlış.");
      else setError("Kategoriler yüklenemedi. (Network/parse sorunu)");

      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    return () => abortRef.current?.abort();
  }, [loadCategories]);

  const resetSecond = useCallback(() => {
    patchSelected(setSecondStep, { isSelect: false, value: "", id: "", uid: null, subcategoryData: null });
  }, [setSecondStep]);

  const resetThird = useCallback(() => {
    patchSelected(setThirdStep, { isSelect: false, value: "", id: "", uid: null, subcategoryData: null });
  }, [setThirdStep]);

  const clearSelection = useCallback(
    (step: "first" | "second" | "third") => {
      if (step === "first") {
        patchSelected(setFirstStep, { isSelect: false, value: "", id: "", uid: null, name: "", categoryData: null });
        resetSecond();
        resetThird();
        return;
      }
      if (step === "second") {
        resetSecond();
        resetThird();
        return;
      }
      resetThird();
    },
    [setFirstStep, resetSecond, resetThird]
  );

  const selectedMain = useMemo(() => {
    const firstId = String(getSelected(firstStep)?.id ?? "");
    return categories.find((c) => c._id === firstId) ?? null;
  }, [categories, firstStep]);

  const mainSubs = useMemo(() => safeArr<NestedSubCategory>(selectedMain?.subcategories), [selectedMain]);

  const selectedSub = useMemo(() => {
    const secondId = String(getSelected(secondStep)?.id ?? "");
    return safeArr<NestedSubCategory>(selectedMain?.subcategories).find((s) => s._id === secondId) ?? null;
  }, [selectedMain, secondStep]);

  const nestedSubs = useMemo(() => safeArr<NestedSubCategory>(selectedSub?.subcategories), [selectedSub]);

  const handleMainCategorySelect = useCallback(
    (category: UiCategory) => {
      patchSelected(setFirstStep, {
        isSelect: true,
        value: category.name,
        id: category._id,
        uid: category.uid,
        name: category.name,
        categoryData: category,
      });
      resetSecond();
      resetThird();

      // Eğer bunun altında hiç çocuk yoksa, kategori seçimi burada bitiyor. Boş 2. kolonla insanı cezalandırma.
      if (onNext && safeArr(category.subcategories).length === 0) onNext();
    },
    [setFirstStep, resetSecond, resetThird, onNext]
  );

  const handleSubCategorySelect = useCallback(
    (subcategory: NestedSubCategory) => {
      patchSelected(setSecondStep, {
        isSelect: true,
        value: subcategory.name,
        id: subcategory._id,
        uid: subcategory.uid,
        subcategoryData: subcategory,
      });
      resetThird();

      if (onNext && safeArr(subcategory.subcategories).length === 0) onNext();
    },
    [setSecondStep, resetThird, onNext]
  );

  const handleNestedSubCategorySelect = useCallback(
    (nested: NestedSubCategory) => {
      patchSelected(setThirdStep, {
        isSelect: true,
        value: nested.name,
        id: nested._id,
        uid: nested.uid,
        subcategoryData: nested,
      });
      if (onNext) onNext();
    },
    [setThirdStep, onNext]
  );

  const firstSelected = Boolean(getSelected(firstStep)?.isSelect);
  const secondSelected = Boolean(getSelected(secondStep)?.isSelect);
  const thirdSelected = Boolean(getSelected(thirdStep)?.isSelect);

  const firstVal = String(getSelected(firstStep)?.value ?? "");
  const secondVal = String(getSelected(secondStep)?.value ?? "");
  const thirdVal = String(getSelected(thirdStep)?.value ?? "");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Kategoriler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-lg text-red-600 text-center">{error}</div>
        <button
          type="button"
          onClick={loadCategories}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="text-lg text-gray-700 text-center">Kategori bulunamadı.</div>
        <button
          type="button"
          onClick={loadCategories}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(firstSelected || secondSelected || thirdSelected) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Check size={18} className="text-blue-600" />
              Seçilen Kategoriler
            </h4>

            <button
              type="button"
              onClick={() => clearSelection("first")}
              className="text-sm text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <X size={14} />
              Temizle
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {firstSelected && (
              <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-blue-800">{firstVal}</span>
                <button
                  type="button"
                  onClick={() => clearSelection("first")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {secondSelected && (
              <>
                <ArrowRight size={14} className="text-blue-400" />
                <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-800">{secondVal}</span>
                  <button
                    type="button"
                    onClick={() => clearSelection("second")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            )}

            {thirdSelected && (
              <>
                <ArrowRight size={14} className="text-blue-400" />
                <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-800">{thirdVal}</span>
                  <button
                    type="button"
                    onClick={() => clearSelection("third")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex gap-6 min-h-[400px]">
        <div className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="font-semibold text-gray-900">Ana Kategoriler</h4>
          </div>

          <div className="overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => {
                const active = firstSelected && String(getSelected(firstStep)?.id ?? "") === category._id;
                const subCount = safeArr<NestedSubCategory>(category.subcategories).length;

                return (
                  <li key={category._id}>
                    <button
                      type="button"
                      onClick={() => handleMainCategorySelect(category)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        active ? "bg-blue-50 border-r-4 border-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {active ? <Check size={16} className="text-blue-500" /> : <span />}
                        </div>

                        <div className="text-left">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">{subCount} alt kategori</div>
                        </div>
                      </div>

                      {subCount > 0 && <ChevronRight size={16} className="text-gray-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {firstSelected && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900">Alt Kategoriler</h4>
            </div>

            <div className="overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {mainSubs.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  Bu kategorinin alt kategorisi yok. (Backend bu yapıyı parentUid ile flat veriyor; leaf seçimi geçerli.)
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {mainSubs.map((subcategory) => {
                    const active = secondSelected && String(getSelected(secondStep)?.id ?? "") === subcategory._id;
                    const nestedCount = safeArr<NestedSubCategory>(subcategory.subcategories).length;

                    return (
                      <li key={subcategory._id}>
                        <button
                          type="button"
                          onClick={() => handleSubCategorySelect(subcategory)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            active ? "bg-blue-50 border-r-4 border-blue-500" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              {active ? <Check size={16} className="text-blue-500" /> : <span />}
                            </div>

                            <div className="text-left">
                              <div className="font-medium text-gray-900">{subcategory.name}</div>
                              {nestedCount > 0 && <div className="text-xs text-gray-500">{nestedCount} detay kategori</div>}
                            </div>
                          </div>

                          {nestedCount > 0 && <ChevronRight size={16} className="text-gray-400" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {firstSelected && secondSelected && nestedSubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="w-1/4 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-900">Detay Kategoriler</h4>
            </div>

            <div className="overflow-y-auto max-h-[350px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <ul className="divide-y divide-gray-100">
                {nestedSubs.map((nested) => {
                  const active = thirdSelected && String(getSelected(thirdStep)?.id ?? "") === nested._id;
                  return (
                    <li key={nested._id}>
                      <button
                        type="button"
                        onClick={() => handleNestedSubCategorySelect(nested)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          active ? "bg-blue-50 border-r-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {active ? <Check size={16} className="text-blue-500" /> : <span />}
                        </div>
                        <div className="font-medium text-gray-900">{nested.name}</div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}

        {!firstSelected && (
          <>
            <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none" />
            <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none" />
          </>
        )}
        {firstSelected && !secondSelected && <div className="w-1/3 flex-shrink-0 opacity-0 pointer-events-none" />}
      </div>
    </div>
  );
}
