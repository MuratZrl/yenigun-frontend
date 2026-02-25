// src/features/admin/admin-detail/lib/helpers.ts

import type { BirthDate } from "./types";

export function formatBirthDate(date?: BirthDate): string {
  if (!date || date.day === null || date.month === null || date.year === null) {
    return "Belirtilmemiş";
  }
  const d = new Date(date.year, date.month - 1, date.day);
  if (isNaN(d.getTime())) return "Belirtilmemiş";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPhone(gsm?: string): string {
  if (!gsm) return "Belirtilmemiş";
  const cleaned = gsm.replace(/\D/g, "");
  const normalized =
    cleaned.startsWith("0") && cleaned.length === 11
      ? cleaned.substring(1)
      : cleaned;

  if (normalized.length === 10) {
    return `0 (${normalized.slice(0, 3)}) ${normalized.slice(3, 6)} ${normalized.slice(6, 8)} ${normalized.slice(8)}`;
  }
  return gsm;
}

export function getGenderText(gender?: string): string {
  if (gender === "male") return "Erkek";
  if (gender === "female") return "Kadın";
  return "Belirtilmemiş";
}

export function getRoleLabel(roleRaw?: string): string {
  const role = (roleRaw || "").toLowerCase().trim();
  switch (role) {
    case "head_admin":
      return "Baş Yetkili";
    case "admin":
      return "Yetkili";
    case "moderator":
      return "Moderatör";
    case "editor":
      return "Editör";
    default:
      return roleRaw || "Bilinmiyor";
  }
}

export function getRoleBadgeClass(roleRaw?: string): string {
  const role = (roleRaw || "").toLowerCase().trim();
  switch (role) {
    case "head_admin":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "moderator":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "editor":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function formatCreatedAt(dateStr?: string): string {
  if (!dateStr) return "Belirtilmemiş";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Belirtilmemiş";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
