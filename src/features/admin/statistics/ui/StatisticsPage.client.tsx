// src/features/admin/statistics/ui/StatisticsPage.client.tsx
"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStatisticsData } from "../hooks/useStatisticsData";

import MetricCards from "./components/MetricCards.client";
import AlertBanner from "./components/AlertBanner.client";
import MoreStatsCard from "./components/MoreStatsCard.client";
import RecentActivityCard from "./components/RecentActivityCard.client";
import GSCPlaceholder from "./components/GARequiredOverlay.client";

const tabs = ["Ana Sayfa", "Kitle"];

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading } = useStatisticsData();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* Top bar: tabs */}
        <div className="flex items-center mb-8">
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
        </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
              <div className="lg:col-span-3">
                <GSCPlaceholder
                  title="Arama Tıklamaları"
                  description="Toplam tıklama, ortalama CTR ve pozisyon verileri"
                />
              </div>
              <div className="lg:col-span-9">
                <GSCPlaceholder
                  title="Arama Performansı"
                  description="Günlük tıklama ve gösterim trendi grafiği"
                />
              </div>
            </div>

            {/* Row 3: Alert banner */}
            <div className="mb-3">
              <AlertBanner />
            </div>

            {/* Row 4: GSC Top Sayfalar + Son İlanlar (REAL) + En İyi Danışmanlar (REAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
              <div className="lg:col-span-4">
                <GSCPlaceholder
                  title="En Çok Tıklanan Sayfalar"
                  description="Arama sonuçlarında en çok tıklanan sayfalar"
                />
              </div>
              <div className="lg:col-span-5">
                <RecentActivityCard
                  recentAdverts={data?.recentAdverts ?? []}
                  loading={loading}
                />
              </div>
              <div className="lg:col-span-3">
                <MoreStatsCard
                  advisors={data?.advisors ?? []}
                  loading={loading}
                />
              </div>
            </div>

            {/* Row 5: GSC — Cihazlar + Arama Sorguları + Ülkeler */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-4">
                <GSCPlaceholder
                  title="Cihaz Dağılımı"
                  description="Masaüstü, mobil ve tablet arama dağılımı"
                />
              </div>
              <div className="lg:col-span-4">
                <GSCPlaceholder
                  title="Popüler Arama Sorguları"
                  description="Sitenizi bulmak için kullanılan arama terimleri"
                />
              </div>
              <div className="lg:col-span-4">
                <GSCPlaceholder
                  title="Ülkelere Göre Arama"
                  description="Hangi ülkelerden arama trafiği geliyor"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-12">
              <GSCPlaceholder
                title="Kitle Verileri"
                description="Ziyaretçi demografisi, ülke dağılımı ve oturum verileri GSC entegrasyonu ile görüntülenecektir"
                className="min-h-[300px]"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
