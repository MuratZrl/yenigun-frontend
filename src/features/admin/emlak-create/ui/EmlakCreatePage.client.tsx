// src/features/admin/emlak-create/ui/EmlakCreatePage.client.tsx
"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Settings,
  Camera,
  MapPin,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";

import CombinedCategoryTab from "@/components/tabs/CategoriesTab";
import BasicInfoTab from "@/components/tabs/BasicInfoTab";
import MediaTab from "@/components/tabs/MediaTab";
import LocationTab from "@/components/tabs/LocationTab";
import FeaturesTab from "@/components/tabs/FeaturesTab";
import OtherInfoTab from "@/components/tabs/OtherInfoTab";

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

  const tabs = [
    { id: 1, label: "Kategori", icon: Home },
    { id: 2, label: "Temel Bilgiler", icon: Settings },
    { id: 3, label: "Medya", icon: Camera },
    { id: 4, label: "Konum", icon: MapPin },
    { id: 5, label: "Özellikler", icon: Star },
    { id: 6, label: "Diğer", icon: Users },
  ];

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabContainerRef.current) return;
    const scrollAmount = 200;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    tabContainerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  const renderTabContent = () => {
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
          <BasicInfoTab
            fourthStep={c.fourthStep}
            content={c.content}
            setContent={c.setContent}
            onTitleChange={c.handleTitleChange}
            onPriceValueChange={c.handlePriceValueChange}
            onPriceTypeChange={c.handlePriceTypeChange}
            onAdminNoteChange={(e: any) => c.updateFourthStep("adminNote" as any, e.target.value)}
            currencyOptions={currencyOptions}
          />
        );

      case 3:
        return (
          <MediaTab
            images={c.images}
            setImages={c.setImages}
            videoFile={c.videoFile}
            setVideoFile={c.setVideoFile}
            reOrderImages={c.reOrderImages}
            setReOrderImages={c.setReOrderImages}
            onImageChange={c.handleImageChange}
            onVideoChange={c.handleVideoChange}
            onRemoveImage={c.handleRemoveImage}
          />
        );

      case 4:
        return (
          <LocationTab
            fourthStep={c.fourthStep}
            marker={c.marker}
            setMarker={c.setMarker}
            onProvinceChange={(v: any) => c.updateFourthStep("province" as any, v.value)}
            onDistrictChange={(v: any) => c.updateFourthStep("district" as any, v.value)}
            onQuarterChange={(v: any) => c.updateFourthStep("quarter" as any, v.value)}
            onAddressChange={(e: any) => c.updateFourthStep("address" as any, e.target.value)}
            onParselChange={(e: any) => c.updateFourthStep("parsel" as any, e.target.value)}
            turkeyCities={c.turkeyCities}
          />
        );

      case 5:
        return (
          <FeaturesTab
            fourthStep={c.fourthStep}
            firstStep={c.firstStep}
            secondStep={c.secondStep}
            thirdStep={c.thirdStep}
            featuresStep={c.featuresStep}
            setFeaturesStep={c.setFeaturesStep}
            onElevatorToggle={(value: string) =>
              c.updateFourthStep("elevator" as any, { ...(c.fourthStep as any).elevator, value })
            }
            onInSiteToggle={(value: string) =>
              c.updateFourthStep("inSite" as any, { ...(c.fourthStep as any).inSite, value })
            }
            onBalconyToggle={(value: string) =>
              c.updateFourthStep("balcony" as any, { ...(c.fourthStep as any).balcony, value })
            }
            onIsFurnishedToggle={(value: string) =>
              c.updateFourthStep("isFurnished" as any, { ...(c.fourthStep as any).isFurnished, value })
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
          />
        );

      case 6:
        return (
          <OtherInfoTab
            fourthStep={c.fourthStep}
            customers={c.customers}
            advisors={c.advisors}
            isActiveAd={c.isActiveAd}
            setIsActiveAd={c.setIsActiveAd}
            onCustomerChange={(v: any) => c.updateFourthStep("customer" as any, v.value)}
            onAdvisorChange={(e: any) => c.updateFourthStep("advisor" as any, e.target.value)}
            onContractNoChange={(e: any) => c.updateFourthStep("contract_no" as any, e.target.value)}
            onContractDateChange={(e: any) => c.updateFourthStep("contract_date" as any, e.target.value)}
            onContractTimeChange={(e: any) =>
              c.updateFourthStep("contract_time" as any, { ...(c.fourthStep as any).contract_time, value: e.target.value })
            }
            onEidsValueChange={(e: any) =>
              c.updateFourthStep("eids" as any, { ...(c.fourthStep as any).eids, value: e.target.value })
            }
            onEidsNoChange={(e: any) =>
              c.updateFourthStep("eids" as any, { ...(c.fourthStep as any).eids, no: e.target.value })
            }
            onEidsDateChange={(e: any) =>
              c.updateFourthStep("eids" as any, { ...(c.fourthStep as any).eids, date: e.target.value })
            }
            onKeyChange={(e: any) =>
              c.updateFourthStep("key" as any, { ...(c.fourthStep as any).key, value: e.target.value })
            }
            onAdvisorProfileToggle={(value: string) =>
              c.updateFourthStep("advisor_profile" as any, { ...(c.fourthStep as any).advisor_profile, value })
            }
            onAgendaEmlakToggle={(value: string) =>
              c.updateFourthStep("agenda_emlak" as any, { ...(c.fourthStep as any).agenda_emlak, value })
            }
            onHomepageEmlakToggle={(value: string) =>
              c.updateFourthStep("homepage_emlak" as any, { ...(c.fourthStep as any).homepage_emlak, value })
            }
            onNewEmlakToggle={(value: string) =>
              c.updateFourthStep("new_emlak" as any, { ...(c.fourthStep as any).new_emlak, value })
            }
            onChanceEmlakToggle={(value: string) =>
              c.updateFourthStep("chance_emlak" as any, { ...(c.fourthStep as any).chance_emlak, value })
            }
            onSpecialEmlakToggle={(value: string) =>
              c.updateFourthStep("special_emlak" as any, { ...(c.fourthStep as any).special_emlak, value })
            }
            onOnwebEmlakToggle={(value: string) =>
              c.updateFourthStep("onweb_emlak" as any, { ...(c.fourthStep as any).onweb_emlak, value })
            }
            contractTimes={contractTimes}
            yesNoOptions={yesNoOptions}
            keyOptions={keyOptions}
          />
        );

      default:
        return null;
    }
  };

  const renderContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 h-1.5 w-full">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(c.activeTab / tabs.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-4 lg:p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="relative">
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
              disabled={scrollPosition === 0}
              type="button"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>

            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
              type="button"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>

            <div
              ref={tabContainerRef}
              className="flex overflow-x-auto pb-2 -mb-2 scrollbar-hide mx-8"
              onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            >
              <div className="flex space-x-1 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = c.activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => c.setActiveTab(tab.id)}
                      className={[
                        "group flex items-center gap-2 pb-3 px-3 font-medium text-xs lg:text-sm border-b-2",
                        "transition-all duration-200 whitespace-nowrap relative shrink-0",
                        "min-w-[100px] lg:min-w-[120px] justify-center",
                        isActive
                          ? "border-blue-500 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "p-1.5 rounded-lg transition-colors shrink-0",
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                        ].join(" ")}
                      >
                        <Icon size={16} />
                      </div>

                      <span className="font-medium text-xs lg:text-sm text-center leading-tight">
                        {tab.label}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[400px] lg:min-h-[500px]">{renderTabContent()}</div>

        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs text-gray-600 flex items-center gap-2">
            {(c.fourthStep as any).title ? (
              <>
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <span className="font-medium text-gray-800 truncate max-w-[200px]">
                  {(c.fourthStep as any).title}
                </span>
              </>
            ) : (
              "Henüz başlık girilmedi"
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={() => c.setActiveTab((t: number) => Math.max(1, t - 1))}
              disabled={c.activeTab === 1}
              whileHover={{ scale: c.activeTab === 1 ? 1 : 1.02 }}
              whileTap={{ scale: c.activeTab === 1 ? 1 : 0.98 }}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
            >
              <ArrowLeft size={16} />
              Geri
            </motion.button>

            {c.activeTab < tabs.length ? (
              <motion.button
                type="button"
                onClick={() => c.setActiveTab((t: number) => Math.min(tabs.length, t + 1))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold"
              >
                İleri
                <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={c.isSubmitting}
                className="flex items-center gap-2 px-6 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200 font-semibold"
              >
                {c.isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Yayınlanıyor...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    İlanı Yayınla
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">Yeni Emlak İlanı</h1>
                <p className="text-gray-600 text-sm lg:text-base truncate">
                  {(c.firstStep as any).selected.value && (c.secondStep as any).selected.value && (c.thirdStep as any).selected.value
                    ? `${(c.firstStep as any).selected.value} ${(c.secondStep as any).selected.value ? ">" : ""} ${(c.secondStep as any).selected.value} ${(c.thirdStep as any).selected.value ? ">" : ""} ${(c.thirdStep as any).selected.value}`
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

          {c.activeTab === tabs.length ? (
            <form onSubmit={c.handleSubmit}>{renderContent()}</form>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
