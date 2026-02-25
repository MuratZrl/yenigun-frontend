// src/components/modals/CreateAdminModal.tsx

import React, { useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { toast } from "react-toastify";
import {
  X,
  UserPlus,
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

import type { CreateAdminUserPayload } from "@/features/admin/admins/model/types";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Types ── */
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  newUser: CreateAdminUserPayload;
  setNewUser: React.Dispatch<React.SetStateAction<CreateAdminUserPayload>>;
  cookies: string;
};

/* ── Helpers ── */
const EMPTY_FORM: CreateAdminUserPayload = {
  name: "",
  surname: "",
  mail: "",
  gsmNumber: "",
  password: "",
  role: "",
  image: "",
  birthDate: "",
  gender: "",
};

function formatPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "");

  // Strip leading 90 or 0 so we always work with the 10-digit local number
  if (digits.startsWith("90") && digits.length > 10) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Cap at 10 digits
  digits = digits.slice(0, 10);

  // Format: (5XX) XXX XX XX
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
  // Return with leading 0 for API: 05XXXXXXXXX (11 digits)
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

function parseDateToISO(formatted: string): string {
  const parts = formatted.split("/");
  if (parts.length !== 3 || parts[2].length !== 2) return "";
  const day = parts[0];
  const month = parts[1];
  const yearShort = parts[2];
  const yearFull = parseInt(yearShort) > 50 ? `19${yearShort}` : `20${yearShort}`;
  return `${yearFull}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const yy = parts[0].slice(2);
  return `${parts[2]}/${parts[1]}/${yy}`;
}

/* ── Styles ── */
const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

const labelClass = "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

const sectionClass = "space-y-4";

/* ── Component ── */
const CreateAdmin = ({ open, setOpen, newUser, setNewUser }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
    setNewUser(EMPTY_FORM);
    setFileName("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanedGsmNumber = cleanPhoneNumber(newUser.gsmNumber);

    api
      .post("/admin/create-admin", {
        name: newUser.name,
        surname: newUser.surname,
        mail: newUser.mail,
        gender: newUser.gender === "Erkek" ? "male" : "female",
        gsmNumber: cleanedGsmNumber,
        password: newUser.password,
        role: newUser.role,
        birth: newUser.birthDate
          ? {
              day: new Date(newUser.birthDate).getDate(),
              month: new Date(newUser.birthDate).getMonth() + 1,
              year: new Date(newUser.birthDate).getFullYear(),
            }
          : undefined,
      })
      .then((res) => {
        toast.success("Yetkili başarıyla oluşturuldu.");
        if (!newUser.image) return;

        const formData = new FormData();
        formData.append("uid", res.data.data.uid);
        formData.append("image", newUser.image);

        api.post("/admin/upload-user-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Yetkili oluşturulurken bir hata oluştu.";
        toast.error(message);
      });

    handleClose();
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
          {/* Subtle gradient accent line */}
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <UserPlus size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">Yeni Yetkili Oluştur</h2>
                <p className="text-xs text-black/38 mt-0.5">Yetkili bilgilerini doldurun</p>
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
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
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
                  name="surname"
                  value={newUser.surname}
                  onChange={handleChange}
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
                      newUser.gender === g
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                        : "border-black/8 bg-gray-50/50 text-black/40 hover:bg-gray-50 hover:text-black/60 hover:border-black/12"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={newUser.gender === g}
                      onChange={() => {
                        setNewUser((prev) => ({ ...prev, gender: g }));
                      }}
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
                    name="birthDate"
                    placeholder="GG/AA/YY"
                    value={isoToDisplay(newUser.birthDate ?? "")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const display = formatDateInput(e.target.value);
                      const iso = parseDateToISO(display);
                      setNewUser((prev) => ({ ...prev, birthDate: iso || display }));
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
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setNewUser((prev) => ({ ...prev, image: file as unknown as string }));
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
                    name="mail"
                    placeholder="mail@example.com"
                    value={newUser.mail}
                    onChange={handleChange}
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
                    name="gsmNumber"
                    placeholder="(5XX) XXX XX XX"
                    value={newUser.gsmNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      setNewUser((prev) => ({ ...prev, gsmNumber: formattedValue }));
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
                  Şifre <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="Min. 6 karakter"
                    required
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
                    name="link"
                    value={newUser.link ?? ""}
                    onChange={handleChange}
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
                      newUser.role === r.value
                        ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/10"
                        : "border-black/8 bg-gray-50/50 hover:bg-gray-50 hover:border-black/12"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={newUser.role === r.value}
                      onChange={() => {
                        setNewUser((prev) => ({ ...prev, role: r.value }));
                      }}
                      className="sr-only"
                    />
                    <r.icon
                      size={18}
                      className={
                        newUser.role === r.value ? "text-blue-600" : "text-black/25"
                      }
                    />
                    <div>
                      <p className={`text-sm font-medium ${
                        newUser.role === r.value ? "text-blue-700" : "text-black/60"
                      }`}>
                        {r.label}
                      </p>
                      <p className={`text-[10px] ${
                        newUser.role === r.value ? "text-blue-500" : "text-black/30"
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
              Yetkili Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
