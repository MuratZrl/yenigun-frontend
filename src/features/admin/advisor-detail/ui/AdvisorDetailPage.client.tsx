// src/features/admin/advisor-detail/ui/AdvisorDetailPage.client.tsx
"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

import type { AdvisorDetailProps } from "../lib/types";
import { useAdvisorDetailController } from "../hooks/useAdvisorDetailController";
import AdvisorSidebar from "./components/AdvisorSidebar";
import AdvertCard from "./components/AdvertCard";

export default function AdvisorDetailPage(props: AdvisorDetailProps) {
  const c = useAdvisorDetailController(props);

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={c.goBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Danışman Detayları
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <AdvisorSidebar
              advisor={c.advisor}
              advertCount={c.advertCount}
              activeCount={c.activeAdverts.length}
              passiveCount={c.passiveAdverts.length}
              onEmail={c.handleEmail}
              onCall={c.handleCall}
            />
          </div>

          {/* Right Content — Adverts */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Danışmana Ait İlanlar
              </h2>

              {c.adverts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Herhangi bir ilan bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {c.adverts.map((advert) => (
                    <AdvertCard
                      key={advert._id}
                      advert={advert}
                      onClick={() => c.handleAdvertClick(advert)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}