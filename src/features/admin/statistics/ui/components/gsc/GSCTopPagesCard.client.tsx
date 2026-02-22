// src/features/admin/statistics/ui/components/gsc/GSCTopPagesCard.client.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Eye, MousePointerClick, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";
import api from "@/lib/api";

interface Props {
  byPage: GSCRow[];
  loading?: boolean;
}

const barColors = [
  { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { bg: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  { bg: "bg-teal-500", light: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { bg: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { bg: "bg-sky-500", light: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
];

function extractPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function isAdvertPage(path: string): boolean {
  return /^\/ads\/[^/]+\/?$/.test(path);
}

function extractUid(path: string): string {
  const segments = path.replace(/\/$/, "").split("/");
  return segments[segments.length - 1] ?? "";
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("tr-TR");
}

type SortKey = "impressions" | "clicks";
type SortDir = "desc" | "asc";

export default function GSCTopPagesCard({ byPage, loading }: Props) {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const advertPages = byPage
    .filter((row) => {
      const path = extractPath(row.keys[0]);
      return isAdvertPage(path);
    })
    .sort((a, b) =>
      sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    );
  const pages = advertPages.slice(0, 10);

  useEffect(() => {
    if (loading || pages.length === 0) return;

    const uids = pages.map((row) => extractUid(extractPath(row.keys[0])));
    if (uids.length === 0) return;

    let cancelled = false;

    const extractTitle = (payload: unknown): string | null => {
      // Handle all nesting levels: res.data.data.data, res.data.data, res.data
      const p = payload as Record<string, Record<string, Record<string, unknown>>> | undefined;
      const d = p?.data?.data ?? p?.data ?? p;
      return (d as Record<string, unknown>)?.title as string ?? null;
    };

    const fetchTitles = async () => {
      const results: Record<string, string> = {};
      await Promise.allSettled(
        uids.map(async (uid) => {
          // Try admin endpoint first (can access inactive/archived adverts)
          try {
            const res = await api.get(`/admin/adverts/${uid}`);
            const title = extractTitle(res);
            if (title) { results[uid] = title; return; }
          } catch { /* continue to fallback */ }

          // Fallback to public endpoint
          try {
            const res = await api.get(`/advert/adverts/${uid}`);
            const title = extractTitle(res);
            if (title) { results[uid] = title; return; }
          } catch { /* ignore — will show fallback label */ }
        })
      );
      if (!cancelled) setTitles(results);
    };

    fetchTitles();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byPage, loading]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full animate-pulse">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-1.5" />
            <div className="h-3 w-52 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5" />
                <div className="h-1.5 bg-gray-50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (advertPages.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <TrendingUp size={18} className="text-gray-300" />
        </div>
        <p className="text-xs text-gray-400">Henüz ilan verisi yok</p>
      </div>
    );
  }

  const totalClicks = pages.reduce((sum, r) => sum + r.clicks, 0);
  const totalImpressions = pages.reduce((sum, r) => sum + r.impressions, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              En Çok Gösterilen İlanlar
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              İlan sayfalarının GSC performansı
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-blue-50/60 rounded-xl px-3 py-2.5 border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1">
            <MousePointerClick size={11} className="text-blue-500" />
            <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">Tıklama</span>
          </div>
          <span className="text-lg font-bold text-blue-700">{formatNum(totalClicks)}</span>
        </div>
        <div className="bg-violet-50/60 rounded-xl px-3 py-2.5 border border-violet-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye size={11} className="text-violet-500" />
            <span className="text-[10px] font-medium text-violet-600 uppercase tracking-wide">Gösterim</span>
          </div>
          <span className="text-lg font-bold text-violet-700">{formatNum(totalImpressions)}</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">İlan</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSort("impressions")}
            className={`flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider w-14 justify-end cursor-pointer transition-colors ${
              sortKey === "impressions" ? "text-gray-700" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Gösterim
            {sortKey === "impressions" && (
              sortDir === "desc"
                ? <ArrowDown size={10} className="flex-shrink-0" />
                : <ArrowUp size={10} className="flex-shrink-0" />
            )}
          </button>
          <button
            type="button"
            onClick={() => handleSort("clicks")}
            className={`flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider w-14 justify-end cursor-pointer transition-colors ${
              sortKey === "clicks" ? "text-gray-700" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Tıklama
            {sortKey === "clicks" && (
              sortDir === "desc"
                ? <ArrowDown size={10} className="flex-shrink-0" />
                : <ArrowUp size={10} className="flex-shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-1.5">
        {pages.map((row, i) => {
          const path = extractPath(row.keys[0]);
          const uid = extractUid(path);
          const label = titles[uid] || `İlan #${uid}`;
          const colorSet = barColors[i % barColors.length];

          return (
            <Link
              key={i}
              href={`/ilan/${uid}`}
              target="_blank"
              className="group relative block rounded-xl px-3 py-2.5 hover:bg-gray-50/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg ${colorSet.light} ${colorSet.text} ${colorSet.border} border flex items-center justify-center text-[11px] font-bold flex-shrink-0`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[13px] font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors"
                        title={label}
                      >
                        {label}
                      </span>
                      <ExternalLink
                        size={10}
                        className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs font-bold text-gray-900 w-14 text-right tabular-nums">
                    {formatNum(row.impressions)}
                  </span>
                  <span className="text-xs font-medium text-gray-500 w-14 text-right tabular-nums">
                    {formatNum(row.clicks)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
