// src/features/admin/categories/lib/api.ts

import api from "@/lib/api";

export const CategoryAPI = {
  getTree: () => api.get("/admin/categories/tree"),

  createCategory: (name: string, parentUid?: number) =>
    api.post("/admin/categories", parentUid ? { name, parentUid } : { name }),

  updateCategory: (uid: number, name: string) =>
    api.put(`/admin/categories/${uid}`, { name }),

  deleteCategory: (uid: number) =>
    api.delete(`/admin/categories/${uid}`),

  addAttribute: (
    categoryUid: number,
    attr: { name: string; type: string; options: string[]; required: boolean }
  ) => api.post("/admin/categories/attributes/add", { categoryUid, ...attr }),

  removeAttribute: (categoryUid: number, attributeId: string) =>
    api.delete("/admin/categories/attributes/remove", {
      data: { categoryUid, attributeId },
    }),

  addFacility: (
    categoryUid: number,
    facility: { title: string; features: string[] }
  ) => api.post("/admin/categories/facilities/add", { categoryUid, facility }),

  removeFacility: (categoryUid: number, facilityTitle: string) =>
    api.delete("/admin/categories/facilities/remove", {
      data: { categoryUid, title: facilityTitle },
    }),
};