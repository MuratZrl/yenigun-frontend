// src/components/CategorySection.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FolderOpen, ChevronRight, Layers, Info, RefreshCw } from "lucide-react";
import api from "@/lib/api";

type Id = string;

interface FeatureValue {
  featureId: Id;
  value: unknown;
}

/**
 * Eski (nested) şema için: subcategory.features
 */
interface LegacyFeature {
  _id: Id;
  name: string;
  type?: string;
  options?: unknown[];
}

interface LegacySubcategory {
  _id: Id;
  name: string;
  features?: LegacyFeature[];
  subcategories?: LegacySubcategory[];
}

interface LegacyCategory {
  _id: Id;
  name: string;
  subcategories?: LegacySubcategory[];
}

/**
 * Yeni (flat) şema için: uid/parentUid + attributes/facilities
 * Not: Backend’te alan adları farklıysa burada tolere ediyoruz.
 */
type FlatCategory = {
  uid?: number | string;
  parentUid?: number | string | null;
  name?: string;

  // metadata (feature/questions)
  attributes?: Array<{ _id?: string; uid?: number | string; name?: string; label?: string }>;
  facilities?: Array<{ _id?: string; uid?: number | string; name?: string; label?: string }>;

  // bazı payload’larda farklı isimler olabiliyor
  attributeList?: any[];
  facilityList?: any[];
};

interface Props {
  categoryId?: string | null;
  subcategoryId?: string | null;
  featureValues?: FeatureValue[];
}

type ApiAny = any;

function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    const s = value.trim();
    return s ? s : null;
  }

  if (typeof value === "boolean") return value ? "Evet" : "Hayır";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;

  if (Array.isArray(value)) {
    const cleaned = value
      .map((v) => (v === null || v === undefined ? "" : String(v).trim()))
      .filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : null;
  }

  if (typeof value === "object") {
    const v: any = value;
    const hasMin = v?.min !== undefined && v?.min !== null && String(v.min).trim() !== "";
    const hasMax = v?.max !== undefined && v?.max !== null && String(v.max).trim() !== "";
    if (hasMin || hasMax) return `${hasMin ? v.min : "?"} - ${hasMax ? v.max : "?"}`;
    return null;
  }

  return String(value);
}

/**
 * API response’u olabildiğince toleranslı şekilde diziye indirger.
 * Senin backend’te çoğu zaman: res.data.data.categories gibi geliyor.
 */
