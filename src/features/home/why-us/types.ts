// src/features/home/why-us/types.ts
export type StatItem = {
  title: string;
  count: number;
  suffix?: string;
  duration?: number;
};

export type WhyUsItem = {
  title: string;
  icon: string;
  description: string;
};

export type WhyUsBadge = {
  countText: string;
  label: string;
  icon: string;
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
