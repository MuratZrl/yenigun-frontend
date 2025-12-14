import type { Metadata } from "next";
import { notFound } from "next/navigation";
import api from "@/app/lib/api";
import AdvertDetailClient from "./AdvertDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getAbsoluteImageUrl = (url: string): string => {
  if (!url || url.trim() === "") {
    return "https://storage.googleapis.com/yenigunemlak/default-og.jpg";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `https://www.yenigunemlak.com${url}`;
  }

  return `https://www.yenigunemlak.com/${url}`;
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
      return {
        title: "İlan Bulunamadı - Yenigün Emlak",
        description: "İlan bulunamadı veya yayından kaldırılmış.",
        openGraph: {
          title: "İlan Bulunamadı - Yenigün Emlak",
          description: "İlan bulunamadı veya yayından kaldırılmış.",
          images: [
            {
              url: "https://storage.googleapis.com/yenigunemlak/default-og.jpg",
              width: 1200,
              height: 630,
              alt: "Yenigün Emlak",
            },
          ],
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

    return {
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
      ],

      openGraph: {
        type: "article",
        title: title,
        description: description,
        url: canonicalUrl,
        siteName: "Yenigün Emlak",
        locale: "tr_TR",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: data.title || "İlan görseli",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImage],
        creator: "@yenigunemlak",
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
    };
  } catch (error) {
    console.error("❌ Metadata generation error:", error);

    return {
      title: "İlan - Yenigün Emlak",
      description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
      openGraph: {
        title: "İlan - Yenigün Emlak",
        description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
        type: "website",
        url: "https://www.yenigunemlak.com",
        siteName: "Yenigün Emlak",
        images: [
          {
            url: "https://storage.googleapis.com/yenigunemlak/default-og.jpg",
            width: 1200,
            height: 630,
            alt: "Yenigün Emlak",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "İlan - Yenigün Emlak",
        description: "Yenigün Emlak - Hayalinizdeki Eve Kavuşun",
        images: ["https://storage.googleapis.com/yenigunemlak/default-og.jpg"],
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
      <AdvertDetailClient
        data={advertData.data}
        similarAds={advertData.similarAds}
      />
    );
  } catch (error) {
    console.error("❌ Page error:", error);
    notFound();
  }
}
