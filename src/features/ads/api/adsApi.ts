// src/features/ads/api/adsApi.ts
import api from "@/lib/api";
import type { Category } from "@/types/advert";

type SearchResponse<T> = {
  success?: boolean;
  data?: T;
  pagination?: {
    totalPages?: number;
    totalItems?: number;
  };
  message?: string;
};

function isPlainObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function cleanValue(v: any) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  if (Array.isArray(v)) {
    const cleaned = v.filter((x) => x !== undefined && x !== null && !(typeof x === "string" && x.trim() === ""));
    return cleaned.length ? cleaned : undefined;
  }
  return v;
}

/**
 * API’nin döndürdüğü kategori dizisini farklı olası şekillerden çıkarır.
 * - res.data.data.categories
 * - res.data.data.data.categories
 * - res.data.data (array)
 * - res.data.categories
 * - res.data (array)
 */
function unwrapCategories(res: any): Category[] {
  const root = res?.data ?? res;

  const candidates = [
    root?.data?.categories,
    root?.data?.data?.categories,
    root?.categories,
    root?.data,
    root?.data?.data,
    root,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c as Category[];
  }
  return [];
}

/**
 * Kategori listesi backend’de sende /admin/categories değil /admin/categories.
 * Public sayfada bu istek 401 yiyebilir (token yoksa). 404 yiyorsa endpoint yanlıştır.
 * Bu fonksiyon public UI’ın çökmemesi için hata durumunda [] döner.
 */
export async function fetchCategoriesApi(signal?: AbortSignal): Promise<Category[]> {
  const endpoints = ["/admin/categories/list", "/admin/categories/list"];

  for (const ep of endpoints) {
    try {
      const res = await api.get(ep, { signal } as any);
      const arr = unwrapCategories(res);
      if (arr.length) return arr;
      // Bazı backend’ler “success: true ama dizi boş” döndürebilir; o durumda diğer endpoint’e geçmek anlamsız.
      // Ama burada arr boşsa yine de fallback’i deniyoruz; zarar değil.
    } catch (e: any) {
      const status = e?.response?.status;

      // /admin/categories 404 veriyorsa zaten biliyoruz; bir sonraki endpoint’e geç
      if (status === 404) continue;

      // 401/403 public sayfada normal olabilir; direkt boş dön
      if (status === 401 || status === 403) return [];

      // Diğer hatalarda da public UI’ı kilitlemeyelim
      return [];
    }
  }

  return [];
}

/**
 * Turn filters into a flat params object that:
 * - skips null/undefined/empty-string
 * - serializes arrays as key[index]=value
 * - serializes objects as JSON string
 * - flattens featureFilters to featureFilters[i][featureId], featureFilters[i][value]
 */
function buildSafeParams(filters: any, page: number, limit: number) {
  const f = isPlainObject(filters) ? { ...filters } : {};

  // currency normalization (backend bazen sadece currency bekler)
  if (f.priceCurrency && !f.currency) f.currency = f.priceCurrency;

  // min/max normalization (ters girilirse backend bazen patlıyor)
  const minP = typeof f.minPrice === "number" ? f.minPrice : undefined;
  const maxP = typeof f.maxPrice === "number" ? f.maxPrice : undefined;
  if (typeof minP === "number" && typeof maxP === "number" && minP > maxP) {
    f.minPrice = maxP;
    f.maxPrice = minP;
  }

  const params: Record<string, any> = { page, limit };

  // featureFilters özel flatten
  const ff = f.featureFilters;
  if (Array.isArray(ff)) {
    delete f.featureFilters;
    ff.forEach((item: any, index: number) => {
      if (!item) return;
      const featureId = item.featureId ?? item.id ?? item._id;
      const value = item.value;

      if (featureId !== undefined && featureId !== null && String(featureId).trim() !== "") {
        params[`featureFilters[${index}][featureId]`] = String(featureId);
      }

      const cleanedVal = cleanValue(value);
      if (cleanedVal !== undefined) {
        params[`featureFilters[${index}][value]`] =
          isPlainObject(cleanedVal) || Array.isArray(cleanedVal) ? JSON.stringify(cleanedVal) : cleanedVal;
      }
    });
  } else if (isPlainObject(ff)) {
    delete f.featureFilters;
    const entries = Object.entries(ff);
    entries.forEach(([featureId, value], index) => {
      if (!featureId || featureId.trim() === "") return;

      params[`featureFilters[${index}][featureId]`] = featureId;
      const cleanedVal = cleanValue(value);
      if (cleanedVal !== undefined) {
        params[`featureFilters[${index}][value]`] =
          isPlainObject(cleanedVal) || Array.isArray(cleanedVal) ? JSON.stringify(cleanedVal) : cleanedVal;
      }
    });
  }

  // kalan filter alanlarını ekle
  Object.entries(f).forEach(([key, raw]) => {
    const value = cleanValue(raw);
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const v = cleanValue(item);
        if (v === undefined) return;
        params[`${key}[${index}]`] = isPlainObject(v) || Array.isArray(v) ? JSON.stringify(v) : v;
      });
      return;
    }

    if (isPlainObject(value)) {
      params[key] = JSON.stringify(value);
      return;
    }

    params[key] = value;
  });

  return params;
}

export async function searchAdvertsApi<T>({
  page,
  limit,
  filters,
}: {
  page: number;
  limit: number;
  filters: any;
}): Promise<SearchResponse<T[]>> {
  const params = buildSafeParams(filters, page, limit);

  const response = await api.get("/advert/search", {
    params,
    paramsSerializer: (p) => {
      const qs = new URLSearchParams();
      Object.entries(p || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        qs.append(k, String(v));
      });
      return qs.toString();
    },
  });

  return response.data;
}
