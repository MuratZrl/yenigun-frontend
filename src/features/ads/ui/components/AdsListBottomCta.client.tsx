// src/features/ads/ui/components/AdsListBottomCta.client.tsx
"use client";

import React from "react";
import Link from "next/link";

const DOPING_HREF = "/doping-tanitim#doping-5"; // ✅ senin sitendeki sayfa + anchor

export default function AdsListBottomCta() {
  return (
    <div className="w-full bg-[#F7D351] border-t border-gray-200">
      <div className="px-4 py-4 text-center text-[13px] font-semibold text-blue-900">
        Siz de ilanınızın yukarıda yer almasını istiyorsanız{" "}
        <Link href={DOPING_HREF} className="text-blue-800 underline hover:no-underline">
          tıklayın
        </Link>
        .
      </div>
    </div>
  );
}
