// src/features/admin/statistics/ui/StatisticsPage.client.tsx
"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStatisticsData } from "../hooks/useStatisticsData";
import { useGSCData, type GSCPeriod } from "../hooks/useGSCData";

import MetricCards from "./components/MetricCards.client";
import AlertBanner from "./components/AlertBanner.client";
import MoreStatsCard from "./components/MoreStatsCard.client";
import RecentActivityCard from "./components/RecentActivityCard.client";

// GSC components
import SearchClicksCard from "./components/gsc/SearchClicksCard.client";
import SearchPerformanceChart from "./components/gsc/SearchPerformanceChart.client";
import GSCTopPagesCard from "./components/gsc/GSCTopPagesCard.client";
import GSCDevicesCard from "./components/gsc/GSCDevicesCard.client";
import GSCQueriesCard from "./components/gsc/GSCQueriesCard.client";
import GSCCountriesCard from "./components/gsc/GSCCountriesCard.client";
import GSCAudienceTab from "./components/gsc/GSCAudienceTab.client";

const tabs = ["Ana Sayfa", "Kitle"];

const periodOptions: { label: string; value: GSCPeriod }[] = [
  { label: "24 Saat", value: "1d" },
  { label: "7 Gün", value: "7d" },
  { label: "28 Gün", value: "28d" },
  { label: "90 Gün", value: "90d" },
];

const emptyGSCData = {
  totals: null,
  byDate: [],
  byPage: [],
  byDevice: [],
  byQuery: [],
  byCountry: [],
};

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading } = useStatisticsData();
  const gsc = useGSCData("28d");

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* Top bar: tabs + GSC period selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-6">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`text-sm font-medium pb-2 transition-colors ${
                  activeTab === i
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => gsc.changePeriod(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  gsc.period === opt.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* GSC error banner */}
        {gsc.error && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-red-600">
              Google Search Console verisi yüklenemedi: {gsc.error}
            </p>
            <button
              onClick={() => gsc.refresh()}
              className="text-xs font-medium text-red-700 hover:text-red-900 transition-colors flex-shrink-0"
            >
              Tekrar dene
            </button>
          </div>
        )}

        {/* Tab content */}
        {activeTab === 0 && (
          <>
            {/* Row 1: Metric cards — REAL DATA */}
            <div className="mb-3">
              <MetricCards
                totalAdverts={data?.totalAdverts ?? 0}
                activeAdverts={data?.totalActiveAdverts ?? 0}
                customerCount={data?.customerCount ?? 0}
                advisorCount={data?.advisorCount ?? 0}
                loading={loading}
              />
            </div>

            {/* Row 2: GSC — Tıklamalar + Gösterimler */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
              <div className="md:col-span-4 lg:col-span-3">
                <SearchClicksCard
                  totals={gsc.data?.totals ?? null}
                  loading={gsc.loading}
                />
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <SearchPerformanceChart
                  byDate={gsc.data?.byDate ?? []}
                  loading={gsc.loading}
                />
              </div>
            </div>

            {/* Row 3: Alert banner */}
            <div className="mb-3">
              <AlertBanner gscData={gsc.data} />
            </div>

            {/* Row 4: GSC Top Sayfalar + Son Ilanlar (REAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-3 items-stretch">
              <div className="flex">
                <GSCTopPagesCard
                  byPage={gsc.data?.byPage ?? []}
                  loading={gsc.loading}
                />
              </div>
              <div className="flex">
                <RecentActivityCard
                  recentAdverts={data?.recentAdverts ?? []}
                  loading={loading}
                />
              </div>
            </div>

            {/* Row 5: Danışmanlar + Cihazlar + Arama Sorguları + Ülkeler */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1">
              <div className="flex w-full">
                <MoreStatsCard
                  advisors={data?.advisors ?? []}
                  loading={loading}
                />
              </div>
              <div className="flex w-full">
                <GSCDevicesCard
                  byDevice={gsc.data?.byDevice ?? []}
                  loading={gsc.loading}
                />
              </div>
              <div className="flex w-full">
                <GSCQueriesCard
                  byQuery={gsc.data?.byQuery ?? []}
                  loading={gsc.loading}
                />
              </div>
              <div className="flex w-full">
                <GSCCountriesCard
                  byCountry={gsc.data?.byCountry ?? []}
                  loading={gsc.loading}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 1 && (
          <GSCAudienceTab
            data={gsc.data ?? emptyGSCData}
            loading={gsc.loading}
          />
        )}
      </div>
    </AdminLayout>
  );
}
