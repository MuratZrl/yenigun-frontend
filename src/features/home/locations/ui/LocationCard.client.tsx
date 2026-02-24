// src/features/home/locations/ui/LocationCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { LocationItem } from "../types";

type Props = {
  item: LocationItem;
  index: number;
};

export default function LocationCard({ item }: Props) {
  return (
    <Link href={item.href} className="block">
      <div className="cursor-pointer rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
        {/* Vertical image */}
        <div className="relative overflow-hidden aspect-[2/3]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Center-bottom overlay – city name + count */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[18%]">
            <h3 className="text-white font-bold text-sm">
              {item.title}
            </h3>
            <span className="text-white/70 text-xs mt-1">
              {item.count} İlan
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
