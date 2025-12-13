 
import api from "@/app/lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { uid: string };
}): Promise<Metadata> {
  const { uid } = params;

  try {
    const res = await api.get(`/advert/adverts/${uid}`);
    const data = res.data.data;
 
    const image =
      Array.isArray(data?.photos) && data.photos.length > 0
        ? data.photos[0]
        : "https://yenigunemlak.com/default-og.jpg";

    const location = data.address
      ? `${data.address.province || ""}${
          data.address.district ? " - " + data.address.district : ""
        }`
      : "Lokasyon belirtilmemiş";

    return {
      title: data.title,
      description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
      openGraph: {
        title: data.title,
        description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
        url: `https://yenigunemlak.com/advert/${uid}`,
        images: [
          {
            url: image,  
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: `💰 ${data.fee || "Fiyat yok"} • 📍 ${location}`,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "İlan",
      description: "İlan detaylarını inceleyin",
    };
  }
}
