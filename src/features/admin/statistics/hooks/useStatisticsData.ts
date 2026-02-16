// src/features/admin/statistics/hooks/useStatisticsData.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "../api/statisticsApi";

export type StatisticsState = {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
};

export function useStatisticsData() {
  const router = useRouter();
  const [state, setState] = useState<StatisticsState>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchDashboardStats();
      setState({ data, loading: false, error: null });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }
      console.error("İstatistik verisi yüklenemedi:", err);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Veriler yüklenirken hata oluştu",
      }));
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
