// src/features/admin/statistics/api/gscApi.ts

import axios from "axios";

/* ──────────── Types ──────────── */

export interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCData {
  totals: GSCTotals | null;
  byDate: GSCRow[];
  byPage: GSCRow[];
  byDevice: GSCRow[];
  byQuery: GSCRow[];
  byCountry: GSCRow[];
}

export interface GSCResponse {
  success: boolean;
  period: string;
  startDate: string;
  endDate: string;
  data: GSCData;
  error?: string;
}

/* ──────────── API call ──────────── */

/**
 * GSC verilerini internal API route'tan ceker.
 * Bu cagri browser->Next.js server (same-origin) oldugu icin
 * CORS sorunu yasamaz ve cookie otomatik gider.
 */
export async function fetchGSCData(
  period: "7d" | "28d" | "90d" = "28d"
): Promise<GSCData> {
  const res = await axios.get<GSCResponse>("/api/gsc", {
    params: { period },
    timeout: 15_000,
  });

  if (!res.data?.success) {
    throw new Error(res.data?.error ?? "GSC verisi alinamadi");
  }

  return res.data.data;
}
