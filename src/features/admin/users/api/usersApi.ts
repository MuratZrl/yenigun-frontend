// src/features/admin/users/api/usersApi.ts

import api from "@/lib/api";
import type { AxiosResponse } from "axios";

/**
 * Bu feature "admin/users" = MÜŞTERİLER (customers) sayfası için.
 * Admin yetkilileri için olan /admin/users endpoint'iyle karıştırma.
 */

export type CustomerUser = {
  uid: string | number;
  name?: string;
  surname?: string;
  profilePicture?: string | null;

  // Backend bazen { mail: { mail: string } } gibi dönüyor
  mail?: { mail?: string } | string;

  phones?: Array<{
    number?: string;
    isAbleToSendSMS?: boolean;
  }>;

  gender?: string;
  status?: string;

  // diğer alanlar serbest
  [key: string]: any;
};

export type CustomersListParams = {
  page?: number; // backend 1-based bekliyor
  limit?: number;
  sortBy?: string; // örn: "created"
  sortOrder?: "asc" | "desc";
};

export type NoteSearchParams = {
  note: string;
  page?: number; // backend 1-based
  limit?: number;
};

export type DeleteCustomerPayload = {
  uid: string | number;
};

export type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
};

function unwrap<T>(res: AxiosResponse<any>): T {
  const d = res?.data;
  if (d && typeof d === "object") {
    // Bazı endpointler { data: ... } sarıyor, bazıları direkt dönüyor
    if ("data" in d) return d.data as T;
    return d as T;
  }
  return d as T;
}

function safeUid(u: any): string | number {
  const v = u?.uid;
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  return "";
}

function safeArray<T>(val: any): T[] {
  return Array.isArray(val) ? (val as T[]) : [];
}

export async function listCustomers(params: CustomersListParams = {}) {
  const {
    page = 1,
    limit = 100,
    sortBy = "created",
    sortOrder = "desc",
  } = params;

  const res = await api.get<ApiEnvelope<CustomerUser[]>>(
    `/admin/customers?page=${page}&limit=${limit}&sortBy=${encodeURIComponent(
      sortBy,
    )}&sortOrder=${encodeURIComponent(sortOrder)}`,
  );

  const data = unwrap<CustomerUser[] | ApiEnvelope<CustomerUser[]>>(res);

  // unwrap sonrası bazen liste, bazen envelope gelebilir
  const list = Array.isArray(data) ? data : safeArray<CustomerUser>(data?.data);

  return {
    raw: res.data,
    rows: list,
  };
}

export async function listAllCustomers(options?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  maxPages?: number;
}) {
  const limit = options?.limit ?? 100;
  const sortBy = options?.sortBy ?? "created";
  const sortOrder = options?.sortOrder ?? "desc";
  const maxPages = options?.maxPages ?? 200;

  let all: CustomerUser[] = [];
  let page = 1;
  let lastFirstUid: string | number | null = null;

  while (page <= maxPages) {
    const { rows } = await listCustomers({ page, limit, sortBy, sortOrder });

    if (!rows.length) break;

    const firstUid = safeUid(rows[0]) || null;

    // Backend pagination bozulduğunda aynı sayfayı tekrar döndürüyordu, sen de bunu yaşamışsın.
    if (page > 1 && firstUid && lastFirstUid && firstUid === lastFirstUid) {
      console.warn("Pagination bozuk: aynı sayfa tekrar geldi. Break.");
      break;
    }
    lastFirstUid = firstUid;

    all = all.concat(rows);

    // Son sayfa
    if (rows.length < limit) break;

    page += 1;
  }

  return all;
}

export async function searchCustomersByNote(params: NoteSearchParams) {
  const note = (params.note ?? "").trim();
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;

  if (!note) {
    return {
      raw: null,
      rows: [] as CustomerUser[],
    };
  }

  const res = await api.get<ApiEnvelope<CustomerUser[]>>(
    `/admin/customers/note-search?note=${encodeURIComponent(note)}&page=${page}&limit=${limit}`,
  );

  const data = unwrap<CustomerUser[] | ApiEnvelope<CustomerUser[]>>(res);
  const rows = Array.isArray(data) ? data : safeArray<CustomerUser>(data?.data);

  return {
    raw: res.data,
    rows,
  };
}

export async function deleteCustomer(payload: DeleteCustomerPayload) {
  const uid = payload?.uid;
  if (uid === undefined || uid === null || uid === "") {
    throw new Error("deleteCustomer: uid zorunlu");
  }

  const res = await api.post<ApiEnvelope<{ ok?: boolean }>>(
    "/admin/delete-customer",
    { uid },
  );

  return {
    raw: res.data,
    message: res.data?.message ?? "Silindi",
    success: Boolean(res.data?.success ?? true),
  };
}

/**
 * İstersen tek noktadan import kolaylığı:
 * import { usersApi } from "@/features/admin/users"
 */
export const usersApi = {
  listCustomers,
  listAllCustomers,
  searchCustomersByNote,
  deleteCustomer,
};
