// src/features/home/why-us/types.ts
import type { LucideIcon } from "lucide-react";

export type StatItem = {
  title: string;
  count: number;
  suffix?: string;
  duration?: number;
  icon: LucideIcon;
  iconColor: string;
  description: string;
};

export type WhyUsItem = {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  description: string;
};

export type WhyUsBadge = {
  countText: string;
  label: string;
  icon: LucideIcon;
};

export type WhyUsCta = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

export type WhyUsContent = {
  heading: string;
  headingHighlight: string;
  subheading: string;
  image: { src: string; alt: string };
  badge: WhyUsBadge;
  whyUsItems: WhyUsItem[];
  stats: StatItem[];
  cta: WhyUsCta;
};
