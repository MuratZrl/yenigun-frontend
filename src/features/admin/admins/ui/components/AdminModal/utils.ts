import type { AdminUser } from "@/features/admin/admins/model/types";
import type { FormState } from "./types";

export const EMPTY_FORM: FormState = {
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

export function formatPhoneNumber(value: string): string {
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

export function cleanPhoneNumber(formattedPhone: string): string {
  const digits = formattedPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) return digits.slice(0, 11);
  return "0" + digits.slice(0, 10);
}

export function formatDateInput(value: string): string {
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

export function dateToDisplay(date: string | Date): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

export function displayToDate(formatted: string): Date | string {
  const parts = formatted.split("/");
  if (parts.length !== 3 || parts[2].length !== 2) return formatted;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const yearShort = parseInt(parts[2]);
  const yearFull = yearShort > 50 ? 1900 + yearShort : 2000 + yearShort;
  return new Date(yearFull, month, day);
}

export function parseDateToISO(formatted: string): string {
  const parts = formatted.split("/");
  if (parts.length !== 3 || parts[2].length !== 2) return "";
  const day = parts[0];
  const month = parts[1];
  const yearShort = parts[2];
  const yearFull = parseInt(yearShort) > 50 ? `19${yearShort}` : `20${yearShort}`;
  return `${yearFull}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function buildFormFromUser(user: AdminUser): FormState {
  const formattedGsmNumber = user.gsmNumber ? formatPhoneNumber(user.gsmNumber) : "";

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

export const MODE_CONFIG = {
  create: {
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

export const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

export const labelClass = "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

export const sectionClass = "space-y-4";
