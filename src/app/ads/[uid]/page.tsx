import type { Metadata } from "next";
import { notFound } from "next/navigation";
import api from "@/app/lib/api";
import AdvertDetailClient from "./AdvertDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getAbsoluteImageUrl = (url: any): string => {
  const urlString = String(url || "");

  if (!urlString || urlString.trim() === "") {
    return "https://storage.googleapis.com/yenigunemlak/default-og.jpg";
  }

  if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
    return urlString;
  }

  if (urlString.startsWith("/")) {
    return `https://www.yenigunemlak.com${urlString}`;
  }

  return `https://www.yenigunemlak.com/${urlString}`;
};

const optimizeImageForWhatsApp = (url: string): string => {
  if (url.includes("storage.googleapis.com")) {
    return `${url}?width=1200&height=630&quality=80&format=jpg`;
  }
  return url;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { uid } = resolvedParams;

    console.log("🔍 Generating metadata for UID:", uid);

    const res = await api.get(`/advert/adverts/${uid}`);
    const data = res.data.data;

    if (!data) {
      const defaultOgImage =
        "https://storage.googleapis.com/yenigunemlak/default-og.jpg";

      return {
        title: "İlan Bulunamadı - Yenigün Emlak",
        description: "İlan bulunamadı veya yayından kaldırılmış.",

        openGraph: {
          type: "website",
          url: `https://www.yenigunemlak.com/ads/${uid}`,
          title: "İlan Bulunamadı - Yenigün Emlak",
          description: "İlan bulunamadı veya yayından kaldırılmış.",
          siteName: "Yenigün Emlak",
          locale: "tr_TR",
          images: [
            {
              url: defaultOgImage,
              width: 1200,
              height: 630,
              alt: "Yenigün Emlak",
              type: "image/jpeg",
            },
          ],
        },

        twitter: {
          card: "summary_large_image",
          title: "İlan Bulunamadı - Yenigün Emlak",
          description: "İlan bulunamadı veya yayından kaldırılmış.",
          images: [defaultOgImage],
        },

        other: {
          "og:image": defaultOgImage,
          "og:image:url": defaultOgImage,
          "og:image:secure_url": defaultOgImage,
          "og:image:type": "image/jpeg",
          "og:image:width": "1200",
          "og:image:height": "630",
          "og:image:alt": "Yenigün Emlak",

          "og:updated_time": new Date().toISOString(),
        },
      };
    }

    let ogImage = "https://storage.googleapis.com/yenigunemlak/default-og.jpg";

    if (
      Array.isArray(data?.photos) &&
      data.photos.length > 0 &&
      data.photos[0]
    ) {
      ogImage = getAbsoluteImageUrl(data.photos[0]);

      ogImage = optimizeImageForWhatsApp(ogImage);

      console.log("📸 WhatsApp için optimize edilmiş OG Image:", ogImage);
    }

    const location = data.address
      ? `${data.address.province || ""}${
          data.address.district ? " - " + data.address.district : ""
        }`
      : "Lokasyon belirtilmemiş";

    const title = data.title
      ? `${data.title} - Yenigün Emlak`
      : "Yenigün Emlak";
    const description = `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`;
    const canonicalUrl = `https://www.yenigunemlak.com/ads/${uid}`;

    console.log("✅ Generated OG Image:", ogImage);
    console.log("✅ Title:", title);
    console.log("✅ Description:", description);

    const metadata: Metadata = {
      metadataBase: new URL("https://www.yenigunemlak.com"),
      title: title,
      description: description,
      keywords: [
        "emlak",
        "konut",
        "ev",
        "ilan",
        data.address?.province || "",
        data.address?.district || "",
        data.title || "",
      ].filter(Boolean),

      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: title,
        description: description,
        siteName: "Yenigün Emlak",
        locale: "tr_TR",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: data.title || "İlan görseli",
            type: "image/jpeg",
          },
        ],
        ...(data.createdAt && {
          publishedTime: new Date(data.createdAt).toISOString(),
        }),
        ...(data.updatedAt && {
          modifiedTime: new Date(data.updatedAt).toISOString(),
        }),
      },

      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
        creator: "@yenigunemlak",
        site: "@yenigunemlak",
      },
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

      alternates: {
        canonical: canonicalUrl,
      },

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
    };

    return metadata;
  } catch (error) {
    console.error("❌ Metadata generation error:", error);

    const defaultOgImage =
      "https://storage.googleapis.com/yenigunemlak/default-og.jpg";

    return {
      title: "İlan - Yenigün Emlak",
      description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",

      openGraph: {
        type: "website",
        url: "https://www.yenigunemlak.com",
        title: "İlan - Yenigün Emlak",
        description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
        siteName: "Yenigün Emlak",
        locale: "tr_TR",
        images: [
          {
            url: defaultOgImage,
            width: 1200,
            height: 630,
            alt: "Yenigün Emlak",
            type: "image/jpeg",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: "İlan - Yenigün Emlak",
        description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
        images: [defaultOgImage],
        creator: "@yenigunemlak",
      },

      other: {
        "og:image": defaultOgImage,
        "og:image:url": defaultOgImage,
        "og:image:secure_url": defaultOgImage,
        "og:image:type": "image/jpeg",
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:image:alt": "Yenigün Emlak",
        "fb:app_id": "YOUR_FACEBOOK_APP_ID",
      },
    };
  }
}

async function getAdvertData(uid: string) {
  try {
    const response = await api.get(`/advert/adverts/${uid}`);
    const data = response.data.data;

    if (!data || data.active === false) {
      throw new Error("İlan bulunamadı");
    }

    let similarAds = [];
    try {
      const similarResponse = await api.get(
        `/advert/adverts/${uid}/similar?page=1&limit=12`
      );
      similarAds = similarResponse.data.data || [];
    } catch (error) {
      similarAds = [];
    }

    const safePhotos = Array.isArray(data.photos)
      ? data.photos.filter(
          (photo: any) => typeof photo === "string" && photo.trim() !== ""
        )
      : [];

    return {
      data: {
        ...data,
        photos: safePhotos,
      },
      similarAds,
    };
  } catch (error) {
    console.error("❌ API Error:", error);
    throw new Error("İlan bulunamadı");
  }
}

export default async function AdvertPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  try {
    const resolvedParams = await params;
    const { uid } = resolvedParams;

    console.log("📱 Loading advert with UID:", uid);

    const advertData = await getAdvertData(uid);

    if (!advertData) {
      notFound();
    }

    return (
      <>
        <AdvertDetailClient
          data={advertData.data}
          similarAds={advertData.similarAds}
        />
      </>
    );
  } catch (error) {
    console.error("❌ Page error:", error);
    notFound();
  }
}
