import JSONDATA from "@/app/data.json";
import type { NewUserState, TurkeyCity } from "./types";

export const initialUser: NewUserState = {
  image: "",
  name: "",
  lastname: "",
  gender: {
    selected: "Erkek",
    options: ["Erkek", "Kadın"],
  },
  status: {
    selected: "",
    options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
  },
  phones: [
    {
      phone: "",
      isSmS: true,
    },
  ],
  turkish_id: "",
  mernis_no: "",
  province: "Sakarya",
  district: "Serdivan",
  quarter: "Kazımpaşa Mh.",
  address: "",
  comment: "",
  owner_url: "",
  email: "",
  note: "",
  isSmS: true,
};

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");

  let formatted = numbers;
  if (numbers.length > 0 && !numbers.startsWith("0")) {
    formatted = "0" + numbers;
  }

  if (formatted.length > 1) {
    formatted = formatted.replace(
      /^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
      (_match, p1, p2, p3, p4, p5) => {
        let result = p1;
        if (p2) result += ` (${p2}`;
        if (p3) result += `) ${p3}`;
        if (p4) result += ` ${p4}`;
        if (p5) result += ` ${p5}`;
        return result;
      }
    );
  }

  return formatted;
}

export function cleanPhoneNumber(formattedPhone: string): string {
  return formattedPhone.replace(/\D/g, "");
}

type CityJson = { name: string; towns: Array<{ name: string; districts: Array<{ name: string; quarters?: Array<{ name: string }> }> }> };

export const turkeyCities: TurkeyCity[] = (JSONDATA as CityJson[]).map((city) => ({
  province: city.name,
  districts: city.towns.map((district) => ({
    district: district.name,
    quarters: district.districts.reduce<string[]>((acc, d) => {
      const quarterNames = (d.quarters ?? []).map((quarter) => quarter.name);
      return acc.concat(quarterNames);
    }, []),
  })),
}));
