// src/app/(public)/ilanlar/page.tsx
import AdsPageClient from "@/features/ads/ui/AdsPage.client";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return <AdsPageClient initialSearchParams={searchParams ?? {}} />;
}
