// src/components/modals/SendMessages.tsx
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { X, Send, MessageCircle, Users } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Styles (matching AdminModal) ── */
const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

const labelClass = "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

const sectionClass = "space-y-4";

/* ── Component ── */
const SendMessage = ({ open, setOpen, users, type, allUsers }: any) => {
  const handleClose = () => {
    setOpen({
      ...open,
      open: false,
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: type,
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form gönderildi:", formData);
  };

  if (!open) return null;

  const selectedUsers = allUsers.filter((user: any) => users.includes(user.id));

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[540px] mx-4 max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        style={PoppinsFont.style}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5">
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Send size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">Toplu Mesaj Gönder</h2>
                <p className="text-xs text-black/38 mt-0.5">{selectedUsers.length} kişiye mesaj gönderin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">

          {/* ─ Section: Alıcılar ─ */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Alıcılar</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  Seçilen Kişiler ({selectedUsers.length})
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2.5 bg-gray-50 border border-black/12 rounded-lg">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user: any) => (
                    <span
                      key={user.id}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-medium"
                    >
                      {user.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-black/30">Kişi seçilmedi</span>
                )}
              </div>
            </div>
          </div>

          {/* ─ Section: Mesaj Detayları ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Mesaj Detayları</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Mesaj Tipi */}
            <div>
              <label className={labelClass}>Mesaj Tipi</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "green" },
                  { value: "sms", label: "SMS", icon: Send, color: "blue" },
                ] as const).map((t) => {
                  const isSelected = formData.type.includes(t.value);
                  return (
                    <label
                      key={t.value}
                      className={`flex items-center justify-center gap-2 h-[42px] rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                        isSelected
                          ? t.color === "green"
                            ? "border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-500/10"
                            : "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                          : "border-black/8 bg-gray-50/50 text-black/40 hover:bg-gray-50 hover:text-black/60 hover:border-black/12"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t.value}
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, type: t.value })}
                        className="sr-only"
                      />
                      <t.icon size={16} />
                      {t.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Mesaj Başlığı */}
            <div>
              <label className={labelClass}>
                Mesaj Başlığı <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Mesaj başlığını giriniz"
                required
                className={`${inputBase} px-3 py-2.5`}
              />
            </div>

            {/* Mesaj İçeriği */}
            <div>
              <label className={labelClass}>
                Mesaj <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Mesaj içeriğini giriniz"
                required
                className="w-full text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30 px-3 py-2.5 resize-vertical"
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-black/6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-black/50 border border-black/10 rounded-xl hover:bg-black/[0.03] hover:text-black/70 transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-600/25 hover:shadow-green-700/30 transition-all"
            >
              Mesajı Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
