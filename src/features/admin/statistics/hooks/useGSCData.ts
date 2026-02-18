// src/features/admin/statistics/hooks/useGSCData.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchGSCData, type GSCData } from "../api/gscApi";

export type GSCPeriod = "1d" | "7d" | "28d" | "90d";

export interface GSCState {
  data: GSCData | null;
  loading: boolean;
  error: string | null;
  period: GSCPeriod;
}

export function useGSCData(initialPeriod: GSCPeriod = "28d") {
  const [period, setPeriod] = useState<GSCPeriod>(initialPeriod);
  const [state, setState] = useState<GSCState>({
    data: null,
    loading: true,
    error: null,
    period: initialPeriod,
  });

  const refresh = useCallback(
    async (p?: GSCPeriod) => {
      const targetPeriod = p ?? period;
      setState((s) => ({ ...s, loading: true, error: null, period: targetPeriod }));
      try {
        const data = await fetchGSCData(targetPeriod);
        setState({ data, loading: false, error: null, period: targetPeriod });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "GSC verisi yuklenirken hata olustu";
        console.error("GSC verisi yuklenemedi:", err);
        setState((s) => ({
          ...s,
          loading: false,
          error: message,
        }));
      }
    },
    [period]
  );

  const changePeriod = useCallback(
    (newPeriod: GSCPeriod) => {
      setPeriod(newPeriod);
      refresh(newPeriod);
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, refresh, changePeriod };
}
