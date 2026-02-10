// src/app/(public)/haritada-emlak-arama/[category]/[city]/page.tsx
import MapSearchPageClient from "@/features/ads/ui/MapSearchPage.client";

export default function Page({
  params,
  searchParams,
}: {
  params: { category: string; city: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return <MapSearchPageClient params={params} initialSearchParams={searchParams ?? {}} />;
}
