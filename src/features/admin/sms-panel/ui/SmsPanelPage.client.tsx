// src/features/admin/sms-panel/ui/SmsPanelPage.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { Send, History, BarChart3, MessageSquare } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useSmsController } from "../hooks/useSmsController";
import SmsStatsCards from "./components/SmsStatsCards";
import SmsComposeForm from "./components/SmsComposeForm";
import SmsHistoryTable from "./components/SmsHistoryTable";

import type { SmsTab } from "../lib/types";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const tabs: { key: SmsTab; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "compose", label: "SMS Gönder", desc: "Yeni mesaj oluştur", icon: <Send size={18} /> },
  { key: "history", label: "Geçmiş", desc: "Gönderim kayıtları", icon: <History size={18} /> },
  { key: "stats", label: "İstatistikler", desc: "Detaylı raporlar", icon: <BarChart3 size={18} /> },
];

export default function SmsPanelPage() {
  const c = useSmsController();

  if (!c.isAuthenticated || c.loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30"
        style={PoppinsFont.style}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <MessageSquare size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SMS Paneli
              </h1>
              <p className="text-gray-400 mt-0.5 text-sm">
                Müşterilerinize toplu veya bireysel SMS gönderin
              </p>
            </div>
          </div>

          {/* Stats Cards (always visible) */}
          <div className="mb-6">
            <SmsStatsCards stats={c.stats} />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 inline-flex gap-1">
              {tabs.map((tab) => {
                const isActive = c.activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => c.setActiveTab(tab.key)}
                    className={`relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`${isActive ? "text-white" : "text-gray-400"} transition-colors`}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    <span className={`hidden sm:block text-[11px] font-normal ml-0.5 ${
                      isActive ? "text-blue-200" : "text-gray-400"
                    }`}>
                      — {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {c.activeTab === "compose" && (
            <SmsComposeForm
              recipientType={c.compose.recipientType}
              selectedCities={c.compose.selectedCities}
              selectedDistricts={c.compose.selectedDistricts}
              selectedCategory={c.compose.selectedCategory}
              message={c.compose.message}
              charCount={c.charCount}
              smsSegments={c.smsSegments}
              sending={c.sending}
              estimatedRecipientCount={c.estimatedRecipientCount}
              recipientSummary={c.recipientSummary}
              onRecipientTypeChange={c.setRecipientType}
              onToggleCity={c.toggleCity}
              onToggleDistrict={c.toggleDistrict}
              onCategoryChange={c.setCategory}
              onMessageChange={c.setMessage}
              onSend={c.handleSend}
              onReset={c.handleReset}
            />
          )}

          {c.activeTab === "history" && (
            <SmsHistoryTable
              items={c.paginatedHistory}
              page={c.historyPage}
              totalPages={c.totalHistoryPages}
              rowsPerPage={c.historyRowsPerPage}
              totalItems={c.history.length}
              onPageChange={c.setHistoryPage}
              onRowsPerPageChange={(rows) => {
                c.setHistoryRowsPerPage(rows);
                c.setHistoryPage(0);
              }}
            />
          )}

          {c.activeTab === "stats" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center py-12">
                <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Detaylı İstatistikler
                </h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Backend entegrasyonu tamamlandığında detaylı SMS istatistikleri burada görüntülenecektir.
                  Grafik, aylık rapor ve başarı oranları gibi veriler eklenecektir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
