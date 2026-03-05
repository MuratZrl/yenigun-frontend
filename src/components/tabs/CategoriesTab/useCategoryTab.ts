// src/components/tabs/CategoriesTab/useCategoryTab.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import type { StepState } from "@/types/property";
import type { RawCategoryNode, UiCategory, NestedSubCategory } from "./types";
import {
  safeArr,
  mapChildrenToSubcategories,
  pickMainForUI,
  slugifyTR,
  isAbortError,
  getSelected,
  patchSelected,
  resolveStepsToColumns,
  CATEGORIES_ENDPOINT,
} from "./utils";

interface UseCategoryTabParams {
  firstStep: StepState;
  setFirstStep: React.Dispatch<React.SetStateAction<StepState>>;
  secondStep: StepState;
  setSecondStep: React.Dispatch<React.SetStateAction<StepState>>;
  thirdStep: StepState;
  setThirdStep: React.Dispatch<React.SetStateAction<StepState>>;
}

export function useCategoryTab({
  firstStep,
  setFirstStep,
  secondStep,
  setSecondStep,
  thirdStep,
  setThirdStep,
}: UseCategoryTabParams) {
  const [categories, setCategories] = useState<UiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const didSyncRef = useRef(false);

  /* ── Fetch ── */
  const loadCategories = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get<{ data?: { tree?: RawCategoryNode[] }; tree?: RawCategoryNode[] }>(
        CATEGORIES_ENDPOINT,
        { signal: ac.signal },
      );
      const raw = res?.data?.data?.tree || res?.data?.tree || res?.data?.data || [];
      const tree = mapChildrenToSubcategories(Array.isArray(raw) ? (raw as RawCategoryNode[]) : []);
      const main = pickMainForUI(tree);

      setCategories(main.map((n) => ({ ...n, value: slugifyTR(n.name) })));
    } catch (e: unknown) {
      if (isAbortError(e)) return;
      const status = (e as AxiosError)?.response?.status;
      if (status === 401) setError("Yetkisiz (401). Admin oturumu/token sorunu var.");
      else if (status === 403) setError("Erişim yok (403). Yetki sorunu var.");
      else if (status === 404) setError("Endpoint bulunamadı (404). Route yanlış.");
      else setError("Kategoriler yüklenemedi.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    return () => abortRef.current?.abort();
  }, [loadCategories]);

  /* ── Sync pre-existing selection by name → id (for edit page) ── */
  useEffect(() => {
    if (didSyncRef.current || !categories.length) return;

    const firstSel = getSelected(firstStep);
    const secondSel = getSelected(secondStep);
    const thirdSel = getSelected(thirdStep);

    const hasNameNoId =
      (firstSel?.value && !firstSel?.id) ||
      (secondSel?.value && !secondSel?.id) ||
      (thirdSel?.value && !thirdSel?.id);
    if (!hasNameNoId) return;

    const stepNames = [firstSel?.value || "", secondSel?.value || "", thirdSel?.value || ""];
    const { col1, col2, col3 } = resolveStepsToColumns(categories, stepNames);
    if (!col1) return;

    didSyncRef.current = true;

    patchSelected(setFirstStep, {
      isSelect: true,
      value: col1.name,
      id: col1._id,
      uid: col1.uid,
      name: col1.name,
      categoryData: col1,
    });

    if (col2) {
      patchSelected(setSecondStep, {
        isSelect: true,
        value: col2.name,
        id: col2._id,
        uid: col2.uid,
        subcategoryData: col2,
      });
    }

    if (col3) {
      patchSelected(setThirdStep, {
        isSelect: true,
        value: col3.name,
        id: col3._id,
        uid: col3.uid,
        subcategoryData: col3,
      });
    }
  }, [categories, firstStep, secondStep, thirdStep, setFirstStep, setSecondStep, setThirdStep]);

  /* ── Selection helpers ── */
  const resetSecond = useCallback(() => {
    patchSelected(setSecondStep, { isSelect: false, value: "", id: "", uid: undefined, subcategoryData: null });
  }, [setSecondStep]);

  const resetThird = useCallback(() => {
    patchSelected(setThirdStep, { isSelect: false, value: "", id: "", uid: undefined, subcategoryData: null });
  }, [setThirdStep]);

  const clearAll = useCallback(() => {
    didSyncRef.current = false;
    patchSelected(setFirstStep, { isSelect: false, value: "", id: "", uid: undefined, name: "", categoryData: null });
    resetSecond();
    resetThird();
  }, [setFirstStep, resetSecond, resetThird]);

  /* ── Derived state ── */
  const firstSel = getSelected(firstStep);
  const secondSel = getSelected(secondStep);
  const thirdSel = getSelected(thirdStep);

  const firstSelected = Boolean(firstSel?.isSelect);
  const secondSelected = Boolean(secondSel?.isSelect);
  const thirdSelected = Boolean(thirdSel?.isSelect);

  const selectedMain = useMemo(
    () => categories.find((c) => c._id === String(firstSel?.id ?? "")) ?? null,
    [categories, firstSel],
  );

  const mainSubs = useMemo(
    () => safeArr<NestedSubCategory>(selectedMain?.subcategories),
    [selectedMain],
  );

  const selectedSub = useMemo(
    () => mainSubs.find((s) => s._id === String(secondSel?.id ?? "")) ?? null,
    [mainSubs, secondSel],
  );

  const nestedSubs = useMemo(
    () => safeArr<NestedSubCategory>(selectedSub?.subcategories),
    [selectedSub],
  );

  const isComplete = useMemo(() => {
    if (!firstSelected) return false;
    if (mainSubs.length === 0) return true;
    if (!secondSelected) return false;
    if (nestedSubs.length === 0) return true;
    if (!thirdSelected) return false;
    return true;
  }, [firstSelected, secondSelected, thirdSelected, mainSubs, nestedSubs]);

  const breadcrumb = useMemo(() => {
    const parts: string[] = ["Emlak"];
    if (firstSel?.value) parts.push(firstSel.value);
    if (secondSel?.value) parts.push(secondSel.value);
    if (thirdSel?.value) parts.push(thirdSel.value);
    return parts;
  }, [firstSel, secondSel, thirdSel]);

  /* ── Handlers ── */
  const handleMainSelect = useCallback(
    (cat: NestedSubCategory) => {
      patchSelected(setFirstStep, {
        isSelect: true,
        value: cat.name,
        id: cat._id,
        uid: cat.uid,
        name: cat.name,
        categoryData: cat,
      });
      resetSecond();
      resetThird();
    },
    [setFirstStep, resetSecond, resetThird],
  );

  const handleSubSelect = useCallback(
    (sub: NestedSubCategory) => {
      patchSelected(setSecondStep, {
        isSelect: true,
        value: sub.name,
        id: sub._id,
        uid: sub.uid,
        subcategoryData: sub,
      });
      resetThird();
    },
    [setSecondStep, resetThird],
  );

  const handleNestedSelect = useCallback(
    (nested: NestedSubCategory) => {
      patchSelected(setThirdStep, {
        isSelect: true,
        value: nested.name,
        id: nested._id,
        uid: nested.uid,
        subcategoryData: nested,
      });
    },
    [setThirdStep],
  );

  return {
    categories,
    loading,
    error,
    loadCategories,
    firstSel,
    secondSel,
    thirdSel,
    firstSelected,
    secondSelected,
    thirdSelected,
    mainSubs,
    nestedSubs,
    isComplete,
    breadcrumb,
    clearAll,
    handleMainSelect,
    handleSubSelect,
    handleNestedSelect,
  };
}
