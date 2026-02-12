// src/components/tabs/DetailsTab.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Building,
  Calendar,
  Ruler,
  Flame,
  FileText,
  Compass,
  Building as BuildingIcon,
} from "lucide-react";
import { FormData, StepState } from "@/types/property";
import SimpleInput from "@/components/ui/SimpleInput";
import FeatureToggle from "@/components/ui/FeatureToggle";
import SimpleSelect from "@/components/ui/SimpleSelect";

interface DetailsTabProps {
  fourthStep: FormData;
  firstStep: StepState;
  secondStep: StepState;
  onRoomCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTotalFloorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBuildingAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNetAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGrossAreaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBalconyCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAcreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onElevatorToggle: (value: string) => void;
  onInSiteToggle: (value: string) => void;
  onBalconyToggle: (value: string) => void;
  onIsFurnishedToggle: (value: string) => void;
  onHeatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeedStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWhichSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onZoningStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  heatingOptions: any[];
  deedStatusOptions: any[];
  directionOptions: any[];
  zoningStatusOptions: any[];
}

export default function DetailsTab({
  fourthStep,
  firstStep,
  secondStep,
  onRoomCountChange,
  onFloorChange,
  onTotalFloorChange,
  onBuildingAgeChange,
  onNetAreaChange,
  onGrossAreaChange,
  onBalconyCountChange,
  onAcreChange,
  onElevatorToggle,
  onInSiteToggle,
  onBalconyToggle,
  onIsFurnishedToggle,
  onHeatingChange,
  onDeedStatusChange,
  onWhichSideChange,
  onZoningStatusChange,
  heatingOptions,
  deedStatusOptions,
  directionOptions,
  zoningStatusOptions,
}: DetailsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Emlak Özellikleri
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SimpleInput
              label="Oda Sayısı"
              value={fourthStep.roomCount}
              onChange={onRoomCountChange}
              placeholder="3"
              icon={Home}
            />
            <SimpleInput
              label="Bulunduğu Kat"
              value={fourthStep.floor}
              onChange={onFloorChange}
              type="number"
              placeholder="2"
              icon={Building}
            />
            <SimpleInput
              label="Toplam Kat"
              value={fourthStep.totalFloor}
              onChange={onTotalFloorChange}
              type="number"
              placeholder="5"
              icon={Building}
            />
            <SimpleInput
              label="Bina Yaşı"
              value={fourthStep.buildingAge}
              onChange={onBuildingAgeChange}
              type="number"
              placeholder="5"
              icon={Calendar}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alan Bilgileri
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SimpleInput
              label="Net Alan (m²)"
              value={fourthStep.netArea}
              onChange={onNetAreaChange}
              type="number"
              placeholder="120"
              icon={Ruler}
            />
            <SimpleInput
              label="Brüt Alan (m²)"
              value={fourthStep.grossArea}
              onChange={onGrossAreaChange}
              type="number"
              placeholder="140"
              icon={Ruler}
            />
            <SimpleInput
              label="Balkon Sayısı"
              value={fourthStep.balconyCount}
              onChange={onBalconyCountChange}
              type="number"
              placeholder="2"
              icon={Home}
            />
            {(firstStep.selected.value === "Arsa" ||
              firstStep.selected.value === "Arazi") && (
              <div className="col-span-2">
                <SimpleInput
                  label="Arsa Alanı"
                  value={fourthStep.acre}
                  onChange={onAcreChange}
                  placeholder="Alan giriniz"
                  icon={Ruler}
                />
                {fourthStep.acreText && (
                  <p className="text-sm text-gray-600 mt-1">
                    {fourthStep.acreText}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Temel Özellikler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureToggle
            label="Asansör"
            value={fourthStep.elevator.value}
            onChange={onElevatorToggle}
          />
          <FeatureToggle
            label="Site İçerisinde"
            value={fourthStep.inSite.value}
            onChange={onInSiteToggle}
          />
          <FeatureToggle
            label="Balkon"
            value={fourthStep.balcony.value}
            onChange={onBalconyToggle}
          />
          <FeatureToggle
            label="Eşyalı"
            value={fourthStep.isFurnished.value}
            onChange={onIsFurnishedToggle}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Ek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimpleSelect
            label="Isıtma Sistemi"
            value={fourthStep.heating.value}
            onChange={onHeatingChange}
            options={heatingOptions}
            icon={Flame}
          />
          {(secondStep.selected.value === "Satılık" ||
            secondStep.selected.value === "Devren Satılık") && (
            <SimpleSelect
              label="Tapu Durumu"
              value={fourthStep.deedStatus.value}
              onChange={onDeedStatusChange}
              options={deedStatusOptions}
              icon={FileText}
            />
          )}
          <SimpleSelect
            label="Cephe"
            value={fourthStep.whichSide.value}
            onChange={onWhichSideChange}
            options={directionOptions}
            icon={Compass}
          />
          {(firstStep.selected.value === "Arsa" ||
            firstStep.selected.value === "Arazi") && (
            <SimpleSelect
              label="İmar Durumu"
              value={fourthStep.zoningStatus.value}
              onChange={onZoningStatusChange}
              options={zoningStatusOptions}
              icon={BuildingIcon}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
