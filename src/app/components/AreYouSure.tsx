import React from "react";
import { X, AlertTriangle } from "lucide-react";

const AreYouSure = ({
  open,
  onClose,
  onConfirm,
  title = "Emin misiniz?",
  message = "Bu işlem geri alınamaz. Devam etmek istiyor musunuz?",
  confirmText = "Evet, Sil",
  cancelText = "İptal",
  type = "delete",
}: any) => {
  const typeColors = {
    delete: { main: "#ef4444", light: "#fef2f2", text: "#dc2626" },
    warning: { main: "#f59e0b", light: "#fffbeb", text: "#d97706" },
    info: { main: "#3b82f6", light: "#eff6ff", text: "#2563eb" },
    success: { main: "#10b981", light: "#ecfdf5", text: "#059669" },
  } as any;

  const colors = typeColors[type] || typeColors.delete;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden relative">
        {/* Kapatma butonu */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* İkon bölümü */}
        <div className="flex justify-center mt-6 mb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.light }}
          >
            <AlertTriangle size={32} style={{ color: colors.main }} />
          </div>
        </div>

        {/* Başlık */}
        <div className="text-center px-6 pb-1">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Mesaj */}
        <div className="text-center px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Butonlar */}
        <div className="flex justify-center gap-3 pb-6 px-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-w-[120px]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: colors.main,
              color: "white",
            }}
            className="px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium min-w-[120px]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSure;
