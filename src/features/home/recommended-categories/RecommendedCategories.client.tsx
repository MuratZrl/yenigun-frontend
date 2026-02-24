// src/features/home/recommended-categories/RecommendedCategories.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  LandPlot,
  Briefcase,
  Palmtree,
  Hotel,
} from "lucide-react";

const categoryData = [
  {
    key: "konut",
    label: "Konut",
    icon: Home,
    subcategories: [
      { label: "Satılık Daire", href: "/ilanlar?category=konut&type=Satılık" },
      { label: "Kiralık Daire", href: "/ilanlar?category=konut&type=Kiralık" },
      { label: "Satılık Residence", href: "/ilanlar?category=konut&type=Satılık" },
      { label: "Satılık Villa", href: "/ilanlar?category=konut&type=Satılık" },
      { label: "Kiralık Villa", href: "/ilanlar?category=konut&type=Kiralık" },
      { label: "Müstakil Ev", href: "/ilanlar?category=konut&type=Satılık" },
      { label: "Günlük Kiralık", href: "/ilanlar?category=konut&type=Kiralık" },
      { label: "Yazlık", href: "/ilanlar?category=konut&type=Satılık" },
    ],
  },
  {
    key: "isyeri",
    label: "İş Yeri",
    icon: Briefcase,
    subcategories: [
      { label: "Satılık Dükkan", href: "/ilanlar?category=isyeri&type=Satılık" },
      { label: "Kiralık Dükkan", href: "/ilanlar?category=isyeri&type=Kiralık" },
      { label: "Satılık Ofis", href: "/ilanlar?category=isyeri&type=Satılık" },
      { label: "Kiralık Ofis", href: "/ilanlar?category=isyeri&type=Kiralık" },
      { label: "Depo - Antrepo", href: "/ilanlar?category=isyeri&type=Satılık" },
      { label: "Fabrika", href: "/ilanlar?category=isyeri&type=Satılık" },
      { label: "Devren Satılık", href: "/ilanlar?category=isyeri&type=Devren Satılık" },
      { label: "Devren Kiralık", href: "/ilanlar?category=isyeri&type=Devren Kiralık" },
    ],
  },
  {
    key: "arsa",
    label: "Arsa",
    icon: LandPlot,
    subcategories: [
      { label: "Satılık Arsa", href: "/ilanlar?category=arsa&type=Satılık" },
      { label: "Kiralık Arsa", href: "/ilanlar?category=arsa&type=Kiralık" },
      { label: "İmarlı Arsa", href: "/ilanlar?category=arsa&type=Satılık" },
      { label: "Tarla", href: "/ilanlar?category=arsa&type=Satılık" },
      { label: "Bağ & Bahçe", href: "/ilanlar?category=arsa&type=Satılık" },
      { label: "Çiftlik", href: "/ilanlar?category=arsa&type=Satılık" },
    ],
  },
  {
    key: "bina",
    label: "Bina",
    icon: Building2,
    subcategories: [
      { label: "Satılık Bina", href: "/ilanlar?category=bina&type=Satılık" },
      { label: "Kiralık Bina", href: "/ilanlar?category=bina&type=Kiralık" },
      { label: "Komple Bina", href: "/ilanlar?category=bina&type=Satılık" },
      { label: "Apart", href: "/ilanlar?category=bina&type=Satılık" },
    ],
  },
  {
    key: "devremulk",
    label: "Devremülk",
    icon: Palmtree,
    subcategories: [
      { label: "Satılık Devremülk", href: "/ilanlar?category=devremulk&type=Satılık" },
      { label: "Kiralık Devremülk", href: "/ilanlar?category=devremulk&type=Kiralık" },
      { label: "Marmara Bölgesi", href: "/ilanlar?category=devremulk&type=Satılık" },
      { label: "Ege Bölgesi", href: "/ilanlar?category=devremulk&type=Satılık" },
      { label: "Akdeniz Bölgesi", href: "/ilanlar?category=devremulk&type=Satılık" },
    ],
  },
  {
    key: "turistik-tesis",
    label: "Turistik Tesis",
    icon: Hotel,
    subcategories: [
      { label: "Satılık Otel", href: "/ilanlar?category=turistik-tesis&type=Satılık" },
      { label: "Kiralık Otel", href: "/ilanlar?category=turistik-tesis&type=Kiralık" },
      { label: "Apart Otel", href: "/ilanlar?category=turistik-tesis&type=Satılık" },
      { label: "Pansiyon", href: "/ilanlar?category=turistik-tesis&type=Satılık" },
      { label: "Tatil Köyü", href: "/ilanlar?category=turistik-tesis&type=Satılık" },
    ],
  },
];

export default function RecommendedCategories() {
  return (
    <section
      id="recommended-categories"
      className="py-8 md:py-12 bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">
            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-900 to-blue-500 rounded-full" />
            Kategoriler
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Önerilen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#035DBA] to-[#03409F]">
              Kategoriler
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            Aradığınız emlak türünü kolayca bulun.
          </p>
        </motion.div>

        {/* Category columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categoryData.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                viewport={{ once: true }}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-[#035DBA]/20 hover:bg-blue-50/30 transition-all duration-300"
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-[#035DBA]/10 flex items-center justify-center">
                    <Icon size={16} className="text-[#035DBA]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {category.label}
                  </h3>
                </div>

                {/* Subcategory links */}
                <ul className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.href}
                        className="text-[12px] text-gray-500 hover:text-[#035DBA] hover:translate-x-0.5 transition-all duration-200 block leading-relaxed"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
