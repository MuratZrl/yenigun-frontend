// src/app/(public)/page.tsx
import type { Metadata } from "next";

import { HighlightsSection } from "@/features/home/highlights";
import { QualitySection } from "@/features/home/quality";
import { WhyUsSection } from "@/features/home/why-us";
import { LocationsSection }from "@/features/home/locations";
import { TypesSection } from "@/features/home/types";
import { CommentsSection } from "@/features/home/comments";
import { ImageSliderSection } from "@/features/home/image-slider";
import { RepresentativesSection } from "@/features/home/representatives";
import { FaqSection } from "@/features/home/faq";

export const metadata: Metadata = {
  title: "Anasayfa | Yenigün Emlak",
  description: "Yenigün Emlak ile Sakarya'da Hayalinizdeki Evi Bulun",
  keywords: ["yenigunemlak", "emlak", "sakarya"],
  openGraph: {
    url: "https://www.yenigunemlak.com/",
    title: "Yenigün Emlak",
    description: "Yenigün Emlak ile Sakarya'da Hayalinizdeki Evi Bulun",
    images: [
      {
        url: "https://www.yenigunemlak.com/logo.png?v=2",
        alt: "Yenigün Emlak",
      },
    ],
  },
};

async function getHomeAdverts() {
  const base = process.env.BACKEND_API || "https://api.yenigunemlak.com";
  const url = `${base}/advert/adverts?page=1&limit=12`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const root = json?.data;
    const items = Array.isArray(root) ? root : Array.isArray(root?.data) ? root.data : [];
    return items;
  } catch {
    return [];
  }
}

export default async function Home() {
  const data = await getHomeAdverts();

  return (
    <div>
      <ImageSliderSection />
      <hr className="border-t border-gray-200" />
      <HighlightsSection data={data} />
      <hr className="border-t border-gray-200" />
      <QualitySection />
      <hr className="border-t border-gray-200" />
      <WhyUsSection />
      <hr className="border-t border-gray-200" />
      <LocationsSection data={data} />
      <hr className="border-t border-gray-200" />
      <TypesSection />
      <hr className="border-t border-gray-200" />
      <CommentsSection />
      <hr className="border-t border-gray-200" />
      <FaqSection />
      <hr className="border-t border-gray-200" />
      <RepresentativesSection />
    </div>
  );
}
