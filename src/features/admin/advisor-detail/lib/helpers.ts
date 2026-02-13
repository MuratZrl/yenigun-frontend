// src/features/admin/advisor-detail/lib/helpers.ts

export function formatBirthDate(date?: {
  day: number | null;
  month: number | null;
  year: number | null;
}): string {
  if (!date || date.day === null || date.month === null || date.year === null) {
    return "Belirtilmemiş";
  }
  const formatted = new Date(date.year, date.month - 1, date.day);
  if (isNaN(formatted.getTime())) return "Belirtilmemiş";
  return formatted.toLocaleDateString("tr-TR");
}

export function formatPhone(gsm: string): string {
  if (!gsm) return "";
  return gsm.startsWith("0") ? gsm : "0" + gsm;
}

export function getGenderText(gender: "male" | "female"): string {
  return gender === "male" ? "Erkek" : "Kadın";
}

export function getRoleText(role: "head_admin" | "advisor"): string {
  return role === "head_admin" ? "Yönetici" : "Danışman";
}

export function getRoleBadgeClass(role: "head_admin" | "advisor"): string {
  return role === "head_admin"
    ? "bg-purple-100 text-purple-800"
    : "bg-blue-100 text-blue-800";
}