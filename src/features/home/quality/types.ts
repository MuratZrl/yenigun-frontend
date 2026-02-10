// src/features/home/quality/types.ts
export type QualityItem = {
  title: string;
  description: string;
  image: string;
  gradient: string; // tailwind: "from-... to-..."
  button: { title: string; link: string };
};
