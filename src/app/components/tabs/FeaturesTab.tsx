"use client";
import React from "react";
import { motion } from "framer-motion";
import { Flame, FileText, Compass, Building } from "lucide-react";
import { FormData, StepState } from "@/app/types/property";
import FeatureToggle from "@/app/components/ui/FeatureToggle";
import SimpleSelect from "@/app/components/ui/SimpleSelect";

interface FeaturesTabProps {
  fourthStep: FormData;
  firstStep: StepState;
  secondStep: StepState;
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

export default function FeaturesTab({
  fourthStep,
  firstStep,
  secondStep,
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
}: FeaturesTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="space-y-4">
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
              icon={Building}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
