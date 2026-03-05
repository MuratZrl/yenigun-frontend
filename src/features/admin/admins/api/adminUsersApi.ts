// src/features/admin/admins/api/adminUsersApi.ts
import api from "@/lib/api";
import type { AdminUser } from "../model/types";

export type ListAdminsParams = {
  page?: number;
  limit?: number;
};

export type ListAdminsResponse = {
  data: AdminUser[];
  total?: number;
  page?: number;
  limit?: number;
};

function normalizeArray<T>(maybe: any): T[] {
  if (Array.isArray(maybe)) return maybe as T[];
  if (Array.isArray(maybe?.data)) return maybe.data as T[];
  return [];
}

export const adminUsersApi = {
  /**
   * Admin kullanıcıları getirir.
   * Backend bazen { data: [...] } bazen direkt [...] döndürebiliyor.
   * O yüzden normalize ediyoruz.
   */
  async listAdmins(params: ListAdminsParams = {}): Promise<ListAdminsResponse> {
    const { page, limit } = params;

    const res = await api.get("/admin/users", {
      params: {
        ...(typeof page === "number" ? { page } : {}),
        ...(typeof limit === "number" ? { limit } : {}),
      },
    });

    const users = normalizeArray<AdminUser>(res.data);

    // Eğer backend meta döndürüyorsa al, yoksa sadece liste ver.
    const total =
      typeof res.data?.total === "number"
        ? res.data.total
        : typeof res.data?.count === "number"
          ? res.data.count
          : undefined;

    const outPage =
      typeof res.data?.page === "number" ? res.data.page : page ?? undefined;

    const outLimit =
      typeof res.data?.limit === "number" ? res.data.limit : limit ?? undefined;

    return { data: users, total, page: outPage, limit: outLimit };
  },

  /**
   * Admin siler.
   * Mevcut projedeki eski kod: POST /admin/delete-admin { uid }
   */
  async deleteAdmin(uid: number): Promise<{ message?: string }> {
    const res = await api.post("/admin/delete-admin", { uid });
    return (res.data ?? {}) as { message?: string };
  },

  /**
   * Admin oluşturma (modal kullanıyorsun ya, muhtemelen lazım olacak).
   * Endpoint adını backend'e göre doğrula.
   * Projede modal içinde farklı endpoint varsa bunu ona göre değiştir.
   */
  async createAdmin(payload: {
    name: string;
    surname: string;
    mail: string;
    gsmNumber: string;
    password: string;
    role: string;
    image?: string;
    birthDate?: string;
    gender?: "male" | "female" | string;
  }): Promise<any> {
    // Projede CreateAdminModal hangi endpoint'i vuruyor olabilir: /admin/create-admin vs /admin/create-user vs ...
    // Şimdilik "create-admin" varsayıyorum.
    const res = await api.post("/admin/create-admin", payload);
    return res.data;
  },

  /**
   * Admin güncelleme.
   * Endpoint adını backend'e göre doğrula.
   */
  async updateAdmin(payload: {
    uid: number;
    name?: string;
    surname?: string;
    mail?: string;
    gsmNumber?: string;
    role?: string;
    image?: string;
    birthDate?: string;
    gender?: "male" | "female" | string;
    password?: string;
  }): Promise<any> {
    // Şimdilik "update-admin" varsayıyorum.
    const res = await api.post("/admin/update-admin", payload);
    return res.data;
  },

  /**
   * Profil fotoğrafı yükler.
   * Backend endpoint: POST /admin/upload-user-image (multipart/form-data)
   * Response: { success, status, message, data: { profilePicture, ... } }
   */
  async uploadProfileImage(uid: number, file: File): Promise<{ profilePicture?: string }> {
    const formData = new FormData();
    formData.append("uid", String(uid));
    formData.append("image", file);
    const res = await api.post("/admin/upload-user-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Backend returns { data: { profilePicture, ... } }
    return res.data?.data ?? res.data;
  },

  /**
   * Profil fotoğrafını kaldırır.
   * Backend'de henüz dedicated endpoint yok,
   * ileride eklenirse burası güncellenecek.
   */
  async removeProfileImage(uid: number): Promise<{ message?: string }> {
    const res = await api.post("/admin/remove/user-image", { uid });
    return res.data;
  },
};
