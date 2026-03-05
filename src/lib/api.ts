// src/lib/api.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * .env.local: NEXT_PUBLIC_BACKEND_API=/backend
 * next.config.* rewrites: /backend -> <backend host>
 *
 * Bu client odaklı bir axios instance’ı. Server-side import edilirse relative baseURL sorun çıkarır.
 */

const RAW_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_API || "").trim();
const BASE_URL = RAW_BASE_URL || "/backend";

// Debug’u env ile aç: NEXT_PUBLIC_API_DEBUG=1
const DEBUG = (process.env.NEXT_PUBLIC_API_DEBUG || "").trim() === "1";

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Cookie okuma (client-side). HttpOnly ise zaten okunamaz.
 */
function getCookieValue(name: string): string | null {
  if (!isBrowser()) return null;
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return m?.[1] ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Token kaynağı:
 * 1) cookie token
 * 2) localStorage token (fallback)
 */
function getClientToken(): string | null {
  if (!isBrowser()) return null;

  const c = getCookieValue("token");
  if (c) return c;

  try {
    const ls = window.localStorage.getItem("token");
    return ls || null;
  } catch {
    return null;
  }
}

/**
 * URL + params debug string (log için)
 */
function buildUrlWithParams(baseURL: string, url: string, params: unknown): string {
  const full = `${baseURL || ""}${url || ""}`;
  if (!params || typeof params !== "object") return full;

  try {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      if (v === null) qs.append(k, "null");
      else if (Array.isArray(v)) v.forEach((vv) => qs.append(k, String(vv)));
      else if (typeof v === "object") qs.append(k, "[object]");
      else qs.append(k, String(v));
    }
    const s = qs.toString();
    return s ? `${full}?${s}` : full;
  } catch {
    return full;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Cookie gerekmese bile zarar vermez, same-origin proxy’de sorun çıkarmaz.
  timeout: 30_000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Server-side yanlış import edilirse relative baseURL patlatır.
    if (!isBrowser()) {
      if (String(config.baseURL || "").startsWith("/")) {
        throw new Error(
          `api.ts server-side çalıştırıldı ama baseURL relative: "${config.baseURL}". ` +
            `Bu client tarafında kullanılmalı veya server için absolute baseURL verilmelidir.`
        );
      }
      return config;
    }

    // RAW env boşsa uyar (BASE_URL fallback yüzünden hep dolu olur).
    if (!RAW_BASE_URL && DEBUG) {
      console.warn(
        "NEXT_PUBLIC_BACKEND_API set değil. Fallback /backend kullanılıyor. (Bu normal olabilir.)"
      );
    }

    // Header objesini garanti et: AxiosHeaders üzerinden set etmek en sağlamı.
    const headers = AxiosHeaders.from(config.headers);

    // Token varsa Bearer ekle (backend’in beklediği tam olarak bu).
    const token = getClientToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      if (DEBUG) console.info("api -> Authorization set:", token.slice(0, 8) + "…");
    } else {
      if (DEBUG) console.info("api -> token yok, Authorization set edilmedi");
    }

    // Content-Type: Axios zaten çoğu şeyde doğru set eder.
    // FormData’da asla set etme (boundary bozulur).
    const method = (config.method || "get").toLowerCase();
    const data = (config).data;

    const hasBody = method !== "get" && method !== "delete" && data !== undefined && data !== null;
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

    if (hasBody && !isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const ax = err as AxiosError;
      const status = ax.response?.status;
      const method = (ax.config?.method || "").toUpperCase();
      const baseURL = ax.config?.baseURL || "";
      const url = ax.config?.url || "";
      const params = (ax.config)?.params;
      const fullUrl = buildUrlWithParams(baseURL, url, params);

      if (DEBUG) {
        console.error("📤 Axios:", `${method} ${fullUrl}`);
        console.error("📤 Status:", status ?? "(no response)");
        console.error("📤 Message:", ax.message);
        if (ax.response) console.error("📤 Resp:", ax.response.data);
      }

      return Promise.reject(err);
    }

    if (DEBUG) console.error("📤 Non-Axios error:", err);
    return Promise.reject(err);
  }
);

export default api;
