// src/app/(admin)/admin/emlak/archived/[uid]/page.tsx

import { use } from "react";
import ArchivedDetailPage from "@/features/admin/emlak-archived-detail/ui/ArchivedDetailPage.client";

export default function Page({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = use(params);
  return <ArchivedDetailPage uid={uid} />;
}