// src/features/home/quality/ui/QualityButton.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { isExternalUrl } from "../utils/link";

type Props = {
  href: string;
  title: string;
  gradient: string;
};

export default function QualityButton({ href, title, gradient }: Props) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group w-full max-w-xs"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 backdrop-blur-sm group-hover:border-blue-600 transition-all duration-300">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        <div className="relative px-6 py-4 flex items-center justify-center gap-3">
          <span className="font-semibold text-white">{title}</span>
          <ExternalLink className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="w-full flex justify-center"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="w-full flex justify-center">
      {content}
    </Link>
  );
}
