// src/features/admin/statistics/ui/components/AlertBanner.client.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Sparkles,
  X,
  Save,
  MousePointerClick,
  Eye,
  Target,
  MapPin,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

/* ── Types ── */
type AlertRule = {
  id: string;
  metric: "clicks" | "impressions" | "ctr" | "position";
  direction: "drop" | "rise";
  threshold: number; // percentage
  enabled: boolean;
};

type SavedAlerts = {
  rules: AlertRule[];
  updatedAt: string;
};

const STORAGE_KEY = "gsc-alert-settings";

const METRIC_OPTIONS: {
  value: AlertRule["metric"];
  label: string;
  icon: typeof MousePointerClick;
  iconColor: string;
}[] = [
  { value: "clicks", label: "Tiklama", icon: MousePointerClick, iconColor: "text-blue-600" },
  { value: "impressions", label: "Gosterim", icon: Eye, iconColor: "text-indigo-600" },
  { value: "ctr", label: "CTR", icon: Target, iconColor: "text-green-600" },
  { value: "position", label: "Pozisyon", icon: MapPin, iconColor: "text-amber-600" },
];

const DIRECTION_OPTIONS: { value: AlertRule["direction"]; label: string }[] = [
  { value: "drop", label: "duserse" },
  { value: "rise", label: "artarsa" },
];

const DEFAULT_RULE: Omit<AlertRule, "id"> = {
  metric: "clicks",
  direction: "drop",
  threshold: 20,
  enabled: true,
};

function generateId() {
  return `rule-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadAlerts(): SavedAlerts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedAlerts;
  } catch {
    return null;
  }
}

function saveAlerts(alerts: SavedAlerts) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

/* ── Modal Component ── */
function AlertSettingsModal({
  isOpen,
  onClose,
  initialRules,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialRules: AlertRule[];
  onSave: (rules: AlertRule[]) => void;
}) {
  const [rules, setRules] = useState<AlertRule[]>(initialRules);

  useEffect(() => {
    if (isOpen) {
      setRules(initialRules.length > 0 ? initialRules : [{ ...DEFAULT_RULE, id: generateId() }]);
    }
  }, [isOpen, initialRules]);

  const addRule = useCallback(() => {
    setRules((prev) => [...prev, { ...DEFAULT_RULE, id: generateId() }]);
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<AlertRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const handleSave = useCallback(() => {
    const enabledRules = rules.filter((r) => r.threshold > 0);
    onSave(enabledRules);
    onClose();
    toast.success(
      enabledRules.length > 0
        ? `${enabledRules.length} uyari kurali kaydedildi`
        : "Tum uyarilar kaldirildi"
    );
  }, [rules, onSave, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-xl z-50 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell size={16} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Uyari Ayarlari</h2>
                  <p className="text-[11px] text-gray-500">GSC metriklerinde degisiklik olursa bildirim alin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {rules.length === 0 && (
                <div className="text-center py-8">
                  <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Henuz uyari kurali yok</p>
                  <p className="text-[11px] text-gray-400">Asagidaki butona tiklayarak yeni kural ekleyin</p>
                </div>
              )}

              {rules.map((rule) => {
                const metricOpt = METRIC_OPTIONS.find((m) => m.value === rule.metric);
                const MetricIcon = metricOpt?.icon ?? MousePointerClick;

                return (
                  <div
                    key={rule.id}
                    className={`border rounded-xl p-4 transition-colors ${
                      rule.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MetricIcon size={14} className={metricOpt?.iconColor ?? "text-gray-400"} />
                        <span className="text-xs font-medium text-gray-700">Kural</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
                          className={`w-8 h-5 rounded-full transition-colors relative ${
                            rule.enabled ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${
                              rule.enabled ? "translate-x-[14px]" : "translate-x-[3px]"
                            }`}
                          />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removeRule(rule.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Rule config row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Metric select */}
                      <select
                        value={rule.metric}
                        onChange={(e) => updateRule(rule.id, { metric: e.target.value as AlertRule["metric"] })}
                        className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {METRIC_OPTIONS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>

                      {/* Threshold input */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">%</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={rule.threshold}
                          onChange={(e) => updateRule(rule.id, { threshold: Math.max(1, Math.min(100, Number(e.target.value))) })}
                          className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center text-gray-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      {/* Direction select */}
                      <select
                        value={rule.direction}
                        onChange={(e) => updateRule(rule.id, { direction: e.target.value as AlertRule["direction"] })}
                        className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        {DIRECTION_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>

                      <span className="text-[11px] text-gray-400">bildirim gonder</span>
                    </div>

                    {/* Preview text */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      &ldquo;{metricOpt?.label} %{rule.threshold} {rule.direction === "drop" ? "duserse" : "artarsa"} beni bilgilendir&rdquo;
                    </p>
                  </div>
                );
              })}

              {/* Add rule button */}
              <button
                type="button"
                onClick={addRule}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50 transition-colors"
              >
                + Yeni Kural Ekle
              </button>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Iptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Save size={14} />
                Kaydet
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Main AlertBanner Component ── */
export default function AlertBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedRules, setSavedRules] = useState<AlertRule[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = loadAlerts();
    if (saved) {
      setSavedRules(saved.rules);
    }
  }, []);

  const handleSave = useCallback((rules: AlertRule[]) => {
    setSavedRules(rules);
    saveAlerts({ rules, updatedAt: new Date().toISOString() });
  }, []);

  const activeCount = savedRules.filter((r) => r.enabled).length;
  const hasAlerts = activeCount > 0;

  if (!mounted) return null;

  return (
    <>
      <div
        className={`rounded-xl p-3.5 flex items-center justify-between group hover:shadow-sm transition-shadow ${
          hasAlerts
            ? "bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200/50"
            : "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${
              hasAlerts ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            <Bell className={`w-4 h-4 ${hasAlerts ? "text-green-600" : "text-amber-600"}`} />
            {hasAlerts ? (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={8} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <Sparkles size={7} className="text-white" />
              </div>
            )}
          </div>
          <div>
            {hasAlerts ? (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  {activeCount} uyari aktif
                </p>
                <p className="text-[11px] text-gray-500">
                  {savedRules
                    .filter((r) => r.enabled)
                    .map((r) => {
                      const m = METRIC_OPTIONS.find((o) => o.value === r.metric);
                      return `${m?.label ?? r.metric} %${r.threshold} ${r.direction === "drop" ? "\u2193" : "\u2191"}`;
                    })
                    .join(" \u2022 ")}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900">Uyari ayarlanmadi</p>
                <p className="text-[11px] text-gray-500">
                  Verileriniz buyuk olcude degistiginde bildirim alin
                </p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className={`px-4 py-2 rounded-lg text-[11px] font-medium text-white transition-colors flex items-center gap-1.5 ${
            hasAlerts
              ? "bg-green-600 hover:bg-green-700"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {hasAlerts ? "Uyarilari Duzenle" : "Uyari Ayarla"}
          <ChevronRight size={12} />
        </button>
      </div>

      <AlertSettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRules={savedRules}
        onSave={handleSave}
      />
    </>
  );
}
