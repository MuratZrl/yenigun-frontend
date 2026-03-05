// src/features/admin/admin-detail/hooks/useAdminDetailController.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { getClientToken } from "@/lib/auth";
import { adminUsersApi } from "@/features/admin/admins/api/adminUsersApi";
import type { AdminDetailUser } from "../lib/types";

function getUidFromToken(): string | null {
  try {
    const token = getClientToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.uid != null ? String(payload.uid) : null;
  } catch {
    return null;
  }
}

function normalizeArray<T>(maybe: unknown): T[] {
  if (Array.isArray(maybe)) return maybe as T[];
  if (maybe && typeof maybe === "object" && "data" in maybe && Array.isArray((maybe as { data: unknown }).data)) {
    return (maybe as { data: T[] }).data;
  }
  return [];
}

export function useAdminDetailController() {
  const router = useRouter();
  const params = useParams();
  const uid = params.uid as string;

  const [admin, setAdmin] = useState<AdminDetailUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          router.push("/login");
          return;
        }

        // Backend'de tekil admin endpoint'i yok, listeyi çekip uid ile filtreliyoruz
        const res = await api.get("/admin/users");
        const users = normalizeArray<AdminDetailUser>(res.data);
        const found = users.find((u) => String(u.uid) === String(uid));

        if (!found) {
          setError("Yetkili bulunamadı");
          return;
        }

        setAdmin(found);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Veri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchAdmin();
  }, [uid, router]);

  const goBack = useCallback(() => {
    router.push("/admin/admins");
  }, [router]);

  const handleEmail = useCallback(() => {
    if (admin?.mail) {
      window.open(`mailto:${admin.mail}`, "_blank");
    }
  }, [admin]);

  const handleCall = useCallback(() => {
    if (admin?.gsmNumber) {
      const cleaned = admin.gsmNumber.replace(/\D/g, "");
      const phone = cleaned.startsWith("0") ? cleaned : "0" + cleaned;
      window.open(`tel:${phone}`, "_blank");
    }
  }, [admin]);

  const handleUploadImage = useCallback(async (file: File) => {
    if (!admin) return;
    try {
      setUploading(true);
      const res = await adminUsersApi.uploadProfileImage(admin.uid, file);
      const newUrl = res?.profilePicture ?? URL.createObjectURL(file);
      setAdmin((prev) => prev ? { ...prev, profilePicture: newUrl } : prev);
      toast.success("Profil fotoğrafı güncellendi");
    } catch (err) {
      console.error("Profile image upload error:", err);
      toast.error("Fotoğraf yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  }, [admin]);

  const handleRemoveImage = useCallback(async () => {
    if (!admin) return;
    try {
      setUploading(true);
      await adminUsersApi.removeProfileImage(admin.uid);
      setAdmin((prev) => prev ? { ...prev, profilePicture: null } : prev);
      toast.success("Profil fotoğrafı kaldırıldı");
    } catch (err) {
      console.error("Profile image remove error:", err);
      toast.error("Fotoğraf kaldırılırken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  }, [admin]);

  const tokenUid = getUidFromToken();
  const isOwnProfile = Boolean(tokenUid && admin && tokenUid === String(admin.uid));

  return {
    loading,
    error,
    admin,
    uploading,
    isOwnProfile,
    goBack,
    handleEmail,
    handleCall,
    handleUploadImage,
    handleRemoveImage,
  };
}
