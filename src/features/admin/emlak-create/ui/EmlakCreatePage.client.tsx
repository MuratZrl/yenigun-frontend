// src/features/admin/emlak-create/ui/EmlakCreatePage.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";

import CombinedCategoryTab from "@/components/tabs/CategoriesTab";
import IlanDetaylariTab from "@/components/tabs/AdDetailsTab";

import {
  contractTimes,
  yesNoOptions,
  keyOptions,
  currencyOptions,
  directionOptions,
  heatingOptions,
  deedStatusOptions,
  zoningStatusOptions,
} from "@/data/propertyData";

import { useEmlakCreateController } from "../hooks/useEmlakCreateController";

export default function EmlakCreatePage() {
  const c = useEmlakCreateController();

  const stepLabels = ["Kategori", "İlan Detayları"];
  const totalSteps = stepLabels.length;

  const getSelected = (step: any) => (step as any)?.selected ?? {};

  const breadcrumb = (() => {
    const parts: string[] = [];
    const f = getSelected(c.firstStep)?.value;
    const s = getSelected(c.secondStep)?.value;
    const t = getSelected(c.thirdStep)?.value;
    if (f) parts.push(f);
    if (s) parts.push(s);
    if (t) parts.push(t);
    return parts;
  })();

  const renderStep = () => {
    switch (c.activeTab) {
      case 1:
        return (
          <CombinedCategoryTab
            firstStep={c.firstStep}
            setFirstStep={c.setFirstStep}
            secondStep={c.secondStep}
            setSecondStep={c.setSecondStep}
            thirdStep={c.thirdStep}
            setThirdStep={c.setThirdStep}
            onNext={() => c.setActiveTab(2)}
          />
        );

      case 2:
        return (
          <IlanDetaylariTab
            fourthStep={c.fourthStep}
            updateFourthStep={c.updateFourthStep}
            updateNestedFourthStep={c.updateNestedFourthStep}
            content={c.content}
            setContent={c.setContent}
            onTitleChange={c.handleTitleChange}
            onPriceValueChange={c.handlePriceValueChange}
            onPriceTypeChange={c.handlePriceTypeChange}
            onAdminNoteChange={(e: any) => c.updateFourthStep("adminNote" as any, e.target.value)}
            currencyOptions={currencyOptions}
            firstStep={c.firstStep}
            secondStep={c.secondStep}
            thirdStep={c.thirdStep}
            featuresStep={c.featuresStep}
            setFeaturesStep={c.setFeaturesStep}
            onElevatorToggle={(v: string) =>
              c.updateFourthStep("elevator" as any, { ...(c.fourthStep as any).elevator, value: v })
            }
            onInSiteToggle={(v: string) =>
              c.updateFourthStep("inSite" as any, { ...(c.fourthStep as any).inSite, value: v })
            }
            onBalconyToggle={(v: string) =>
              c.updateFourthStep("balcony" as any, { ...(c.fourthStep as any).balcony, value: v })
            }
            onIsFurnishedToggle={(v: string) =>
              c.updateFourthStep("isFurnished" as any, { ...(c.fourthStep as any).isFurnished, value: v })
            }
            onHeatingChange={(e: any) =>
              c.updateFourthStep("heating" as any, { ...(c.fourthStep as any).heating, value: e.target.value })
            }
            onDeedStatusChange={(e: any) =>
              c.updateFourthStep("deedStatus" as any, { ...(c.fourthStep as any).deedStatus, value: e.target.value })
            }
            onWhichSideChange={(e: any) =>
              c.updateFourthStep("whichSide" as any, { ...(c.fourthStep as any).whichSide, value: e.target.value })
            }
            onZoningStatusChange={(e: any) =>
              c.updateFourthStep("zoningStatus" as any, { ...(c.fourthStep as any).zoningStatus, value: e.target.value })
            }
            heatingOptions={heatingOptions}
            deedStatusOptions={deedStatusOptions}
            directionOptions={directionOptions}
            zoningStatusOptions={zoningStatusOptions}
            marker={c.marker}
            setMarker={c.setMarker}
            turkeyCities={c.turkeyCities}
            images={c.images}
            setImages={c.setImages}
            videoFile={c.videoFile}
            setVideoFile={c.setVideoFile}
            reOrderImages={c.reOrderImages}
            setReOrderImages={c.setReOrderImages}
            onImageChange={c.handleImageChange}
            onVideoChange={c.handleVideoChange}
            onRemoveImage={c.handleRemoveImage}
            customers={c.customers}
            advisors={c.advisors}
            isActiveAd={c.isActiveAd}
            setIsActiveAd={c.setIsActiveAd}
            contractTimes={contractTimes}
            yesNoOptions={yesNoOptions}
            keyOptions={keyOptions}
            onSubmit={c.handleSubmit}
            isSubmitting={c.isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">Yeni Emlak İlanı</h1>
                <p className="text-gray-600 text-sm lg:text-base truncate">
                  {breadcrumb.length > 0
                    ? `Emlak > ${breadcrumb.join(" > ")}`
                    : "Emlak ilanınızı oluşturun ve potansiyel alıcılara ulaştırın"}
                </p>
              </div>

              <Link
                href="/admin/emlak"
                className="bg-custom-orange text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Emlaklara Dön</span>
                <span className="sm:hidden">Geri</span>
              </Link>
            </div>
          </motion.div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Progress bar */}
            <div className="bg-gray-100 h-1.5 w-full">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(c.activeTab / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step indicators */}
            <div className="border-b border-gray-200 px-4 lg:px-6 py-3">
              <div className="flex items-center gap-3 text-[13px]">
                {stepLabels.map((label, i) => {
                  const step = i + 1;
                  const isActive = c.activeTab === step;
                  const isDone = c.activeTab > step;
                  return (
                    <React.Fragment key={step}>
                      {i > 0 && <span className="text-gray-300">›</span>}
                      <button
                        type="button"
                        onClick={() => { if (isDone) c.setActiveTab(step); }}
                        className={[
                          "flex items-center gap-1.5 transition-colors",
                          isActive ? "text-blue-600 font-semibold" : isDone ? "text-blue-500 hover:underline cursor-pointer" : "text-gray-400 cursor-default",
                        ].join(" ")}
                        disabled={!isDone && !isActive}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${isActive ? "bg-blue-600 text-white" : isDone ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                          {isDone ? "✓" : step}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-6">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}