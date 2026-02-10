// src/features/admin/admins/model/utils.ts

import type { AdminUser, AdminUserRole, Gender, BirthDate } from "./types";

export function normalizeText(input: unknown): string {
  return String(input ?? "")
    .trim()
    .toLowerCase();
}

export function getUserDisplayName(user: Pick<AdminUser, "name" | "surname">): string {
  const name = String(user.name ?? "").trim();
  const surname = String(user.surname ?? "").trim();
  return `${name}${name && surname ? " " : ""}${surname}`.trim();
}

export function getAvatarLetter(name: string): string {
  const s = String(name ?? "").trim();
  return (s[0] ?? "?").toUpperCase();
}

export function genderToTR(gender?: Gender): string {
  const g = normalizeText(gender);
  if (g === "male") return "Erkek";
  if (g === "female") return "Kadın";
  if (!g) return "-";
  return String(gender);
}

export function formatBirth(birth?: BirthDate): string {
  if (!birth) return "-";
  const d = Number(birth.day);
  const m = Number(birth.month);
  const y = Number(birth.year);
  if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) return "-";
  return `${d}/${m}/${y}`;
}

export function roleBadgeClass(role?: AdminUserRole): string {
  const r = normalizeText(role);
  if (r === "admin") return "bg-purple-100 text-purple-800 border-purple-200";
  if (r === "moderator") return "bg-blue-100 text-blue-800 border-blue-200";
  if (r === "editor") return "bg-green-100 text-green-800 border-green-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
}

export function matchesUserQuery(user: AdminUser, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;

  const hay = [
    user.name,
    user.surname,
    user.mail,
    user.gsmNumber,
    getUserDisplayName(user),
    user.uid,
  ]
    .map(normalizeText)
    .join(" ");

  return hay.includes(q);
}

export function filterUsers(users: AdminUser[], query: string): AdminUser[] {
  const q = normalizeText(query);
  if (!q) return users;
  return users.filter((u) => matchesUserQuery(u, q));
}

export function paginate<T>(items: T[], page: number, rowsPerPage: number) {
  const safeRows = Math.max(1, Number(rowsPerPage) || 1);
  const safePage = Math.max(0, Number(page) || 0);

  const startIndex = safePage * safeRows;
  const endIndex = startIndex + safeRows;

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeRows));

  const clampedPage = Math.min(safePage, totalPages - 1);
  const clampedStart = clampedPage * safeRows;
  const clampedEnd = clampedStart + safeRows;

  return {
    page: clampedPage,
    rowsPerPage: safeRows,
    totalItems,
    totalPages,
    startIndex: clampedStart,
    endIndex: Math.min(clampedEnd, totalItems),
    slice: items.slice(clampedStart, clampedEnd),
  };
}
