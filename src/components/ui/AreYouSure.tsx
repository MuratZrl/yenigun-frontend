// src/components/ui/AreYouSure.tsx
import React from "react";
import { Poppins } from "next/font/google";
import { X, AlertTriangle } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Types ── */
type ConfirmType = "delete" | "warning" | "info" | "success";

type TypeTheme = {
  gradient: string;
  gradientHover: string;
  shadow: string;
  shadowHover: string;
  iconBg: string;
  accentLine: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
};

/* ── Theme map ── */
const themes: Record<ConfirmType, TypeTheme> = {
  delete: {
    gradient: "from-red-500 to-red-600",
    gradientHover: "hover:from-red-600 hover:to-red-700",
    shadow: "shadow-red-500/25",
    shadowHover: "hover:shadow-red-600/30",
    iconBg: "from-red-500 to-red-600",
    accentLine: "from-red-500 via-rose-500 to-orange-500",
  },
  warning: {
    gradient: "from-amber-500 to-amber-600",
    gradientHover: "hover:from-amber-600 hover:to-amber-700",
    shadow: "shadow-amber-500/25",
    shadowHover: "hover:shadow-amber-600/30",
    iconBg: "from-amber-500 to-amber-600",
    accentLine: "from-amber-500 via-orange-500 to-yellow-500",
  },
  info: {
    gradient: "from-blue-600 to-blue-700",
    gradientHover: "hover:from-blue-700 hover:to-blue-800",
    shadow: "shadow-blue-600/25",
    shadowHover: "hover:shadow-blue-700/30",
    iconBg: "from-blue-500 to-blue-600",
    accentLine: "from-blue-500 via-indigo-500 to-purple-500",
  },
  success: {
    gradient: "from-emerald-500 to-emerald-600",
    gradientHover: "hover:from-emerald-600 hover:to-emerald-700",
    shadow: "shadow-emerald-500/25",
    shadowHover: "hover:shadow-emerald-600/30",
    iconBg: "from-emerald-500 to-emerald-600",
    accentLine: "from-emerald-500 via-teal-500 to-cyan-500",
  },
};

/* ── Component ── */
const AreYouSure = ({
  open,
  onClose,
  onConfirm,
  title = "Emin misiniz?",
  message = "Bu işlem geri alınamaz. Devam etmek istiyor musunuz?",
  confirmText = "Evet, Sil",
  cancelText = "İptal",
  type = "delete",
}: Props) => {
  const theme = themes[type] ?? themes.delete;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[420px] mx-4 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        style={PoppinsFont.style}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5">
          {/* Gradient accent line */}
          <div className={`absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r ${theme.accentLine} rounded-full`} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center shadow-lg ${theme.shadow}`}>
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">{title}</h2>
                <p className="text-xs text-black/38 mt-0.5">{message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 px-6 pb-6 pt-1 border-t border-black/6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-black/50 border border-black/10 rounded-xl hover:bg-black/[0.03] hover:text-black/70 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${theme.gradient} rounded-xl ${theme.gradientHover} shadow-lg ${theme.shadow} ${theme.shadowHover} transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSure;

