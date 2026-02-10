// src/features/ads/server/adverts.server.ts
import "server-only";
import { getRequestOrigin } from "@/lib/server/origin";

type ApiEnvelope<T> = {
  data?: T | { data?: T };
  success?: boolean;
  message?: string;
};

function stripTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

async function getBackendBaseUrl(): Promise<string> {
  const raw = (process.env.NEXT_PUBLIC_BACKEND_API || "/backend").trim();

  // Absolute verilmişse aynen kullan
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return stripTrailingSlash(raw);
  }

  // Relative ise origin ile birleştir
  const origin = await getRequestOrigin();
  const rel = raw.startsWith("/") ? raw : `/${raw}`;
  return stripTrailingSlash(`${origin}${rel}`);
}

async function fetchJson<T>(path: string): Promise<T> {
  const base = await getBackendBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, { cache: "no-store" });

  console.log("[fetchJson]", { url, status: res.status });

  const json = (await res.json()) as any;
  const data = (json?.data?.data ?? json?.data ?? json) as T;

  console.log("[fetchJson] keys:", Object.keys((data as any) ?? {}));
  console.log("[fetchJson] details keys:", Object.keys(((data as any)?.details ?? {}) as any));
  console.log("[fetchJson] featureValues length:", ((data as any)?.featureValues ?? []).length);

  return data;
}

export async function getAdvert(uid: string) {
  return fetchJson<any>(`/advert/adverts/${encodeURIComponent(uid)}`);
}

export async function getSimilarAdverts(uid: string, page = 1, limit = 12) {
  return fetchJson<any[]>(
    `/advert/adverts/${encodeURIComponent(uid)}/similar?page=${page}&limit=${limit}`,
  );
}
