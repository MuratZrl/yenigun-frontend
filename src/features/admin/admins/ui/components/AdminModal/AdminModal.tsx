import React from "react";
import { Poppins } from "next/font/google";
import {
  X,
  UserPlus,
  UserPen,
  Mail,
  Phone,
  Lock,
  Calendar,
  ImagePlus,
  Link as LinkIcon,
  Shield,
  ShieldCheck,
} from "lucide-react";

import type { AdminModalProps } from "./types";
import { useAdminModal } from "./useAdminModal";
import {
  MODE_CONFIG,
  inputBase,
  labelClass,
  sectionClass,
  formatPhoneNumber,
  formatDateInput,
  parseDateToISO,
  dateToDisplay,
  displayToDate,
} from "./utils";

const PoppinsFont = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const MODE_ICONS = { create: UserPlus, edit: UserPen } as const;

export default function AdminModal({ open, mode, user, onClose }: AdminModalProps) {
  const config = MODE_CONFIG[mode];
  const Icon = MODE_ICONS[mode];

  const {
    fileInputRef, form, setForm, fileName,
    handleClose, handleSubmit, handleImageChange,
  } = useAdminModal({ open, mode, user, onClose });

  if (!open) return null;

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
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5">
          <div className={`absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r ${config.accentLine} rounded-full`} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 bg-gradient-to-br ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg ${config.iconShadow}`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">{config.title}</h2>
                <p className="text-xs text-black/38 mt-0.5">{config.subtitle}</p>
              </div>
            </div>
            <button type="button" onClick={handleClose} className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Kişisel Bilgiler */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Kişisel Bilgiler</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Ad & Soyad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Ad <span className="text-red-400">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} autoComplete="off" required placeholder="Ad" className={`${inputBase} px-3 py-2.5`} />
              </div>
              <div>
                <label className={labelClass}>Soyad <span className="text-red-400">*</span></label>
                <input type="text" value={form.surname} onChange={(e) => setForm((prev) => ({ ...prev, surname: e.target.value }))} autoComplete="off" required placeholder="Soyad" className={`${inputBase} px-3 py-2.5`} />
              </div>
            </div>

            {/* Cinsiyet */}
            <div>
              <label className={labelClass}>Cinsiyet</label>
              <div className="flex gap-3">
                {(["Erkek", "Kadın"] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex-1 flex items-center justify-center gap-2 h-[42px] rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                      form.gender === g
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                        : "border-black/8 bg-gray-50/50 text-black/40 hover:bg-gray-50 hover:text-black/60 hover:border-black/12"
                    }`}
                  >
                    <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => setForm((prev) => ({ ...prev, gender: g }))} className="sr-only" />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Doğum Tarihi & Profil Resmi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Doğum Tarihi</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="GG/AA/YY"
                    value={dateToDisplay(form.birth)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const display = formatDateInput(e.target.value);
                      if (mode === "create") {
                        const iso = parseDateToISO(display);
                        setForm((prev) => ({ ...prev, birth: iso || display }));
                      } else {
                        const parsed = displayToDate(display);
                        setForm((prev) => ({ ...prev, birth: parsed }));
                      }
                    }}
                    maxLength={8}
                    autoComplete="off"
                    className={`${inputBase} pl-9 pr-3`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Profil Resmi</label>
                <input ref={fileInputRef} type="file" accept=".jpg, .jpeg, .png" onChange={handleImageChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[42px] flex items-center gap-2.5 px-3 bg-gray-50 border border-black/12 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer text-left"
                >
                  <ImagePlus size={14} className="text-black/25 shrink-0" />
                  <span className={`text-xs truncate ${fileName ? "text-black/70" : "text-black/30"}`}>
                    {fileName || "Dosya seç..."}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* İletişim */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">İletişim</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>E-Posta <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input type="email" placeholder="mail@example.com" value={form.mail} onChange={(e) => setForm((prev) => ({ ...prev, mail: e.target.value }))} autoComplete="off" required className={`${inputBase} pl-9 pr-3 py-2.5`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Telefon <span className="text-red-400">*</span></label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 h-[42px] flex items-center gap-1.5 pl-3 pr-2 border-r border-black/12 pointer-events-none">
                    <Phone size={14} className="text-black/25" />
                    <span className="text-xs font-medium text-black/40">+90</span>
                  </div>
                  <input
                    type="text"
                    placeholder="(5XX) XXX XX XX"
                    value={form.gsmNumber}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      setForm((prev) => ({ ...prev, gsmNumber: formattedValue }));
                    }}
                    autoComplete="off"
                    required
                    className={`${inputBase} pl-[76px] pr-3`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Güvenlik & Yetki */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Güvenlik & Yetki</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Şifre & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  {config.passwordLabel} {config.passwordRequired && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} autoComplete="off" placeholder={config.passwordPlaceholder} required={config.passwordRequired} className={`${inputBase} pl-9 pr-3 py-2.5`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input type="text" value={form.link} onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))} autoComplete="off" placeholder="örn: yenigunemlak" className={`${inputBase} pl-9 pr-3 py-2.5`} />
                </div>
              </div>
            </div>

            {/* Yetki */}
            <div>
              <label className={labelClass}>Yetki <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "head_admin", label: "Baş Yetkili", icon: ShieldCheck, desc: "Tam erişim" },
                  { value: "admin", label: "Yetkili", icon: Shield, desc: "Sınırlı erişim" },
                ] as const).map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 px-3.5 h-[54px] rounded-xl border cursor-pointer transition-all ${
                      form.role === r.value
                        ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/10"
                        : "border-black/8 bg-gray-50/50 hover:bg-gray-50 hover:border-black/12"
                    }`}
                  >
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={() => setForm((prev) => ({ ...prev, role: r.value }))} className="sr-only" />
                    <r.icon size={18} className={form.role === r.value ? "text-blue-600" : "text-black/25"} />
                    <div>
                      <p className={`text-sm font-medium ${form.role === r.value ? "text-blue-700" : "text-black/60"}`}>{r.label}</p>
                      <p className={`text-[10px] ${form.role === r.value ? "text-blue-500" : "text-black/30"}`}>{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-black/6">
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-black/50 border border-black/10 rounded-xl hover:bg-black/[0.03] hover:text-black/70 transition-all">
              İptal
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 transition-all">
              {config.submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
