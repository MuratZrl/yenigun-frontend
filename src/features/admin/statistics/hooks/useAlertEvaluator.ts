// src/features/admin/statistics/hooks/useAlertEvaluator.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { GSCData, GSCRow } from "../api/gscApi";

/* ── Shared types (must match AlertBanner) ── */

export type AlertMetric = "clicks" | "impressions" | "ctr" | "position";
export type AlertDirection = "drop" | "rise";

export type AlertRule = {
  id: string;
  metric: AlertMetric;
  direction: AlertDirection;
  threshold: number;
  enabled: boolean;
};

export type TriggeredAlert = {
  ruleId: string;
  metric: AlertMetric;
  direction: AlertDirection;
  threshold: number;
  actualChange: number; // percentage change (signed)
  metricLabel: string;
};

/* ── Constants ── */

const DEDUP_KEY = "gsc-alert-last-fingerprint";

const METRIC_LABELS: Record<AlertMetric, string> = {
  clicks: "Tiklama",
  impressions: "Gosterim",
  ctr: "CTR",
  position: "Pozisyon",
};

/* ── Helpers ── */

function computeFingerprint(data: GSCData): string {
  const t = data.totals;
  const dateCount = data.byDate.length;
  if (!t) return `empty-${dateCount}`;
  return `${dateCount}-${t.clicks}-${t.impressions}-${t.ctr.toFixed(4)}-${t.position.toFixed(2)}`;
}

/** Split byDate into two halves and compute % change per metric */
function computeTrends(byDate: GSCRow[]): Record<AlertMetric, number> {
  const defaults: Record<AlertMetric, number> = {
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };

  if (byDate.length < 2) return defaults;

  const mid = Math.floor(byDate.length / 2);
  const previousDays = byDate.slice(0, mid);
  const recentDays = byDate.slice(mid);

  function sum(rows: GSCRow[], key: "clicks" | "impressions"): number {
    return rows.reduce((a, r) => a + r[key], 0);
  }

  function avg(rows: GSCRow[], key: "ctr" | "position"): number {
    if (rows.length === 0) return 0;
    return rows.reduce((a, r) => a + r[key], 0) / rows.length;
  }

  function pctChange(prev: number, curr: number): number {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / Math.abs(prev)) * 100;
  }

  const prevClicks = sum(previousDays, "clicks");
  const currClicks = sum(recentDays, "clicks");

  const prevImpressions = sum(previousDays, "impressions");
  const currImpressions = sum(recentDays, "impressions");

  const prevCtr = avg(previousDays, "ctr");
  const currCtr = avg(recentDays, "ctr");

  const prevPosition = avg(previousDays, "position");
  const currPosition = avg(recentDays, "position");

  return {
    clicks: pctChange(prevClicks, currClicks),
    impressions: pctChange(prevImpressions, currImpressions),
    ctr: pctChange(prevCtr, currCtr),
    // Position: lower is better, so invert the sign for user-facing direction
    // A "drop" in position value means improvement, a "rise" means worsening
    // We keep raw change here; evaluation logic handles inversion
    position: pctChange(prevPosition, currPosition),
  };
}

function evaluateRules(
  rules: AlertRule[],
  trends: Record<AlertMetric, number>
): TriggeredAlert[] {
  const triggered: TriggeredAlert[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    const change = trends[rule.metric];

    let isTriggered = false;

    if (rule.metric === "position") {
      // Position is inverted: higher position value = worse ranking
      // "drop" in position context means "position got worse" = value increased
      // "rise" in position context means "position improved" = value decreased
      if (rule.direction === "drop" && change >= rule.threshold) {
        isTriggered = true; // Position value rose = ranking dropped
      } else if (rule.direction === "rise" && change <= -rule.threshold) {
        isTriggered = true; // Position value dropped = ranking improved
      }
    } else {
      // Normal metrics: clicks, impressions, ctr
      if (rule.direction === "drop" && change <= -rule.threshold) {
        isTriggered = true;
      } else if (rule.direction === "rise" && change >= rule.threshold) {
        isTriggered = true;
      }
    }

    if (isTriggered) {
      triggered.push({
        ruleId: rule.id,
        metric: rule.metric,
        direction: rule.direction,
        threshold: rule.threshold,
        actualChange: change,
        metricLabel: METRIC_LABELS[rule.metric],
      });
    }
  }

  return triggered;
}

/* ── Hook ── */

export function useAlertEvaluator(
  gscData: GSCData | null,
  rules: AlertRule[]
): TriggeredAlert[] {
  const [triggered, setTriggered] = useState<TriggeredAlert[]>([]);
  const toastedRef = useRef(false);

  useEffect(() => {
    if (!gscData || gscData.byDate.length < 4) {
      setTriggered([]);
      return;
    }

    const enabledRules = rules.filter((r) => r.enabled);
    if (enabledRules.length === 0) {
      setTriggered([]);
      return;
    }

    // Compute fingerprint for dedup
    const fingerprint = computeFingerprint(gscData);
    const rulesFingerprint = enabledRules
      .map((r) => `${r.id}-${r.metric}-${r.direction}-${r.threshold}`)
      .join("|");
    const fullFingerprint = `${fingerprint}::${rulesFingerprint}`;

    // Check if we already evaluated this exact data+rules combo
    const lastFingerprint = localStorage.getItem(DEDUP_KEY);

    // Compute trends
    const trends = computeTrends(gscData.byDate);

    // Debug: log trends to console so user can verify
    console.log("[Alert Evaluator] byDate count:", gscData.byDate.length);
    console.log("[Alert Evaluator] Trends:", {
      clicks: `${trends.clicks.toFixed(1)}%`,
      impressions: `${trends.impressions.toFixed(1)}%`,
      ctr: `${trends.ctr.toFixed(1)}%`,
      position: `${trends.position.toFixed(1)}%`,
    });

    // Evaluate rules
    const alerts = evaluateRules(enabledRules, trends);
    setTriggered(alerts);

    console.log("[Alert Evaluator] Triggered:", alerts.length, "alerts", alerts);

    // Only show toasts if this is new data (fingerprint changed)
    if (fullFingerprint !== lastFingerprint && alerts.length > 0 && !toastedRef.current) {
      toastedRef.current = true;
      localStorage.setItem(DEDUP_KEY, fullFingerprint);

      // Show a single summary toast
      const lines = alerts.map((a) => {
        const dir = a.direction === "drop" ? "dustu" : "artti";
        const absChange = Math.abs(a.actualChange).toFixed(1);
        return `${a.metricLabel} %${absChange} ${dir} (esik: %${a.threshold})`;
      });

      toast.warning(
        `⚠ ${alerts.length} uyari tetiklendi:\n${lines.join("\n")}`,
        {
          autoClose: 8000,
          style: { whiteSpace: "pre-line" },
        }
      );
    } else if (fullFingerprint !== lastFingerprint && alerts.length === 0) {
      // New data, no alerts — update fingerprint silently
      localStorage.setItem(DEDUP_KEY, fullFingerprint);
    }

    // Reset toast ref when fingerprint changes for next evaluation
    if (fullFingerprint !== lastFingerprint) {
      toastedRef.current = false;
    }
  }, [gscData, rules]);

  return triggered;
}
