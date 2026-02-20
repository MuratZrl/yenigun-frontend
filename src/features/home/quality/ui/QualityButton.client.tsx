// src/features/home/quality/ui/QualityButton.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { isExternalUrl } from "../utils/link";

type Props = {
  href: string;
  title: string;
};

export default function QualityButton({ href, title }: Props) {
  const classes =
    "inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200";

  if (isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        <span>{title}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span>{title}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </Link>
  );
}
