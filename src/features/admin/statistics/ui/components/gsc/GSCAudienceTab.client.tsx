// src/features/admin/statistics/ui/components/gsc/GSCAudienceTab.client.tsx
"use client";

import {
  MousePointerClick,
  Eye,
  Target,
  MapPin,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import type { GSCData, GSCRow } from "@/features/admin/statistics/api/gscApi";
import { resolveCountry } from "@/features/admin/statistics/utils/countryMap";

interface Props {
  data: GSCData;
  loading?: boolean;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ── SVG chart helpers ── */
const CW = 900;
const CH = 160;
const PX = 40;
const PT = 10;
const PB = 24;

function toPoint(i: number, val: number, count: number, maxVal: number, minVal: number) {
  const range = maxVal - minVal || 1;
  const x = PX + ((CW - PX * 2) / Math.max(count - 1, 1)) * i;
  const y = PT + ((maxVal - val) / range) * (CH - PT - PB);
  return { x, y };
}

function linePath(values: number[], maxVal: number, minVal: number) {
  return values
    .map((v, i) => {
      const { x, y } = toPoint(i, v, values.length, maxVal, minVal);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function areaPath(values: number[], maxVal: number, minVal: number) {
  if (values.length === 0) return "";
  const bottom = CH - PB;
  const last = toPoint(values.length - 1, values[values.length - 1], values.length, maxVal, minVal);
  const first = toPoint(0, values[0], values.length, maxVal, minVal);
  return `${linePath(values, maxVal, minVal)} L ${last.x.toFixed(1)} ${bottom} L ${first.x.toFixed(1)} ${bottom} Z`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return `${day} ${months[d.getMonth()]}`;
}

const BAR_COLORS = ["#1f2937", "#3b82f6", "#8b5cf6", "#06b6d4", "#14b8a6", "#f59e0b", "#ef4444", "#ec4899", "#9ca3af", "#64748b"];

/* ── CTR & Position Trend Chart ── */
function CTRPositionChart({ byDate, loading }: { byDate: GSCRow[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-32 bg-gray-100 rounded" />
      </div>
    );
  }
  if (byDate.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz veri yok</p>
      </div>
    );
  }

  const ctrValues = byDate.map((r) => r.ctr * 100);
  const posValues = byDate.map((r) => r.position);
  const ctrMax = Math.max(...ctrValues);
  const ctrMin = Math.min(...ctrValues);
  const posMax = Math.max(...posValues);
  const posMin = Math.min(...posValues);
  const avgCtr = ctrValues.reduce((a, b) => a + b, 0) / ctrValues.length;
  const avgPos = posValues.reduce((a, b) => a + b, 0) / posValues.length;
  const labelStep = Math.max(1, Math.floor(byDate.length / 7));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Target size={14} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">CTR & Pozisyon Trendi</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-lg font-bold text-green-600">%{avgCtr.toFixed(1)} CTR</span>
            <span className="text-lg font-bold text-amber-600">{avgPos.toFixed(1)} Poz.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-gray-400">CTR %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] text-gray-400">Pozisyon</span>
          </div>
        </div>
      </div>

      {/* CTR chart */}
      <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full mt-2" style={{ aspectRatio: `${CW} / ${CH}` }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="audCtrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(34,197,94)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1={PX} y1={PT + (CH - PT - PB) * ratio} x2={CW - PX} y2={PT + (CH - PT - PB) * ratio} stroke="#f3f4f6" strokeWidth="0.8" />
        ))}
        <path d={areaPath(ctrValues, ctrMax, ctrMin)} fill="url(#audCtrGrad)" />
        <path d={linePath(ctrValues, ctrMax, ctrMin)} fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {byDate.map((row, i) => {
          if (i % labelStep !== 0 && i !== byDate.length - 1) return null;
          const { x } = toPoint(i, 0, byDate.length, ctrMax, ctrMin);
          return <text key={i} x={x} y={CH - 4} textAnchor="middle" className="fill-gray-400" fontSize="10">{formatDate(row.keys[0])}</text>;
        })}
      </svg>
    </div>
  );
}

