// src/lib/auth.ts
"use client";

import axios from "axios";
import api from "./api";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  link: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    access_token?: string;
    user: IUser;
  };
  message?: string;
}

export interface AuthData {
  access_token?: string;
  user: IUser;
}

const isClient = () => typeof window !== "undefined";
const TOKEN_COOKIE = "token";
const USER_KEY = "user";

const setClientToken = (token: string, days = 30) => {
  if (!isClient() || !token) return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; ${expires}; path=/; SameSite=Lax${secure}`;
};

const getCookieValue = (name: string) => {
  if (!isClient()) return null;
  try {
    const cookieStr = document.cookie || "";
    const parts = cookieStr.split("; ").filter(Boolean);
    const match = parts.find((c) => c.startsWith(`${name}=`));
    if (!match) return null;
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return null;
  }
};

export const getClientToken = () => getCookieValue(TOKEN_COOKIE);

export const removeClientToken = () => {
  if (!isClient()) return;
  document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

export const setClientUser = (user: IUser) => {
  if (!isClient()) return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
};

export const getClientUser = (): IUser | null => {
  if (!isClient()) return null;
  try {
    const s = localStorage.getItem(USER_KEY);
    return s ? (JSON.parse(s) as IUser) : null;
  } catch {
    return null;
  }
};

export const removeClientUser = () => {
  if (!isClient()) return;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {}
};

export const setAuthData = (data: AuthData) => {
  if (data.access_token) setClientToken(data.access_token);
  if (data.user) setClientUser(data.user);
};

function normalizeToken(payload: any): string | null {
  const t =
    payload?.data?.token ??
    payload?.data?.access_token ??
    payload?.data?.accessToken ??
    payload?.token ??
    payload?.access_token ??
    null;

  return typeof t === "string" && t.trim() ? t.trim() : null;
}

function normalizeUser(payload: any): IUser | null {
  const u =
    payload?.data?.user ??
    payload?.user ??
    payload?.data?.data?.user ??
    null;

  return u ? (u as IUser) : null;
}

export const loginUser = async (
  mail: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const res = await api.post("/user/login", { mail, password });
    const payload = res?.data;

    if (!payload?.success) {
      return {
        success: false,
        message: payload?.message || "Giriş başarısız oldu",
      };
    }

    const token = normalizeToken(payload);
    let user = normalizeUser(payload);

    // Login response has no user object — extract from JWT payload
    if (!user && token) {
      try {
        const base64Payload = token.split(".")[1];
        const decoded = JSON.parse(atob(base64Payload));
        if (decoded?.uid || decoded?.name) {
          user = {
            _id: String(decoded.uid ?? ""),
            name: [decoded.name, decoded.surname].filter(Boolean).join(" "),
            email: "",
            link: "",
          };
        }
      } catch {
        // JWT decode failed, try auth endpoint as fallback
      }
    }

    // Fallback: try /user/auth endpoint
    if (!user) {
      try {
        if (token) setClientToken(token);
        const authRes = await api.get("/user/auth");
        const authPayload = authRes?.data;
        user =
          normalizeUser(authPayload) ??
          (authPayload?.data?.user as IUser) ??
          null;
      } catch {
        // auth da patlarsa aşağıda fail döneriz
      }
    }

    // Token varsa client cookie'ye yaz
    if (token) setClientToken(token);

    if (!user) {
      return {
        success: false,
        message: "Sunucudan kullanıcı verisi alınamadı (auth doğrulanamadı)",
      };
    }

    return {
      success: true,
      data: { access_token: token ?? undefined, user },
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401)
        return {
          success: false,
          message: "Kullanıcı adı veya şifre hatalı",
        };
      return {
        success: false,
        message:
          (err.response?.data as any)?.message ||
          err.message ||
          "Bir hata oluştu",
      };
    }
    return { success: false, message: "Beklenmeyen bir hata oluştu" };
  }
};

export const logoutUser = () => {
  removeClientToken();
  removeClientUser();
  if (isClient()) window.location.href = "/login";
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await api.get("/user/auth");
    const ok = Boolean(res?.data?.success);

    if (ok) {
      const user =
        normalizeUser(res.data) ?? res.data?.data?.user ?? null;
      if (user) setClientUser(user);
    }

    return ok;
  } catch (e: any) {
    if (e?.response?.status === 401) {
      removeClientToken();
      removeClientUser();
    }
    return false;
  }
};