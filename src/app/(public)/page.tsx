// src/app/page.tsx
import type { Metadata } from "next";

import { HighlightsSection } from "@/features/home/highlights";
import { QualitySection } from "@/features/home/quality";
import { WhyUsSection } from "@/features/home/why-us";
import { LocationsSection }from "@/features/home/locations";
import { TypesSection } from "@/features/home/types";
import { CommentsSection } from "@/features/home/comments";
import { ImageSliderSection } from "@/features/home/image-slider";
import { RepresentativesSection } from "@/features/home/representatives";

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
  const base = process.env.NEXT_PUBLIC_BACKEND_API;
  if (!base) return [];

  const url = `${base}/advert/adverts?page=1&limit=6`;

  try {
    const res = await fetch(url, {
      // içerik sık değişiyorsa: revalidate düşür, hiç değişmiyorsa yükselt
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return json?.data ?? json?.data?.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const data = await getHomeAdverts();

  return (
    <div>
      <HighlightsSection data={data} />
      <QualitySection />
      <WhyUsSection />
      <LocationsSection data={data} />
      <TypesSection data={data} />
      <CommentsSection />

      <ImageSliderSection />
      <RepresentativesSection />
    </div>
  );
}
