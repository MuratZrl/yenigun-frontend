// src/features/admin/emlak-create/api/emlakCreateApi.ts

import api from "@/lib/api";
import type { Category } from "@/types/category";
import type Customer from "@/types/customers";
import type { Advisor } from "@/types/advert";

type IdLike = string | number;

const ENDPOINTS = {
  categoriesList: "/admin/categories",
  customers: "/admin/customers",
  advisors: "/admin/users",
  createAdvert: "/admin/create-advert",
  uploadImages: "/admin/upload-advert-images",
  uploadVideo: "/admin/upload-advert-video",
} as const;

type AnyObj = Record<string, any>;

function isPlainObject(v: any): v is AnyObj {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * AxiosResponse verildiğinde res.data'ya iner, düz payload verildiğinde olduğu gibi bırakır.
 */
function unwrapAxios<T = any>(input: any): T {
  if (isPlainObject(input) && "data" in input && Object.keys(input).length) {
    return (input as any).data as T;
  }
  return input as T;
}

/**
 * Backend bazen:
 * - [ ... ]
 * - { data: [ ... ] }
 * - { data: { data: [ ... ] } }
 * - { success: true, data: [ ... ] }
 * - { items: [ ... ] }
 * - { result: [ ... ] }
 * - { categories: [ ... ] }
 * gibi döndürüyor. Bu yüzden tek bir “derin unwrap” yapıyoruz.
 */
function deepUnwrap(input: any): any {
  let cur = unwrapAxios(input);

  for (let i = 0; i < 5; i++) {
    if (Array.isArray(cur)) return cur;
    if (!isPlainObject(cur)) return cur;

    if (Array.isArray(cur.data)) return cur.data;
    if (Array.isArray(cur.items)) return cur.items;
    if (Array.isArray(cur.result)) return cur.result;
    if (Array.isArray(cur.categories)) return cur.categories;

    if ("data" in cur) {
      cur = cur.data;
      continue;
    }

    if ("items" in cur) {
      cur = cur.items;
      continue;
    }

    if ("result" in cur) {
      cur = cur.result;
      continue;
    }

    if ("categories" in cur) {
      cur = cur.categories;
      continue;
    }

    return cur;
  }

  return cur;
}

function extractArray<T>(input: any): T[] {
  const maybe = deepUnwrap(input);
  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

function getHttpStatus(e: any): number | undefined {
  return e?.response?.status;
}

function getErrorMessage(e: any, fallback: string) {
  const status = getHttpStatus(e);
  if (status === 401) return "Yetkisiz (401). Oturum/token sorunu var.";
  if (status === 403) return "Erişim yok (403). Yetki sorunu var.";
  if (status === 404) return "Endpoint bulunamadı (404). Route yanlış.";
  return fallback;
}

/**
 * Kategori listesi.
 * Not: Normalizasyonu burada minimumda tutuyoruz; UI tarafında ayrıca _id/name doğrulayabilirsiniz.
 */
export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  try {
    const res = await api.get(ENDPOINTS.categoriesList, { signal } as any);
    return extractArray<Category>(res);
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "Kategoriler yüklenemedi."));
  }
}

/**
 * Sayfalı endpointleri “güvenli” şekilde gez.
 * Güvenlik freni: maxPages ve limit kontrolü ile sonsuz döngü riskini azaltır.
 */
async function fetchPaged<T>(
  url: string,
  opts?: {
    limit?: number;
    startPage?: number;
    maxPages?: number;
    signal?: AbortSignal;
    params?: Record<string, any>;
  }
): Promise<T[]> {
  const limit = opts?.limit ?? 100;
  const startPage = opts?.startPage ?? 1;
  const maxPages = opts?.maxPages ?? 200;
  const signal = opts?.signal;
  const extraParams = opts?.params ?? {};

  let page = startPage;
  const all: T[] = [];

  for (let guard = 0; guard < maxPages; guard++) {
    const res = await api.get(url, {
      signal,
      params: { page, limit, ...extraParams },
    } as any);

    const items = extractArray<T>(res);

    if (!items.length) break;

    all.push(...items);

    if (items.length < limit) break;

    page += 1;
  }

  return all;
}

export async function fetchAllCustomers(signal?: AbortSignal): Promise<Customer[]> {
  try {
    return await fetchPaged<Customer>(ENDPOINTS.customers, { limit: 100, signal });
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "Müşteriler yüklenemedi."));
  }
}

export async function fetchAllAdvisors(signal?: AbortSignal): Promise<Advisor[]> {
  try {
    return await fetchPaged<Advisor>(ENDPOINTS.advisors, { limit: 100, signal });
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "Danışmanlar yüklenemedi."));
  }
}

/**
 * İlan oluşturma.
 * requestData'nın şekli backend'e bağlı; burada bilinçli olarak generic bırakıyoruz.
 */
export async function createAdvert<TResponse = any>(requestData: Record<string, any>, signal?: AbortSignal) {
  try {
    return await api.post<TResponse>(ENDPOINTS.createAdvert, requestData, { signal } as any);
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "İlan oluşturma başarısız."));
  }
}

function buildFormData(pairs: Array<[string, string | Blob]>) {
  const fd = new FormData();
  for (const [k, v] of pairs) fd.append(k, v);
  return fd;
}

export async function uploadAdvertImages(uid: IdLike, images: File[], signal?: AbortSignal) {
  try {
    const formData = buildFormData([
      ["uid", String(uid)],
      ...images.map((f) => ["images", f] as [string, string | Blob]),
    ]);

    return await api.post(ENDPOINTS.uploadImages, formData, {
      signal,
      headers: { "Content-Type": "multipart/form-data" },
    } as any);
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "Fotoğraf yükleme başarısız."));
  }
}

export async function uploadAdvertVideo(uid: IdLike, video: File, signal?: AbortSignal) {
  try {
    const formData = buildFormData([
      ["uid", String(uid)],
      ["video", video],
    ]);

    return await api.post(ENDPOINTS.uploadVideo, formData, {
      signal,
      headers: { "Content-Type": "multipart/form-data" },
    } as any);
  } catch (e: any) {
    throw new Error(getErrorMessage(e, "Video yükleme başarısız."));
  }
}
