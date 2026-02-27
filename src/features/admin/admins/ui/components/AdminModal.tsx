// src/components/modals/AdminModal.tsx

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { toast } from "react-toastify";
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
import api from "@/lib/api";

import type { AdminUser } from "@/features/admin/admins/model/types";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Types ── */
type FormState = {
  uid: number | string;
  profilePicture: string;
  name: string;
  surname: string;
  mail: string;
  birth: string | Date;
  role: string;
  password: string;
  gsmNumber: string;
  gender: string;
  link: string;
  image?: File | null;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  user: AdminUser | null;
  onClose: () => void;
};

/* ── Helpers ── */
const EMPTY_FORM: FormState = {
  uid: "",
  profilePicture: "",
  name: "",
  surname: "",
  mail: "",
  birth: "",
  role: "",
  link: "",
  password: "",
  gsmNumber: "",
  gender: "",
  image: null,
};

function formatPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length > 10) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  digits = digits.slice(0, 10);

  let result = "";
  if (digits.length > 0) result = "(" + digits.slice(0, Math.min(3, digits.length));
  if (digits.length >= 3) result += ") ";
  if (digits.length > 3) result += digits.slice(3, Math.min(6, digits.length));
  if (digits.length > 6) result += " " + digits.slice(6, Math.min(8, digits.length));
  if (digits.length > 8) result += " " + digits.slice(8, 10);

  return result;
}

function cleanPhoneNumber(formattedPhone: string): string {
  const digits = formattedPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) return digits.slice(0, 11);
  return "0" + digits.slice(0, 10);
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const currentYY = new Date().getFullYear() % 100;
  let result = "";

  if (digits.length >= 1) {
    let day = parseInt(digits.slice(0, Math.min(digits.length, 2)));
    if (digits.length === 1 && day > 3) day = 3;
    if (digits.length >= 2 && day > 31) day = 31;
    if (day === 0 && digits.length >= 2) day = 1;
    result = String(day).padStart(digits.length >= 2 ? 2 : 1, "0");
  }

  if (digits.length >= 3) {
    let month = parseInt(digits.slice(2, Math.min(digits.length, 4)));
    if (digits.length === 3 && month > 1) month = 1;
    if (digits.length >= 4 && month > 12) month = 12;
    if (month === 0 && digits.length >= 4) month = 1;
    result += "/" + String(month).padStart(digits.length >= 4 ? 2 : 1, "0");
  }

  if (digits.length >= 5) {
    let year = parseInt(digits.slice(4, Math.min(digits.length, 6)));
    if (digits.length >= 6) {
      const fullYear = year > 50 ? 1900 + year : 2000 + year;
      const currentFullYear = new Date().getFullYear();
      if (fullYear > currentFullYear) year = currentYY;
    }
    result += "/" + String(year).padStart(digits.length >= 6 ? 2 : 1, "0");
  }

  return result;
}

function dateToDisplay(date: string | Date): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

function displayToDate(formatted: string): Date | string {
  const parts = formatted.split("/");
  if (parts.length !== 3 || parts[2].length !== 2) return formatted;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const yearShort = parseInt(parts[2]);
  const yearFull = yearShort > 50 ? 1900 + yearShort : 2000 + yearShort;
  return new Date(yearFull, month, day);
}

