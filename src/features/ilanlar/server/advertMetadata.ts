// src/features/ads/server/advertMetadata.ts
import "server-only";
import type { Metadata } from "next";

const DEFAULT_OG =
  "https://storage.googleapis.com/yenigunemlak/default-og.jpg";

function getAbsoluteImageUrl(url: any): string {
  const urlString = String(url || "");
  if (!urlString || urlString.trim() === "") return DEFAULT_OG;
  if (urlString.startsWith("http://") || urlString.startsWith("https://")) return urlString;
  if (urlString.startsWith("/")) return `https://www.yenigunemlak.com${urlString}`;
  return `https://www.yenigunemlak.com/${urlString}`;
}

function optimizeImageForWhatsApp(url: string): string {
  if (url.includes("storage.googleapis.com")) {
    return `${url}?width=1200&height=630&quality=80&format=jpg`;
  }
  return url;
}

export function buildAdvertMetadata(uid: string, data: any | null): Metadata {
  const canonicalUrl = `https://www.yenigunemlak.com/ilan/${uid}`;

  if (!data) {
    return {
      title: "İlan Bulunamadı - Yenigün Emlak",
      description: "İlan bulunamadı veya yayından kaldırılmış.",
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: "İlan Bulunamadı - Yenigün Emlak",
        description: "İlan bulunamadı veya yayından kaldırılmış.",
        siteName: "Yenigün Emlak",
        locale: "tr_TR",
        images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "Yenigün Emlak", type: "image/jpeg" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "İlan Bulunamadı - Yenigün Emlak",
        description: "İlan bulunamadı veya yayından kaldırılmış.",
        images: [DEFAULT_OG],
      },
      alternates: { canonical: canonicalUrl },
    };
  }

  let ogImage = DEFAULT_OG;
  if (Array.isArray(data?.photos) && data.photos[0]) {
    ogImage = optimizeImageForWhatsApp(getAbsoluteImageUrl(data.photos[0]));
  }

  const location = data.address
    ? `${data.address.province || ""}${data.address.district ? " - " + data.address.district : ""}`
    : "Lokasyon belirtilmemiş";

  const title = data.title ? `${data.title} - Yenigün Emlak` : "Yenigün Emlak";
  const description = `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`;

  return {
    metadataBase: new URL("https://www.yenigunemlak.com"),
    title,
    description,
    keywords: ["emlak", "konut", "ev", "ilan", data.address?.province || "", data.address?.district || "", data.title || ""].filter(Boolean),
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: "Yenigün Emlak",
      locale: "tr_TR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: data.title || "İlan görseli", type: "image/jpeg" }],
      ...(data.createdAt && { publishedTime: new Date(data.createdAt).toISOString() }),
      ...(data.updatedAt && { modifiedTime: new Date(data.updatedAt).toISOString() }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@yenigunemlak",
      site: "@yenigunemlak",
    },
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    other: {
      "og:image": ogImage,
      "og:image:url": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:type": "image/jpeg",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": data.title || "İlan görseli",
      "og:updated_time": new Date().toISOString(),
      "article:section": "Emlak",
      "article:tag": ["emlak", "konut", "ev"],
      "whatsapp:image": ogImage,
      "whatsapp:description": description.substring(0, 100),
    },
  };
}
