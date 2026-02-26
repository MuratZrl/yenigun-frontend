// src/app/(public)/page.tsx
import type { Metadata } from "next";

import { LatestAdverts } from "@/features/home/highlights";
import { QualitySection } from "@/features/home/quality";
import { WhyUsSection } from "@/features/home/why-us";
import { LocationsSection }from "@/features/home/locations";
import { TypesSection } from "@/features/home/types";
import { CommentsSection } from "@/features/home/comments";
import { HeroSection } from "@/features/home/hero";
import { TopAdvertsSection } from "@/features/home/top-adverts";
import { RepresentativesSection } from "@/features/home/representatives";
import { RecommendedCategories } from "@/features/home/recommended-categories";
import type { Listing } from "@/features/home/highlights/types";

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

async function getHomeAdverts(): Promise<Listing[]> {
  const base = process.env.BACKEND_API || "https://api.yenigunemlak.com";
  const url = `${base}/advert/adverts?page=1&limit=24`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const root = json?.data;
    const items: Listing[] = Array.isArray(root) ? root : Array.isArray(root?.data) ? root.data : [];
    return items;
  } catch {
    return [];
  }
}

/** Fetch ALL adverts (paginated) so we can count cities properly. */
async function getAllAdvertsForLocations(): Promise<Listing[]> {
  const base = process.env.BACKEND_API || "https://api.yenigunemlak.com";
  const allItems: Listing[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (true) {
      const url = `${base}/advert/adverts?page=${page}&limit=${limit}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) break;

      const json = await res.json();
      const root = json?.data;
      const items: Listing[] = Array.isArray(root) ? root : Array.isArray(root?.data) ? root.data : [];

      if (items.length === 0) break;
      allItems.push(...items);

      // If we got fewer items than limit, we've reached the last page
      if (items.length < limit) break;
      page++;
    }
  } catch {
    // Return whatever we collected so far
  }

  // Filter only active adverts
  return allItems.filter((item) => item.active !== false);
}

function splitAdverts(data: Listing[]) {
  const withPhoto = data.filter((item) => item.photos?.length && item.photos.length > 0);
  const highlighted = withPhoto.filter((item) => item.isHighlight);
  const topAdverts = highlighted.length > 0 ? highlighted : withPhoto.slice(0, 6);
  const topUids = new Set(topAdverts.map((item) => item.uid));
  const latestAdverts = data.filter((item) => !topUids.has(item.uid));
  return { topAdverts, latestAdverts };
}

export default async function Home() {
  const [data, allAdverts] = await Promise.all([
    getHomeAdverts(),
    getAllAdvertsForLocations(),
  ]);
  const { topAdverts, latestAdverts } = splitAdverts(data);

  return (
    <div>
      <HeroSection />
      <TopAdvertsSection data={topAdverts} />
      <hr className="border-t border-gray-200" />
      <LatestAdverts data={latestAdverts} />
      <hr className="border-t border-gray-200" />
      <RecommendedCategories />
      <hr className="border-t border-gray-200" />
      <LocationsSection data={allAdverts} />
      <hr className="border-t border-gray-200" />
      {/* <QualitySection />
      <hr className="border-t border-gray-200" /> */}
      <WhyUsSection />
      <hr className="border-t border-gray-200" />
      {/* <TypesSection />
      <hr className="border-t border-gray-200" /> */}
      <CommentsSection />
      <hr className="border-t border-gray-200" />
      <RepresentativesSection />
    </div>
  );
}
