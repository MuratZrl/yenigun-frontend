// src/features/home/types/TypesSection.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import api from "@/lib/api";

import { propertyTypeConfig } from "./typesConfig";
import TypeCard from "./ui/TypeCard.client";
import type { PropertyTypeItem } from "./model";

interface SearchResponse {
  pagination?: { totalItems?: number };
}

/** Fetch the total advert count for Konut category filtered by type (Satılık/Kiralık). */
async function fetchTypeCount(typeName: string): Promise<number> {
  try {
    const qs = new URLSearchParams({ category: "Konut", type: typeName }).toString();
    const res = await api.get<SearchResponse>(`/advert/search?${qs}`);
    const data: SearchResponse = res?.data ?? (res as unknown as SearchResponse);
    return data?.pagination?.totalItems ?? 0;
  } catch {
    return 0;
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function TypesSection() {
  const [counts, setCounts] = useState<Map<string, number | null>>(new Map());

  const typeNames = useMemo(() => Object.keys(propertyTypeConfig), []);

  useEffect(() => {
    // Init all as null (loading)
    setCounts(new Map(typeNames.map((name) => [name, null])));

    let cancelled = false;

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        typeNames.map(async (name) => {
          const count = await fetchTypeCount(name);
          return { name, count };
        })
      );

      if (cancelled) return;

      const next = new Map<string, number | null>();
      for (const r of results) {
        if (r.status === "fulfilled") {
          next.set(r.value.name, r.value.count);
        }
      }
      setCounts(next);
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [typeNames]);

  const items: PropertyTypeItem[] = useMemo(() => {
    return typeNames
      .map((name) => ({
        title: name,
        count: counts.get(name) ?? 0,
        icon: propertyTypeConfig[name]?.icon || Home,
        gradient: propertyTypeConfig[name]?.gradient || "from-gray-500 to-blue-500",
        type: name,
      }))
      .sort((a, b) => b.count - a.count);
  }, [typeNames, counts]);

  const totalProperties = useMemo(() => {
    return items.reduce((acc, x) => acc + (x.count || 0), 0);
  }, [items]);

  return (
    <section id="types" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-10 md:mb-14"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Her Türlü{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">Konut</span>{" "}
            Seçeneği
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Yenigün Emlak&apos;ın geniş portföyünde her bütçe ve zevke uygun konutları keşfedin.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {items.map((item) => (
            <TypeCard key={item.title} item={item} />
          ))}
        </motion.div>

        {/* Active listings badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-14"
        >
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-900">{totalProperties}+</span>{" "}
              Aktif konut seçeneği ile hizmetinizdeyiz
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
