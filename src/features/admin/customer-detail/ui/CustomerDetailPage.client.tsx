// src/features/admin/customer-detail/ui/CustomerDetailPage.client.tsx
"use client";

import React from "react";
import { ArrowLeft, Info } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

import { useCustomerDetailController } from "../hooks/useCustomerDetailController";
import CustomerSidebar from "./components/CustomerSidebar";
import AdvertCard from "./components/AdvertCard";

export default function CustomerDetailPage() {
  const c = useCustomerDetailController();

  if (c.loading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <div className="text-lg text-gray-600">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (c.error || !c.customer) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg text-red-600">
              {c.error || "Müşteri bulunamadı"}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={c.goBack}
            className="p-2 text-gray-500 hover:text-[#035DBA] hover:bg-[#E9EEF7] rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Müşteri Detayları
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <CustomerSidebar
              customer={c.customer}
              primaryPhone={c.primaryPhone}
              advertCount={c.advertCount}
              activeCount={c.activeCount}
              passiveCount={c.passiveCount}
              onEmail={c.handleEmail}
              onCall={c.handleCall}
            />
          </div>

          {/* Right Content — Adverts */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Müşteriye Ait İlanlar
                </h2>
                <span className="text-sm text-gray-500">
                  {c.advertCount} ilan bulundu
                </span>
              </div>

              {c.adverts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-gray-400">
                  <Info size={60} />
                  <p className="text-lg">Bu müşteriye ait ilan bulunamadı</p>
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