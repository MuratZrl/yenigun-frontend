// src/features/admin/emlak-archived-detail/hooks/useArchivedDetail.ts

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { AdvertData } from "../types";
import { getSafePhotos } from "../utils/helpers";

export function useArchivedDetail(uid: string) {
  const [data, setData] = useState<AdvertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/adverts/${uid}`);
        const raw = res.data.data;

        if (!raw) throw new Error("İlan bulunamadı");

        if (!cancelled) {
          setData({
            ...raw,
            photos: getSafePhotos(raw.photos),
          });
        }
      } catch (err) {
        console.error("Arşivlenmiş ilan detayı çekilirken hata:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Bir hata oluştu");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [uid]);

  return { data, loading, error };
}