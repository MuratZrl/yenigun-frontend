// src/app/(public)/ilan/[uid]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdvertDetailClient from "@/features/ads/ui/detail/AdvertDetailClient";
import { loadAdvertPageData, buildAdvertMetadata, getAdvert } from "@/features/ads/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { uid: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  try {
    const advert = await getAdvert(uid);
    if (!advert || advert.active === false) return buildAdvertMetadata(uid, null);
    return buildAdvertMetadata(uid, advert);
  } catch {
    return buildAdvertMetadata(uid, null);
  }
}

export default async function AdvertPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  try {
    const { advert, similarAds, breadcrumbs, featureNameMap, facilitiesSchema } = await loadAdvertPageData(uid);
    return (
      <AdvertDetailClient
        data={advert}
        similarAds={similarAds}
        breadcrumbs={breadcrumbs}
        featureNameMap={featureNameMap}
        facilitiesSchema={facilitiesSchema}
      />
    );
  } catch {
    notFound();
  }
}