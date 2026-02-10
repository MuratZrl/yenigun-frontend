import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { SimilarAd } from "@/types/advert";

interface SimilarAdsProps {
  similarAds: SimilarAd[];
  currentAdType: string;
}

const SimilarAdCard = ({ ad }: { ad: SimilarAd }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/logo.png");

  useEffect(() => {
    const safePhotos = Array.isArray(ad?.photos)
      ? ad.photos.filter(
          (photo: any) => typeof photo === "string" && photo.trim() !== ""
        )
      : [];

    const mainPhoto = safePhotos[0];

    if (mainPhoto) {
      setImageSrc(mainPhoto);
    } else {
      setImageSrc("/logo.png");
      setImageLoading(false);
    }
  }, [ad.photos]);

  const handleImageError = () => {
    console.log(`Resim yüklenemedi: ${imageSrc}`);
    setImageError(true);
    setImageLoading(false);
    setImageSrc("/logo.png");
  };

  const handleImageLoad = () => {
    console.log(`Resim yüklendi: ${imageSrc}`);
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <Link href={`/ads/${ad.uid}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
          {imageLoading && imageSrc !== "/logo.png" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <img
            src={imageSrc}
            alt={ad.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />

          <div className="absolute top-3 left-3 z-20">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {ad.steps.second}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 z-20">
            <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
              <p className="font-bold text-lg">{ad.fee}</p>
            </div>
          </div>

          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-gray-400 text-sm">Resim Yüklenemedi</div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight text-sm">
            {ad.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="text-blue-600 shrink-0" size={16} />
            <span className="text-xs truncate">
              {ad.address.district}, {ad.address.province}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {ad.details.netArea && <span>{ad.details.netArea} m²</span>}
              {ad.details.roomCount && <span>{ad.details.roomCount} Oda</span>}
            </div>
            <span>
              {new Date(ad.created.createdTimestamp).toLocaleDateString(
                "tr-TR"
              )}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SimilarAds: React.FC<SimilarAdsProps> = ({
  similarAds,
  currentAdType,
}) => {
  if (!similarAds || similarAds.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Benzer İlanlar
              </h2>
              <p className="text-gray-600 mt-1">
                {currentAdType} kategorisindeki diğer ilanlar
              </p>
            </div>
            <Link
              href={`/ads?action=${
                currentAdType.toLowerCase().includes("kiralık") ? "rent" : "buy"
              }`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarAds.slice(0, 4).map((ad) => (
              <SimilarAdCard key={ad.uid} ad={ad} />
            ))}
          </div>

          {similarAds.length > 4 && (
            <div className="text-center mt-6">
              <Link
                href={`/ads?action=${
                  currentAdType.toLowerCase().includes("kiralık")
                    ? "rent"
                    : "buy"
                }`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Daha Fazla Benzer İlan Gör
                <ChevronRight className="text-sm" size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimilarAds;
