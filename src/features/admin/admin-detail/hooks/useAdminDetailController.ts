// src/features/admin/admin-detail/hooks/useAdminDetailController.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import type { AdminDetailUser } from "../lib/types";

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

  return {
    loading,
    error,
    admin,
    goBack,
    handleEmail,
    handleCall,
  };
}
