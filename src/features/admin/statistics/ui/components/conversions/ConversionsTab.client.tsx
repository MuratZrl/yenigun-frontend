"use client";

import ConversionMetricCards from "./ConversionMetricCards.client";
import ConversionTrendChart from "./ConversionTrendChart.client";
import ConversionBySourceCard from "./ConversionBySourceCard.client";
import TopConvertingPagesCard from "./TopConvertingPagesCard.client";

export default function ConversionsTab() {
  return (
    <>
      {/* Row 1: Metric cards */}
      <div className="mb-3">
        <ConversionMetricCards />
      </div>

      {/* Row 2: Conversion trend chart (full width) */}
      <div className="mb-3">
        <ConversionTrendChart />
      </div>

      {/* Row 3: By source + Top converting pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ConversionBySourceCard />
        <TopConvertingPagesCard />
      </div>
    </>
  );
}
