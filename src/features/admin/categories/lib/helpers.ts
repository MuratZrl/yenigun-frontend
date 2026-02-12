// src/features/admin/categories/lib/helpers.ts

import type { CategoryNode } from "./types";

export function countDescendants(node: CategoryNode): number {
  let count = node.children.length;
  for (const c of node.children) count += countDescendants(c);
  return count;
}

export function getAttrTypeLabel(type: string): string {
  const map: Record<string, string> = {
    TEXT: "Metin",
    SELECT: "Tek Seçim",
    CHECKBOX: "Çoklu Seçim",
    NUMBER: "Sayı",
    BOOLEAN: "Evet/Hayır",
    text: "Metin",
    single_select: "Tek Seçim",
    multi_select: "Çoklu Seçim",
    number: "Sayı",
    boolean: "Evet/Hayır",
  };
  return map[type] || type;
}

export function errMsg(err: any): string {
  return (
    err?.response?.data?.message ||
    (err?.response?.status === 401
      ? "Yetkisiz (401)"
      : err?.message || "Bir hata oluştu")
  );
}