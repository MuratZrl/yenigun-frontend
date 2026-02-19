// src/app/(public)/search/page.tsx
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Detaylı Arama | Yenigün Emlak",
  description: "Detaylı filtrelerle ilan arayın.",
};

type SP = Record<string, string | string[] | undefined>;

const asString = (v: SP[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const initial = {
    type: asString(searchParams.type) || "satilik",
    propertyType: asString(searchParams.propertyType),
    city: asString(searchParams.city),
    district: asString(searchParams.district),
    neighborhood: asString(searchParams.neighborhood),
    minPrice: asString(searchParams.minPrice),
    maxPrice: asString(searchParams.maxPrice),
    currency: asString(searchParams.currency) || "tl",
    rooms: asString(searchParams.rooms), // virgüllü "1+1,2+1" gibi
    showMore: asString(searchParams.more) === "1",
  };

  return <SearchClient initial={initial} />;
}
