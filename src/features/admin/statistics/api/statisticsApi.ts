// src/features/admin/statistics/api/statisticsApi.ts

import api from "@/lib/api";

/* ──────────── Types ──────────── */

export type AdvisorStat = {
  advisor: {
    uid: number;
    name: string;
    surname: string;
    mail: string;
    profilePicture: string;
    link: string;
  };
  activeAdverts: any[];
  activeAdvertCount: number;
  allAdverts: any[];
  totalAdvertCount: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  itemCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type DashboardStats = {
  advisors: AdvisorStat[];
  advisorCount: number;
  totalActiveAdverts: number;
  totalAdverts: number;
  customerCount: number;
  recentAdverts: any[];
};

/* ──────────── API calls ──────────── */

/** Tüm danışman istatistikleri (paginated) */
async function fetchAdvisorStats(page = 1, limit = 100) {
  const res = await api.get(`/user/advisor/stats?page=${page}&limit=${limit}`);
  return res.data;
}

/** Müşteri listesi (sadece count için küçük limit) */
async function fetchCustomerCount() {
  const res = await api.get(`/admin/customers?page=1&limit=1`);
  return res.data?.pagination?.totalItems ?? 0;
}

/** İlan listesi (admin, en son eklenenler) */
async function fetchRecentAdverts(limit = 5) {
  const res = await api.get(`/admin/adverts?page=1&limit=${limit}&sortBy=created&sortOrder=desc`);
  return res.data;
}

/** Tüm ilan sayısı */
async function fetchAdvertCount() {
  const res = await api.get(`/admin/adverts?page=1&limit=1`);
  return res.data?.pagination?.totalItems ?? 0;
}

/**
 * Dashboard için tüm verileri paralel çeker.
 * Tek bir hook'ta kullanılmak üzere aggregate eder.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [advisorRes, customerCount, recentRes, advertCount] = await Promise.all([
    fetchAdvisorStats(1, 100),
    fetchCustomerCount(),
    fetchRecentAdverts(6),
    fetchAdvertCount(),
  ]);

  const advisors: AdvisorStat[] = Array.isArray(advisorRes?.data)
    ? advisorRes.data
    : [];

  const totalActiveAdverts = advisors.reduce(
    (sum, a) => sum + (a.activeAdvertCount ?? 0),
    0,
  );
  const totalAdverts = advisors.reduce(
    (sum, a) => sum + (a.totalAdvertCount ?? 0),
    0,
  );

  const recentAdverts = Array.isArray(recentRes?.data) ? recentRes.data : [];

  return {
    advisors,
    advisorCount: advisorRes?.pagination?.totalItems ?? advisors.length,
    totalActiveAdverts,
    totalAdverts: advertCount || totalAdverts,
    customerCount,
    recentAdverts,
  };
}

export const statisticsApi = {
  fetchAdvisorStats,
  fetchCustomerCount,
  fetchRecentAdverts,
  fetchAdvertCount,
  fetchDashboardStats,
};