function unwrapCategoriesArray(res: ApiAny): any[] {
  const root = res?.data ?? res;

  const candidates = [
    root?.data?.categories,
    root?.data?.data?.categories,
    root?.categories,
    root?.data,
    root?.data?.data,
    root?.items,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  return Array.isArray(root) ? root : [];
}

/**
 * Legacy (nested) subcategory’leri derin dolaşır.
 */
function collectLegacySubcategoriesDeep(subs: LegacySubcategory[]): LegacySubcategory[] {
  const out: LegacySubcategory[] = [];
  const walk = (arr: LegacySubcategory[]) => {
    for (const s of safeArr(arr)) {
      out.push(s);
      if (s.subcategories?.length) walk(s.subcategories);
    }
  };
  walk(subs);
  return out;
}

/**
 * Flat şema için: uid/parentUid ağacını kurup,
 * her node için featureMap (attributes+facilities) çıkarır.
 */
type FlatNode = {
  id: string;
  name: string;
  parentId: string | null;
  children: FlatNode[];
  featureNameById: Map<string, string>;
};

function toStrId(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function pickFeatureId(x: any): string | null {
  return toStrId(x?._id) ?? toStrId(x?.uid) ?? toStrId(x?.id) ?? null;
}

function pickFeatureName(x: any): string | null {
  return toStrId(x?.name) ?? toStrId(x?.label) ?? null;
}

function buildFlatTree(items: FlatCategory[]): {
  nodeById: Map<string, FlatNode>;
  roots: FlatNode[];
} {
  const nodeById = new Map<string, FlatNode>();

  // 1) node’ları üret
  for (const raw of items) {
    const id = toStrId(raw.uid) ?? toStrId((raw as any)._id) ?? null;
    if (!id) continue;

    const parentId = toStrId(raw.parentUid) ?? null;
    const name = toStrId(raw.name) ?? id;

    // feature map (attributes + facilities)
    const featureNameById = new Map<string, string>();

    const attrs = safeArr(raw.attributes ?? (raw as any).attributeList);
    const facs = safeArr(raw.facilities ?? (raw as any).facilityList);

    for (const f of [...attrs, ...facs]) {
      const fid = pickFeatureId(f);
      const fname = pickFeatureName(f);
      if (fid && fname) featureNameById.set(fid, fname);
    }

    nodeById.set(id, {
      id,
      name,
      parentId,
      children: [],
      featureNameById,
    });
  }

  // 2) parent-child bağla
  const roots: FlatNode[] = [];
  for (const node of nodeById.values()) {
    if (node.parentId && nodeById.has(node.parentId)) {
      nodeById.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return { nodeById, roots };
}

export default function PremiumCategorySection({ categoryId, subcategoryId, featureValues }: Props) {
  const [categoriesRaw, setCategoriesRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    // önceki istek varsa iptal et
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    try {
      // ✅ kritik fix: backend sende /admin/categories için 404 dönüyor, list endpoint’i kullan
      const res = await api.get("/admin/categories", { signal: ctrl.signal } as any);
      const arr = unwrapCategoriesArray(res);
      setCategoriesRaw(arr);
    } catch (e: any) {
      // iptal edilen request’i hata gibi göstermeyelim
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") {
        return;
      }

      const status = e?.response?.status;
      const msg =
        status === 401
          ? "Yetkisiz (401). Kategoriler okunamadı."
          : status === 404
          ? "Endpoint bulunamadı (404)."
          : "Kategoriler yüklenemedi.";
      setError(msg);
      setCategoriesRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchCategories]);

  /**
   * Hem legacy nested şemayı, hem flat şemayı destekleyen lookup’lar.
   * categoryName/subcategoryName ve featureId->featureName çözümlemelerini burada yapıyoruz.
   */
  const lookups = useMemo(() => {
    const categoryNameById = new Map<string, string>();
    const subNameByKey = new Map<string, string>(); // `${catId}:${subId}`
    const featureNameByKey = new Map<string, string>(); // `${catId}:${subId}:${featId}`
    const featureNameByNode = new Map<string, Map<string, string>>(); // nodeId -> featureId->name

    // Legacy mi?
    const looksLegacy =
      categoriesRaw.length > 0 &&
      typeof categoriesRaw[0] === "object" &&
      (("_id" in categoriesRaw[0] && "name" in categoriesRaw[0]) || "subcategories" in categoriesRaw[0]);

    if (looksLegacy) {
      const cats = categoriesRaw as LegacyCategory[];
      for (const c of safeArr(cats)) {
        if (!c?._id) continue;
        categoryNameById.set(c._id, c.name ?? c._id);

        const allSubs = collectLegacySubcategoriesDeep(safeArr(c.subcategories));
        for (const s of allSubs) {
          if (!s?._id) continue;
          subNameByKey.set(`${c._id}:${s._id}`, s.name ?? s._id);

          for (const f of safeArr(s.features)) {
            if (!f?._id) continue;
            featureNameByKey.set(`${c._id}:${s._id}:${f._id}`, f.name ?? f._id);
          }
        }
      }

      return { categoryNameById, subNameByKey, featureNameByKey, featureNameByNode };
    }

    // Flat
    const flat = categoriesRaw as FlatCategory[];
    const { nodeById } = buildFlatTree(flat);

    for (const node of nodeById.values()) {
      categoryNameById.set(node.id, node.name);

      // node bazlı feature map
      featureNameByNode.set(node.id, node.featureNameById);

      // subNameByKey için parent ilişkisini “catId:subId” şeklinde doldur
      if (node.parentId) {
        subNameByKey.set(`${node.parentId}:${node.id}`, node.name);
      }
    }

    return { categoryNameById, subNameByKey, featureNameByKey, featureNameByNode };
  }, [categoriesRaw]);

  const categoryName = useMemo(() => {
    if (!categoryId) return null;
    return lookups.categoryNameById.get(categoryId) ?? categoryId;
  }, [categoryId, lookups.categoryNameById]);

  const subcategoryName = useMemo(() => {
    if (!categoryId || !subcategoryId) return null;
    return lookups.subNameByKey.get(`${categoryId}:${subcategoryId}`) ?? subcategoryId;
  }, [categoryId, subcategoryId, lookups.subNameByKey]);

  /**
   * Feature name resolve stratejisi:
   * 1) Legacy ise `${catId}:${subId}:${featureId}` key’i ile çöz.
   * 2) Flat ise önce subcategoryId node’unda ara, yoksa categoryId node’unda ara.
   * 3) Hiçbiri yoksa featureId’yi göster.
   */
  const validFeatures = useMemo(() => {
    const list = safeArr(featureValues)
      .map((fv) => {
        const formatted = formatValue(fv.value);
        if (!formatted) return null;

        let name: string | null = null;

        if (categoryId && subcategoryId) {
          name = lookups.featureNameByKey.get(`${categoryId}:${subcategoryId}:${fv.featureId}`) ?? null;
        }

        if (!name) {
          const subMap = subcategoryId ? lookups.featureNameByNode.get(subcategoryId) : undefined;
          const catMap = categoryId ? lookups.featureNameByNode.get(categoryId) : undefined;
          name = (subMap?.get(fv.featureId) ?? catMap?.get(fv.featureId) ?? null) as any;
        }

        return {
          featureId: fv.featureId,
          featureName: name ?? fv.featureId,
          formattedValue: formatted,
        };
      })
      .filter(Boolean) as Array<{ featureId: Id; featureName: string; formattedValue: string }>;

    return list;
  }, [featureValues, categoryId, subcategoryId, lookups.featureNameByKey, lookups.featureNameByNode]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-100 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">İlan Detayları</h3>

          {error && (
            <div className="mt-2 text-xs text-red-600">
              {error}{" "}
              <button
                type="button"
                onClick={fetchCategories}
                className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 underline"
              >
                <RefreshCw size={12} />
                Yeniden Dene
              </button>
            </div>
          )}
        </div>

        {categoryId && subcategoryId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{categoryName}</span>
            </div>

            <ChevronRight className="w-4 h-4" />

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>{subcategoryName}</span>
            </div>
          </div>
        )}
      </div>

      {validFeatures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {validFeatures.map((feat) => (
            <div
              key={feat.featureId}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow duration-200"
            >
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {feat.featureName}
              </p>
              <p className="text-base font-semibold text-gray-900">{feat.formattedValue}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Info className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">Özellik bilgisi bulunmuyor</p>
        </div>
      )}
    </div>
  );
}