function parseDateToISO(formatted: string): string {
  const parts = formatted.split("/");
  if (parts.length !== 3 || parts[2].length !== 2) return "";
  const day = parts[0];
  const month = parts[1];
  const yearShort = parts[2];
  const yearFull = parseInt(yearShort) > 50 ? `19${yearShort}` : `20${yearShort}`;
  return `${yearFull}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function buildFormFromUser(user: AdminUser): FormState {
  const formattedGsmNumber = user.gsmNumber
    ? formatPhoneNumber(user.gsmNumber)
    : "";

  return {
    uid: user.uid,
    profilePicture: user.profilePicture ?? "",
    name: user.name ?? "",
    surname: user.surname ?? "",
    mail: user.mail ?? "",
    birth: user.birth
      ? new Date(user.birth.year, user.birth.month, user.birth.day)
      : "",
    role: user.role ?? "",
    password: "",
    gsmNumber: formattedGsmNumber,
    gender: user.gender === "male" ? "Erkek" : user.gender === "female" ? "Kadın" : "",
    link: "",
    image: null,
  };
}

/* ── Mode config ── */
const MODE_CONFIG = {
  create: {
    icon: UserPlus,
    title: "Yeni Yetkili Oluştur",
    subtitle: "Yetkili bilgilerini doldurun",
    accentLine: "from-emerald-500 via-blue-500 to-purple-500",
    iconBg: "from-emerald-500 to-emerald-600",
    iconShadow: "shadow-emerald-500/25",
    submitText: "Yetkili Oluştur",
    passwordLabel: "Şifre",
    passwordPlaceholder: "Min. 6 karakter",
    passwordRequired: true,
  },
  edit: {
    icon: UserPen,
    title: "Yetkiliyi Düzenle",
    subtitle: "Yetkili bilgilerini güncelleyin",
    accentLine: "from-blue-500 via-indigo-500 to-purple-500",
    iconBg: "from-blue-500 to-blue-600",
    iconShadow: "shadow-blue-500/25",
    submitText: "Yetkiliyi Kaydet",
    passwordLabel: "Yeni Şifre",
    passwordPlaceholder: "Boş bırakılabilir",
    passwordRequired: false,
  },
} as const;

/* ── Styles ── */
const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

const labelClass = "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

const sectionClass = "space-y-4";

/* ── Component ── */
const AdminModal = ({ open, mode, user, onClose }: Props) => {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && user) {
      setForm(buildFormFromUser(user));
    } else {
      setForm(EMPTY_FORM);
    }
    setFileName("");
  }, [open, mode, user]);

  const handleClose = () => {
    onClose();
    setForm(EMPTY_FORM);
    setFileName("");
  };

  const handleSubmitCreate = () => {
    const cleanedGsmNumber = cleanPhoneNumber(form.gsmNumber);

    let birthPayload: { day: number; month: number; year: number } | undefined;
    if (form.birth) {
      const iso = typeof form.birth === "string" ? form.birth : "";
      if (iso && iso.includes("-")) {
        const d = new Date(iso);
        birthPayload = {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        };
      } else if (form.birth instanceof Date) {
        birthPayload = {
          day: form.birth.getDate(),
          month: form.birth.getMonth() + 1,
          year: form.birth.getFullYear(),
        };
      }
    }

    api
      .post("/admin/create-admin", {
        name: form.name,
        surname: form.surname,
        mail: form.mail,
        gender: form.gender === "Erkek" ? "male" : "female",
        gsmNumber: cleanedGsmNumber,
        password: form.password,
        role: form.role,
        birth: birthPayload,
      })
      .then((res) => {
        toast.success("Yetkili başarıyla oluşturuldu.");
        if (!form.image) return;

        const formData = new FormData();
        formData.append("uid", res.data.data.uid);
        formData.append("image", form.image);

        api.post("/admin/upload-user-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Yetkili oluşturulurken bir hata oluştu.";
        toast.error(message);
      });

    handleClose();
  };

  const handleSubmitEdit = () => {
    const cleanedGsmNumber = cleanPhoneNumber(form.gsmNumber);
    const birthDate = form.birth instanceof Date ? form.birth : null;

    api
      .post("/admin/update-admin", {
        uid: form.uid,
        name: form.name,
        surname: form.surname,
        mail: form.mail,
        birth: birthDate
          ? {
              day: birthDate.getDate(),
              month: birthDate.getMonth(),
              year: birthDate.getFullYear(),
            }
          : undefined,
        role: form.role,
        password: form.password,
        gsmNumber: cleanedGsmNumber,
        link: form.link,
        gender: form.gender === "Erkek" ? "male" : "female",
      })
      .then(() => {
        toast.success("Yetkili başarıyla güncellendi.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err: unknown) => {
        toast.error("Yetkili güncellenirken bir hata oluştu.");
        console.log(err);
        handleClose();
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "create") {
      handleSubmitCreate();
    } else {
      handleSubmitEdit();
    }
  };

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
        {/* ── Header ── */}
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

          {/* ─ Section: Kişisel Bilgiler ─ */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Kişisel Bilgiler</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Ad & Soyad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Ad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  autoComplete="off"
                  required
                  placeholder="Ad"
                  className={`${inputBase} px-3 py-2.5`}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Soyad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.surname}
                  onChange={(e) => setForm((prev) => ({ ...prev, surname: e.target.value }))}
                  autoComplete="off"
                  required
                  placeholder="Soyad"
                  className={`${inputBase} px-3 py-2.5`}
                />
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
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={() => setForm((prev) => ({ ...prev, gender: g }))}
                      className="sr-only"
                    />
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setForm((prev) => ({ ...prev, image: file }));
                    }
                  }}
                  className="hidden"
                />
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

          {/* ─ Section: İletişim ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">İletişim</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  E-Posta <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="mail@example.com"
                    value={form.mail}
                    onChange={(e) => setForm((prev) => ({ ...prev, mail: e.target.value }))}
                    autoComplete="off"
                    required
                    className={`${inputBase} pl-9 pr-3 py-2.5`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Telefon <span className="text-red-400">*</span>
                </label>
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

          {/* ─ Section: Güvenlik & Yetki ─ */}
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
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    autoComplete="off"
                    placeholder={config.passwordPlaceholder}
                    required={config.passwordRequired}
                    className={`${inputBase} pl-9 pr-3 py-2.5`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                    autoComplete="off"
                    placeholder="örn: yenigunemlak"
                    className={`${inputBase} pl-9 pr-3 py-2.5`}
                  />
                </div>
              </div>
            </div>

            {/* Yetki */}
            <div>
              <label className={labelClass}>
                Yetki <span className="text-red-400">*</span>
              </label>
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
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => setForm((prev) => ({ ...prev, role: r.value }))}
                      className="sr-only"
                    />
                    <r.icon
                      size={18}
                      className={
                        form.role === r.value ? "text-blue-600" : "text-black/25"
                      }
                    />
                    <div>
                      <p className={`text-sm font-medium ${
                        form.role === r.value ? "text-blue-700" : "text-black/60"
                      }`}>
                        {r.label}
                      </p>
                      <p className={`text-[10px] ${
                        form.role === r.value ? "text-blue-500" : "text-black/30"
                      }`}>
                        {r.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 transition-all"
            >
              {config.submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
