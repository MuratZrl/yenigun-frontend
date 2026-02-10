// src/features/home/quality/utils/link.ts
export const isExternalUrl = (href: string) => /^https?:\/\//i.test(href);