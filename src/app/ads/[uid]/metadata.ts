import type { Metadata } from "next";
import api from "@/app/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> { 
  const resolvedParams = await params;
  const { uid } = resolvedParams;

  try {
    const res = await api.get(`/advert/adverts/${uid}`);
    const data = res.data.data;

    const image =
      Array.isArray(data?.photos) && data.photos.length > 0
        ? data.photos[0]
        : "https://storage.googleapis.com/yenigunemlak/default-og.jpg";

    const location = data.address
      ? `${data.address.province || ""}${
          data.address.district ? " - " + data.address.district : ""
        }`
      : "Lokasyon belirtilmemiş";

    return {
      title: data.title || "Yenigün Emlak",
      description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
      openGraph: {
        title: data.title || "Yenigün Emlak",
        description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
        url: `https://yenigunemlak.com/advert/${uid}`,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: data.title || "İlan görseli",
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title || "Yenigün Emlak",
        description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
        images: [
          {
            url: image,
            alt: data.title || "İlan görseli",
          },
        ],
      },
    };
  } catch (error) {
    console.error("Metadata oluşturma hatası:", error);
    return {
      title: "İlan - Yenigün Emlak",
      description: "İlan detaylarını inceleyin",
    };
  }
}
