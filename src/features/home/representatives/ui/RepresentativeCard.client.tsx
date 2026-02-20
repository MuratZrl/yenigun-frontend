// src/features/home/representatives/ui/RepresentativeCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { RepresentativeItem } from "../types";
import { cardVariants } from "../motion/variants";

type Props = {
  rep: RepresentativeItem;
};

export default function RepresentativeCard({ rep }: Props) {
  const initials = rep.title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-white rounded-xl border border-gray-200 shadow-sm
                 hover:shadow-md hover:border-indigo-200
                 transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100
                        group-hover:border-indigo-300 transition-colors duration-300
                        flex items-center justify-center mb-4">
          <span className="text-indigo-600 font-bold text-lg">{initials}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-1">
          {rep.title}
        </h3>

        {/* Role */}
        <p className="text-xs text-gray-400 mb-1">
          {rep.type}
        </p>

        {/* Phone number */}
        <p className="text-xs text-gray-500 font-medium mb-4">
          {rep.phonenum}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <Link
            href={rep.phone}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium
                       hover:bg-indigo-700 transition-colors duration-300"
          >
            <Phone size={13} />
            <span>Ara</span>
          </Link>

          <Link
            href={rep.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 text-white rounded-lg text-xs font-medium
                       hover:bg-green-700 transition-colors duration-300"
          >
            <MessageCircle size={13} />
            <span>Mesaj</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
