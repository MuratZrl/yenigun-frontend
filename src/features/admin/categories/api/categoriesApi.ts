// src/features/admin/categories/api/categoriesApi.ts
import api from "@/lib/api";
import type { Category } from "@/types/category";

type ApiListResponse<T> = { data?: T; success?: boolean; status?: number };

function unwrapArray<T>(res: any): T[] {
  const maybe = res?.data?.data ?? res?.data ?? res;
  return Array.isArray(maybe) ? maybe : [];
}

// Backend sende /admin/categories için 404 dönüyor.
// Curl'de var görünen route: /admin/categories (401 ile auth istiyor).
export async function fetchAdminCategories(): Promise<Category[]> {
  const res = await api.get<ApiListResponse<Category[]>>("/admin/categories");
  return unwrapArray<Category>(res);
}
