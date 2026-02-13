// Desktop price summary section with enhanced UI
import React from "react";
import { MapPin, Flag } from "lucide-react";
import { BrandCard } from "@/features/theme/components/BrandCard";
import DesktopSpecRow from "../shared/DesktopSpecRow";
import SpecRowGroup from "../shared/SpecRowGroup";
import type { Row } from "../../types";

type Props = {
  feeText: string;
  locationText: string;
  desktopRows: Row[];
  detailsExtraRows: Row[];
  featureExtraRows: Row[];
  creditOffersEl: React.ReactNode;
  complaintText: string;
  onComplaintClick?: () => void;
};

export default function PriceSummaryDesktop({
  feeText,
  locationText,
  desktopRows,
  detailsExtraRows,
  featureExtraRows,
  creditOffersEl,
  complaintText,
  onComplaintClick,
}: Props) {
  return (
    <BrandCard className="hidden lg:block p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header with price */}
      <div className="flex items-start justify-between gap-4">
        <div className="text-xl font-bold text-blue-700 leading-tight">
          {feeText}
        </div>
        {creditOffersEl}
      </div>

      {/* Location with icon and better styling */}
      <div className="mt-3 flex items-center gap-2 text-sm text-blue-700 font-semibold">
        <MapPin size={16} className="text-blue-600" />
        <span>{locationText || "Konum belirtilmemiş"}</span>
      </div>

      {/* Enhanced divider with gradient */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Main specs with improved spacing */}
      <div className="mt-4 space-y-0.5">
        {desktopRows.map((r) => (
          <DesktopSpecRow
            key={r.label}
            label={r.label}
            value={r.value}
            important={r.important}
            valueClassName={r.valueClassName}
          />
        ))}
      </div>

      {/* Extra sections with headers */}
      <SpecRowGroup
        title="Diğer Bilgiler"
        rows={detailsExtraRows}
        showDivider
      />

      <SpecRowGroup
        title="Tüm Özellikler"
        rows={featureExtraRows}
        showDivider
      />

      {/* Complaint button with better hover */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
        <button
          type="button"
          onClick={onComplaintClick}
          className="text-sm text-blue-700 hover:text-blue-800 transition-colors duration-200 inline-flex items-center gap-2 group"
        >
          <Flag size={16} className="text-gray-500 group-hover:text-blue-700 transition-colors" />
          {complaintText}
        </button>
      </div>
    </BrandCard>
  );
}
