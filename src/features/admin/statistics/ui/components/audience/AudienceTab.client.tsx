// src/features/admin/statistics/ui/components/audience/AudienceTab.client.tsx
"use client";

import AudienceMetricCards from "./AudienceMetricCards.client";
import UserTrendChart from "./UserTrendChart.client";
import NewVsReturningCard from "./NewVsReturningCard.client";
import SessionsByCountryCard from "./SessionsByCountryCard.client";
import DemographicsCard from "./DemographicsCard.client";
import ActiveHoursCard from "./ActiveHoursCard.client";

export default function AudienceTab() {
  return (
    <>
      {/* Row 1: Metric cards */}
      <div className="mb-3">
        <AudienceMetricCards />
      </div>

      {/* Row 2: User trend chart (full width) */}
      <div className="mb-3">
        <UserTrendChart />
      </div>

      {/* Row 3: New vs Returning + Sessions by Country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <NewVsReturningCard />
        <SessionsByCountryCard />
      </div>

      {/* Row 4: Demographics + Active Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7">
          <DemographicsCard />
        </div>
        <div className="lg:col-span-5">
          <ActiveHoursCard />
        </div>
      </div>
    </>
  );
}
