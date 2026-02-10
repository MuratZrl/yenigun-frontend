// src/features/admin/users/model/utils.ts

import type {
  CustomerUser,
  NormalizedCustomerUser,
  CustomerPhone,
  UID,
  UsersFiltersState,
} from "./types";

export function safeString(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

export function safeUid(v: any): UID {
  const uid = v?.uid ?? v;
  if (typeof uid === "number") return uid;
  if (typeof uid === "string") return uid;
  return "";
}

export function normalizeProfilePicture(v: any): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string" && v.trim()) return v;
  return undefined;
}

export function normalizeMail(mail: any): string | undefined {
  if (!mail) return undefined;

  // string dönerse direkt
  if (typeof mail === "string") {
    const s = mail.trim();
    return s ? s : undefined;
  }

  // bazen { mail: { mail: "x" } } gibi saçmalıklar geliyor
  // bazen { mail: "x" } da olabilir
  if (typeof mail === "object") {
    const direct = mail?.mail;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const nested = mail?.mail?.mail;
    if (typeof nested === "string" && nested.trim()) return nested.trim();
  }

  return undefined;
}

export function normalizePhones(phones: any): CustomerPhone[] {
  if (!Array.isArray(phones)) return [];

  return phones
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const number = typeof p.number === "string" ? p.number : undefined;
      const isAbleToSendSMS =
        typeof p.isAbleToSendSMS === "boolean" ? p.isAbleToSendSMS : undefined;

      // boş obje dönmesin
      if (!number && isAbleToSendSMS === undefined) return null;

      return { number, isAbleToSendSMS } as CustomerPhone;
    })
    .filter(Boolean) as CustomerPhone[];
}

/**
 * Mevcut projende user.fulladdress çok kullanılmış.
 * Eğer backend farklı alanlar dönüyorsa birleştirme burada.
 */
export function normalizeFullAddress(u: CustomerUser): string | undefined {
  const full = safeString((u as any)?.fulladdress).trim();
  if (full) return full;

  const city = safeString((u as any)?.city).trim();
  const county = safeString((u as any)?.county).trim();
  const neighbourhood = safeString((u as any)?.neighbourhood).trim();
  const address = safeString((u as any)?.address).trim();

  const parts = [city, county, neighbourhood].filter(Boolean);
  const head = parts.join(" / ");
  const combined = [head, address].filter(Boolean).join(" - ").trim();

  return combined ? combined : undefined;
}

export function normalizeCustomer(u: CustomerUser): NormalizedCustomerUser {
  const uid = safeUid(u?.uid);
  const name = safeString(u?.name).trim();
  const surname = safeString(u?.surname).trim();

  const fullName = `${name} ${surname}`.trim();

  return {
    uid,
    name,
    surname,
    fullName,
    profilePicture: normalizeProfilePicture(u?.profilePicture),
    mail: normalizeMail(u?.mail),
    phones: normalizePhones(u?.phones),
    gender: (u?.gender ? String(u.gender) : undefined) as any,
    status: (u?.status ? String(u.status) : undefined) as any,
    fulladdress: normalizeFullAddress(u),
    raw: u,
  };
}

export function normalizeCustomers(list: any[]): NormalizedCustomerUser[] {
  if (!Array.isArray(list)) return [];
  return list.map((u) => normalizeCustomer(u as CustomerUser));
}

/**
 * Basit telefon formatı: +90 / 0 / boşluk vs normalize et.
 * Senin projede formatPhoneNumber util’i vardı, ama burada "search" için normalize lazım.
 */
export function normalizePhoneForSearch(phone: string): string {
  const s = safeString(phone);
  return s.replace(/\D/g, ""); // sadece rakam
}

export function customerMatchesQuery(
  u: NormalizedCustomerUser,
  qRaw: string,
): boolean {
  const q = safeString(qRaw).trim().toLowerCase();
  if (!q) return true;

  const name = safeString(u.name).toLowerCase();
  const surname = safeString(u.surname).toLowerCase();
  const fullName = safeString(u.fullName).toLowerCase();
  const mail = safeString(u.mail).toLowerCase();

  if (name.includes(q) || surname.includes(q) || fullName.includes(q) || mail.includes(q)) {
    return true;
  }

  const qPhone = normalizePhoneForSearch(q);
  if (qPhone) {
    const hasPhone = (u.phones ?? []).some((p) =>
      normalizePhoneForSearch(p.number ?? "").includes(qPhone),
    );
    if (hasPhone) return true;
  }

  return false;
}

