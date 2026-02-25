// src/app/(admin)/admin/details/[uid]/page.tsx
import { notFound } from "next/navigation";
import api from "@/lib/api";
import AdvisorDetailPage from "@/features/admin/advisor-detail/ui/AdvisorDetailPage.client";

export const dynamic = "force-dynamic";

type Params = { uid: string };

async function loadAdvisorData(uid: string) {
  try {
    const { data } = await api.get(`/user/advisor/${uid}/stats`);
    if (data.status !== 200) return null;
    return {
      advisor: data.data.advisor,
      adverts: data.data.allAdverts ?? [],
      advertCount: data.data.allAdverts?.length ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const data = await loadAdvisorData(uid);

  if (!data) notFound();

  return (
    <AdvisorDetailPage
      advisor={data.advisor}
      adverts={data.adverts}
      advertCount={data.advertCount}
    />
  );
}