/* ── Detailed Query Table ── */
function QueryDetailTable({ byQuery, loading }: { byQuery: GSCRow[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-44 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded" />)}</div>
      </div>
    );
  }
  if (byQuery.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz sorgu verisi yok</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Sorgu Detayları</h3>
      <div className="flex-1 overflow-x-auto -mx-4 px-4">
        <div className="min-w-[480px]">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 font-medium mb-2 px-1">
            <div className="col-span-5">Sorgu</div>
            <div className="col-span-2 text-right">Tıklama</div>
            <div className="col-span-2 text-right">Gösterim</div>
            <div className="col-span-1 text-right">CTR</div>
            <div className="col-span-2 text-right">Pozisyon</div>
          </div>
          {/* Table rows */}
          <div className="space-y-1">
            {byQuery.slice(0, 10).map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="col-span-5 text-xs text-gray-700 truncate">{row.keys[0]}</div>
                <div className="col-span-2 text-xs font-semibold text-gray-900 text-right">{formatNum(row.clicks)}</div>
                <div className="col-span-2 text-xs text-gray-500 text-right">{formatNum(row.impressions)}</div>
                <div className="col-span-1 text-[10px] text-green-600 font-medium text-right">%{(row.ctr * 100).toFixed(1)}</div>
                <div className="col-span-2 text-xs text-amber-600 font-medium text-right">{row.position.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Country Detail Card (larger) ── */
function CountryDetailCard({ byCountry, loading }: { byCountry: GSCRow[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded" />)}</div>
      </div>
    );
  }
  if (byCountry.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz ülke verisi yok</p>
      </div>
    );
  }

  const totalClicks = byCountry.reduce((a, c) => a + c.clicks, 0) || 1;
  const countries = byCountry.slice(0, 10).map((row, i) => {
    const { name, flag } = resolveCountry(row.keys[0] ?? "");
    const percent = Math.round((row.clicks / totalClicks) * 100);
    return { name, flag, clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position, percent, color: BAR_COLORS[i % BAR_COLORS.length] };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Ülke Detayları</h3>
      <div className="flex-1 overflow-x-auto -mx-4 px-4">
        <div className="min-w-[480px]">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 font-medium mb-2 px-1">
            <div className="col-span-4">Ülke</div>
            <div className="col-span-2 text-right">Tıklama</div>
            <div className="col-span-2 text-right">Gösterim</div>
            <div className="col-span-2 text-right">CTR</div>
            <div className="col-span-2 text-right">Poz.</div>
          </div>
          <div className="space-y-1">
            {countries.map((c) => (
              <div key={c.name} className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="col-span-4 flex items-center gap-2">
                  <span className="text-sm">{c.flag}</span>
                  <span className="text-xs text-gray-700 truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-400">%{c.percent}</span>
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-900 text-right">{formatNum(c.clicks)}</div>
                <div className="col-span-2 text-xs text-gray-500 text-right">{formatNum(c.impressions)}</div>
                <div className="col-span-2 text-[10px] text-green-600 font-medium text-right">%{(c.ctr * 100).toFixed(1)}</div>
                <div className="col-span-2 text-xs text-amber-600 font-medium text-right">{c.position.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page Performance Table ── */
function PagePerformanceTable({ byPage, loading }: { byPage: GSCRow[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-44 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded" />)}</div>
      </div>
    );
  }
  if (byPage.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz sayfa verisi yok</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Sayfa Performansı</h3>
      <div className="flex-1 overflow-x-auto -mx-4 px-4">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 font-medium mb-2 px-1">
            <div className="col-span-5">Sayfa</div>
            <div className="col-span-2 text-right">Tıklama</div>
            <div className="col-span-2 text-right">Gösterim</div>
            <div className="col-span-1 text-right">CTR</div>
            <div className="col-span-2 text-right">Pozisyon</div>
          </div>
          <div className="space-y-1">
            {byPage.slice(0, 10).map((row, i) => {
              let path = row.keys[0] ?? "";
              try { path = new URL(path).pathname; } catch { /* keep as-is */ }
              return (
                <div key={i} className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}>{i + 1}</span>
                    <span className="text-xs text-gray-700 truncate">{path}</span>
                  </div>
                  <div className="col-span-2 text-xs font-semibold text-gray-900 text-right">{formatNum(row.clicks)}</div>
                  <div className="col-span-2 text-xs text-gray-500 text-right">{formatNum(row.impressions)}</div>
                  <div className="col-span-1 text-[10px] text-green-600 font-medium text-right">%{(row.ctr * 100).toFixed(1)}</div>
                  <div className="col-span-2 text-xs text-amber-600 font-medium text-right">{row.position.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Audience Tab ── */
export default function GSCAudienceTab({ data, loading }: Props) {
  const totals = data.totals;

  // Calculate daily averages for summary cards
  const dayCount = data.byDate.length || 1;
  const avgDailyClicks = totals ? totals.clicks / dayCount : 0;
  const avgDailyImpressions = totals ? totals.impressions / dayCount : 0;

  // Trend direction (compare last 7 days vs previous 7 days)
  const recentDays = data.byDate.slice(-7);
  const previousDays = data.byDate.slice(-14, -7);
  const recentClicks = recentDays.reduce((a, r) => a + r.clicks, 0);
  const prevClicks = previousDays.reduce((a, r) => a + r.clicks, 0);
  const clicksTrend = prevClicks > 0 ? ((recentClicks - prevClicks) / prevClicks) * 100 : 0;

  const recentImpr = recentDays.reduce((a, r) => a + r.impressions, 0);
  const prevImpr = previousDays.reduce((a, r) => a + r.impressions, 0);
  const imprTrend = prevImpr > 0 ? ((recentImpr - prevImpr) / prevImpr) * 100 : 0;

  const summaryCards = [
    {
      label: "Günlük Ort. Tıklama",
      value: loading || !totals ? "\u2014" : formatNum(Math.round(avgDailyClicks)),
      trend: clicksTrend,
      icon: MousePointerClick,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Günlük Ort. Gösterim",
      value: loading || !totals ? "\u2014" : formatNum(Math.round(avgDailyImpressions)),
      trend: imprTrend,
      icon: Eye,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "Ortalama CTR",
      value: loading || !totals ? "\u2014" : `%${(totals.ctr * 100).toFixed(1)}`,
      icon: Target,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Ortalama Pozisyon",
      value: loading || !totals ? "\u2014" : totals.position.toFixed(1),
      icon: MapPin,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Row 1: Summary metric cards with trend comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          const trend = "trend" in card ? card.trend : undefined;
          const isUp = trend !== undefined && trend > 0;
          return (
            <div key={i} className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow ${loading ? "animate-pulse" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon size={16} className={card.iconColor} />
                </div>
                {trend !== undefined && !loading && (
                  <span className={`flex items-center gap-0.5 text-[11px] font-medium ${isUp ? "text-green-600" : "text-red-500"}`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.label}</p>
              {trend !== undefined && !loading && (
                <p className="text-[10px] text-gray-400 mt-0.5">Son 7 gün vs önceki 7 gün</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Row 2: CTR & Position Trend Chart */}
      <CTRPositionChart byDate={data.byDate} loading={loading} />

      {/* Row 3: Detailed tables - Queries + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <QueryDetailTable byQuery={data.byQuery} loading={loading} />
        <CountryDetailCard byCountry={data.byCountry} loading={loading} />
      </div>

      {/* Row 4: Page Performance full-width table */}
      <PagePerformanceTable byPage={data.byPage} loading={loading} />
    </div>
  );
}