/**
 * Senin mevcut sayfadaki filtre modal state’ini kapsayan genel filtre.
 * Boş filtre varsa true döner.
 */
export function customerMatchesFilters(
  u: NormalizedCustomerUser,
  filters: UsersFiltersState,
): boolean {
  if (!filters) return true;

  // fullname
  const fullnameQ = safeString(filters.fullname).trim().toLowerCase();
  if (fullnameQ) {
    const full = safeString(u.fullName).toLowerCase();
    if (!full.includes(fullnameQ)) return false;
  }

  // email
  const emailQ = safeString(filters.email).trim().toLowerCase();
  if (emailQ) {
    const mail = safeString(u.mail).toLowerCase();
    if (!mail.includes(emailQ)) return false;
  }

  // phone
  const phoneQ = normalizePhoneForSearch(filters.phone);
  if (phoneQ) {
    const ok = (u.phones ?? []).some((p) =>
      normalizePhoneForSearch(p.number ?? "").includes(phoneQ),
    );
    if (!ok) return false;
  }

  // gender: senin eski kodda map vardı (erkek/kadın => male/female). Aynısını yapalım.
  const genderQ = safeString(filters.gender).trim().toLowerCase();
  if (genderQ) {
    const map: Record<string, string> = {
      erkek: "male",
      kadın: "female",
      male: "male",
      female: "female",
    };
    const normalized = map[genderQ] ?? genderQ;
    const userGender = safeString(u.gender).toLowerCase();
    if (userGender !== normalized) return false;
  }

  // status
  const statusSel = safeString(filters.status?.selected).trim();
  if (statusSel) {
    const userStatus = safeString(u.status).trim();
    if (userStatus !== statusSel) return false;
  }

  // tc / mernis gibi alanlar normalize edilmedi, raw’dan bakıyoruz
  const tcQ = safeString(filters.turkish_id).trim();
  if (tcQ) {
    const tc = safeString((u.raw as any)?.tcNumber);
    if (!tc.includes(tcQ)) return false;
  }

  const mernisQ = safeString(filters.mernis_no).trim();
  if (mernisQ) {
    const mernis = safeString((u.raw as any)?.mernisNo);
    if (!mernis.includes(mernisQ)) return false;
  }

  const provinceQ = safeString(filters.province).trim().toLowerCase();
  if (provinceQ) {
    const city = safeString((u.raw as any)?.city).toLowerCase();
    if (!city.includes(provinceQ)) return false;
  }

  const districtQ = safeString(filters.district).trim().toLowerCase();
  if (districtQ) {
    const county = safeString((u.raw as any)?.county).toLowerCase();
    if (!county.includes(districtQ)) return false;
  }

  const quarterQ = safeString(filters.quarter).trim().toLowerCase();
  if (quarterQ) {
    const neighbourhood = safeString((u.raw as any)?.neighbourhood).toLowerCase();
    if (!neighbourhood.includes(quarterQ)) return false;
  }

  return true;
}

export function applyCustomerFilters(
  users: NormalizedCustomerUser[],
  filters: UsersFiltersState,
): NormalizedCustomerUser[] {
  if (!Array.isArray(users)) return [];

  const hasAny =
    safeString(filters?.fullname).trim() ||
    safeString(filters?.email).trim() ||
    safeString(filters?.phone).trim() ||
    safeString(filters?.gender).trim() ||
    safeString(filters?.status?.selected).trim() ||
    safeString(filters?.turkish_id).trim() ||
    safeString(filters?.mernis_no).trim() ||
    safeString(filters?.province).trim() ||
    safeString(filters?.district).trim() ||
    safeString(filters?.quarter).trim();

  if (!hasAny) return users;

  return users.filter((u) => customerMatchesFilters(u, filters));
}

export function paginate<T>(rows: T[], page0: number, rowsPerPage: number) {
  const page = Math.max(0, page0);
  const size = Math.max(1, rowsPerPage);

  const startIndex = page * size;
  const endIndex = startIndex + size;

  return {
    startIndex,
    endIndex,
    slice: rows.slice(startIndex, endIndex),
  };
}
