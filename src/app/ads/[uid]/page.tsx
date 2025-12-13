"use client";
import React, { useEffect, useRef, useState, use } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SimilarAds from "@/app/components/SimilarAds";
import GoToTop from "@/app/components/GoToTop";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import api from "@/app/lib/api";
import { AdvertData, SimilarAd } from "@/app/types/advert";

import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Play,
  ZoomIn,
  X,
  Share2,
  Phone,
  MessageCircle,
  Tag,
} from "lucide-react";
import PublicGoogleMap from "@/app/components/PublicGoogleMap";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined;
}) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "0" ||
    value === 0
  )
    return null;

  const displayValue =
    typeof value === "boolean" ? (value ? "Evet" : "Hayır") : value;

  const isImportant =
    label === "İlan No" || label === "İlan Türü" || label === "Emlak Tipi";

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span
        className={`text-sm font-medium ${
          isImportant ? "text-red-600 font-bold" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${
          isImportant ? "text-red-600 font-bold" : "text-gray-900 font-semibold"
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
};

const FeatureCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  if (!value || value === "0" || value === "0 m²") return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-blue-600 text-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const PhotoThumbnails = ({
  photos,
  selectedPhoto,
  setSelectedPhoto,
  visibleCount = 8,
}: {
  photos: string[];
  selectedPhoto: number;
  setSelectedPhoto: (index: number) => void;
  visibleCount?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(photos.length / visibleCount);
  const startIndex = currentPage * visibleCount;
  const visiblePhotos = photos.slice(startIndex, startIndex + visibleCount);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2">
        {visiblePhotos.map((photo, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPhoto(actualIndex)}
            >
              <img
                src={photo}
                alt={`Thumbnail ${actualIndex + 1}`}
                className="w-full h-full object-cover select-none transition-all duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
                loading="lazy"
                decoding="async"
              />
              <div
                className={`absolute inset-0 border-2 transition-all ${
                  selectedPhoto === actualIndex
                    ? "border-blue-500"
                    : "border-transparent group-hover:border-blue-300"
                }`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="text-gray-700 text-sm" size={16} />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRight className="text-gray-700 text-sm" size={16} />
          </button>

          <div className="flex justify-center mt-3 gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PhotoThumbnailsHorizontal = ({
  photos,
  selectedPhoto,
  setSelectedPhoto,
}: {
  photos: string[];
  selectedPhoto: number;
  setSelectedPhoto: (index: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.children[
        selectedPhoto
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedPhoto]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2 touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="shrink-0 w-16 h-16 relative rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedPhoto(index)}
          >
            <img
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full select-none object-cover transition-all duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
              loading="lazy"
              decoding="async"
            />
            <div
              className={`absolute inset-0 border-2 transition-all ${
                selectedPhoto === index
                  ? "border-blue-500 border-3"
                  : "border-transparent group-hover:border-blue-300"
              }`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            {selectedPhoto === index && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

async function getAdvertData(
  uid: string
): Promise<{ data: AdvertData; similarAds: SimilarAd[] }> {
  try {
    const response = await api.get(`/advert/adverts/${uid}`);
    const data = response.data.data;
    console.log(data);
    if (!data || data.active === false) {
      throw new Error("İlan bulunamadı");
    }

    let similarAds: SimilarAd[] = [];
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
    if (error instanceof Error) {
      console.error("Hata mesajı:", error.message);
    } else if (typeof error === "string") {
      console.error("Hata string:", error);
    } else {
      console.error("Bilinmeyen hata tipi:", error);
    }

    throw new Error("İlan bulunamadı");
  }
}

function AdvertDetail({
  data,
  similarAds,
}: {
  data: AdvertData;
  similarAds: SimilarAd[];
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [openVideo, setOpenVideo] = useState(false);
  const [zoomPhoto, setZoomPhoto] = useState({
    show: false,
    photo: "",
    level: 1,
  });
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [copied2, setCopied2] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    if (data?.title) {
      document.title = `${data.title} - Yenigün Emlak`;
    }
  }, [data]);

  const safePhotos = Array.isArray(data?.photos)
    ? data.photos.filter(
        (photo: any) => typeof photo === "string" && photo.trim() !== ""
      )
    : [];

  const hasPhotos = safePhotos.length > 0;
  const currentPhoto = hasPhotos ? safePhotos[selectedPhoto] : "/logo.png";
  const shouldShowLoading = hasPhotos && imageLoading;

  const handleShare = async () => {
    try {
      if (!data) return;

      const shareData = {
        title: data.title || "İlan",
        text: `Bu ilanı inceleyin: ${data.title}`,
        url: window.location.href,
        price: data.fee || "Fiyat belirtilmemiş",
        image: data.photos?.[0] || null,
        location: data.address
          ? `${data.address.province || ""}${
              data.address.district ? ` - ${data.address.district}` : ""
            }`
          : "Lokasyon belirtilmemiş",
      };

      console.log("📤 PAYLAŞIM VERİLERİ:");
      console.log("─────────────────────");
      console.log("📝 Başlık:", shareData.title);
      console.log("💰 Fiyat:", shareData.price);
      console.log("📍 Lokasyon:", shareData.location);
      console.log(
        "🖼️ Resim URL:",
        shareData.image
          ? shareData.image.substring(0, 100) + "..."
          : "Resim yok"
      );
      console.log("🔗 URL:", shareData.url);
      console.log("─────────────────────");

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareData.title,
            text: `💰 ${shareData.price} - ${shareData.title}\n📍 ${shareData.location}\n${shareData.text}`,
            url: shareData.url,
          });
        } catch (error) {
          console.log("Paylaşım iptal edildi:", error);
        }
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied2(true);
        setTimeout(() => setCopied2(false), 2000);
        console.log("📋 FALLBACK PAYLAŞIM (Kopyalanan URL):", shareData.url);
      }
    } catch (error) {
      console.error("Paylaşım hatası:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow =
      zoomPhoto.show || openVideo ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [zoomPhoto.show, openVideo]);

  const handleClickedPhoto = (photo: string) => {
    if (zoomPhoto.show && zoomPhoto.photo === photo) {
      setZoomPhoto((prev) => ({ ...prev, level: prev.level === 1 ? 2 : 1 }));
    } else {
      setZoomPhoto({ show: true, photo, level: 1 });
    }
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const placeholderPhoneNumber = data.advisor.gsmNumber || "5322328405";
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/logo.png";
  };

  const handleVideoError = () => {
    setVideoLoading(false);
  };

  const featureIcons = {
    area: "📐",
    rooms: "🚪",
    age: "🏢",
    floor: "📊",
    heating: "🔥",
    bathroom: "🚿",
    elevator: "🛗",
    balcony: "🌿",
    furniture: "🛋️",
    site: "🏘️",
  };

  const isLowQualityImage = (url: string | undefined) => {
    if (!url || typeof url !== "string") return false;
    return url.includes("low-quality") || url.includes("thumbnail");
  };

  const goToPreviousPhoto = () => {
    if (!hasPhotos) return;

    const prevIndex =
      selectedPhoto === 0 ? safePhotos.length - 1 : selectedPhoto - 1;
    setSelectedPhoto(prevIndex);
    setZoomPhoto({
      ...zoomPhoto,
      photo: safePhotos[prevIndex],
    });
  };

  const goToNextPhoto = () => {
    if (!hasPhotos) return;

    const nextIndex =
      selectedPhoto === safePhotos.length - 1 ? 0 : selectedPhoto + 1;
    setSelectedPhoto(nextIndex);
    setZoomPhoto({
      ...zoomPhoto,
      photo: safePhotos[nextIndex],
    });
  };

  const getAddressText = () => {
    if (!data.address) return "Adres bilgisi bulunamadı";

    const { province, district, quarter, full_address } = data.address;

    let addressParts = [];

    if (quarter && quarter.trim() !== "") {
      addressParts.push(quarter);
    }

    let effectiveFullAddress = "";
    if (full_address) {
      if (typeof full_address === "string" && full_address.trim() !== "") {
        effectiveFullAddress = full_address;
      }
    }
    if (effectiveFullAddress && effectiveFullAddress !== quarter) {
      addressParts.push(effectiveFullAddress);
    }

    if (district && district.trim() !== "") {
      addressParts.push(district);
    }

    if (province && province.trim() !== "") {
      addressParts.push(province);
    }

    const uniqueParts = addressParts.filter(
      (part, index, self) => self.indexOf(part) === index
    );

    return uniqueParts.join(", ");
  };

  const renderFeatureValues = () => {
    if (!data.featureValues || data.featureValues.length === 0) {
      return null;
    }

    const valueTranslations: { [key: string]: string } = {
      yes: "Evet",
      no: "Hayır",
      Yes: "Evet",
      No: "Hayır",
      true: "Evet",
      false: "Hayır",
      True: "Evet",
      False: "Hayır",
    };

    const translateValue = (value: string | number): string => {
      if (value === undefined || value === null || value === "") {
        return "Bilinmiyor";
      }

      const stringValue = String(value).trim();
      if (stringValue === "" || stringValue === "0") {
        return "Bilinmiyor";
      }

      return valueTranslations[stringValue] || stringValue;
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          İlan Özellikleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.featureValues.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-600">
                {feature.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {translateValue(feature.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTraditionalFeatures = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={featureIcons.area}
            label="Net m²"
            value={data.details.netArea}
          />
          <FeatureCard
            icon={featureIcons.rooms}
            label="Oda Sayısı"
            value={data.details.roomCount}
          />
          <FeatureCard
            icon={featureIcons.age}
            label="Bina Yaşı"
            value={data.details.buildingAge}
          />
          <FeatureCard
            icon={featureIcons.floor}
            label="Bulunduğu Kat"
            value={data.details.floor}
          />
          <FeatureCard
            icon={featureIcons.heating}
            label="Isıtma"
            value={data.details.heating}
          />
          <FeatureCard
            icon={featureIcons.bathroom}
            label="Banyo Sayısı"
            value={data.details.bathCount || "1"}
          />
          <FeatureCard
            icon={featureIcons.elevator}
            label="Asansör"
            value={data.details.elevator ? "Var" : "Yok"}
          />
          <FeatureCard
            icon={featureIcons.balcony}
            label="Balkon"
            value={data.details.balcony ? "Var" : "Yok"}
          />
          <FeatureCard
            icon={featureIcons.furniture}
            label="Eşyalı"
            value={data.details.furniture ? "Evet" : "Hayır"}
          />
          <FeatureCard
            icon={featureIcons.site}
            label="Site İçinde"
            value={data.details.inSite ? "Evet" : "Hayır"}
          />
        </div>
      </div>
    );
  };

  const renderTraditionalDetails = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Detaylı Bilgiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <DetailRow label="İlan No" value={data.uid} />
          <DetailRow label="Emlak Tipi" value={data.steps.first} />
          <DetailRow label="İlan Türü" value={data.steps.second} />
          <DetailRow
            label="Kontrat Süresi"
            value={data.contract.time || "1 Yıl"}
          />
          <DetailRow label="EIDS No" value={data.eidsNo} />
          <DetailRow
            label="EIDS Tarihi"
            value={
              data.eidsDate
                ? new Date(data.eidsDate).toLocaleDateString("tr-TR")
                : undefined
            }
          />
          <DetailRow label="Net m²" value={data.details.netArea} />
          <DetailRow label="Brüt m²" value={data.details.grossArea} />
          <DetailRow label="Oda Sayısı" value={data.details.roomCount} />
          <DetailRow label="Bina Yaşı" value={data.details.buildingAge} />
          <DetailRow label="Bulunduğu Kat" value={data.details.floor} />
          <DetailRow label="Kat Sayısı" value={data.details.totalFloor} />
          <DetailRow label="Isıtma" value={data.details.heating} />
          <DetailRow label="Banyo Sayısı" value={data.details.bathCount} />
          <DetailRow label="Balkon" value={data.details.balcony} />
          <DetailRow label="Eşyalı" value={data.details.furniture} />
          <DetailRow label="Asansör" value={data.details.elevator} />
          <DetailRow label="Site İçinde" value={data.details.inSite} />
          <DetailRow label="Balkon Sayısı" value={data.details.balconyCount} />
          <DetailRow label="Cephe" value={data.details.whichSide} />
          {data.steps.second?.includes("Satılık") && (
            <DetailRow label="Tapu Durumu" value={data.details.deed} />
          )}
        </div>
      </div>
    );
  };

  const renderContentByTab = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
            <div
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.thoughts }}
            />
          </div>
        );
      case "location":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Konum</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Tam Adres
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getAddressText()}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-96 w-full rounded-xl overflow-hidden mt-4">
              <PublicGoogleMap
                lat={
                  typeof data.address.mapCoordinates?.lat === "string"
                    ? parseFloat(data.address.mapCoordinates.lat)
                    : data.address.mapCoordinates?.lat || 0
                }
                lng={
                  typeof data.address.mapCoordinates?.lng === "string"
                    ? parseFloat(data.address.mapCoordinates.lng)
                    : data.address.mapCoordinates?.lng || 0
                }
                province={data.address.province}
                district={data.address.district}
              />
            </div>
          </div>
        );
      case "details":
      default:
        return (
          <>
            {data.isFeatures
              ? renderFeatureValues()
              : renderTraditionalFeatures()}
            {!data.isFeatures && renderTraditionalDetails()}
          </>
        );
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="hidden lg:block mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
            <span>Emlak</span>
            <span>›</span>
            <span>{data.steps.first}</span>
            <span>›</span>
            <span>{data.steps.second}</span>
            <span>›</span>
            <span>{data.address.province}</span>
            <span>›</span>
            <span className="text-gray-700">{data.address.district}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={16} />
              <span>
                {data.address.province}, {data.address.district}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-600" size={16} />
              <span>
                {new Date(data.created.createdTimestamp).toLocaleDateString(
                  "tr-TR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              İlan No: {data.uid}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Mobil Görünüm */}
            <div className="block lg:hidden">
              {/* Fotoğraf Galerisi */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="relative">
                  {shouldShowLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <img
                    src={currentPhoto}
                    onClick={() =>
                      hasPhotos && handleClickedPhoto(currentPhoto)
                    }
                    onLoad={() => setImageLoading(false)}
                    onError={handleImageError}
                    className={`w-full h-64 select-none transition-all duration-300 ${
                      shouldShowLoading ? "opacity-0" : "opacity-100"
                    } ${
                      hasPhotos
                        ? "cursor-zoom-in hover:scale-105"
                        : "cursor-default"
                    } ${
                      isLowQualityImage(currentPhoto) || !hasPhotos
                        ? "object-contain"
                        : "object-contain"
                    }`}
                    alt={
                      hasPhotos
                        ? `İlan Fotoğrafı ${selectedPhoto + 1}`
                        : "Yenigün Emlak"
                    }
                    loading={hasPhotos ? "lazy" : "eager"}
                    decoding="async"
                  />

                  {hasPhotos && safePhotos.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                        onClick={() =>
                          setSelectedPhoto((p) =>
                            p === 0 ? safePhotos.length - 1 : p - 1
                          )
                        }
                      >
                        <ChevronLeft className="text-gray-700" size={12} />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                        onClick={() =>
                          setSelectedPhoto((p) =>
                            p === safePhotos.length - 1 ? 0 : p + 1
                          )
                        }
                      >
                        <ChevronRight className="text-gray-700" size={12} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                        {selectedPhoto + 1} / {safePhotos.length}
                      </div>
                    </>
                  )}
                </div>

                {hasPhotos && safePhotos.length > 1 && (
                  <div className="p-3 border-t border-gray-100">
                    <PhotoThumbnailsHorizontal
                      photos={safePhotos}
                      selectedPhoto={selectedPhoto}
                      setSelectedPhoto={setSelectedPhoto}
                    />
                  </div>
                )}
              </div>

              {/* İlan Başlığı ve Bilgiler */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  {data.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-blue-600" size={14} />
                    <span>
                      {data.address.province}, {data.address.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600" size={14} />
                    <span>
                      {new Date(
                        data.created.createdTimestamp
                      ).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    İlan No: {data.uid}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative rounded-2xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] ring-1 ring-gray-100">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Tag className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-500">
                            Fiyat
                          </p>
                          <p className="text-xs text-gray-400">
                            {data.steps.second}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {data.fee}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "details"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("details")}
                    >
                      İlan Detayı
                    </button>
                    <button
                      className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "description"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      Açıklama
                    </button>
                    <button
                      className={`flex-1 py-3 text-center font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "location"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("location")}
                    >
                      Konum
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Fotoğraf Galerisi */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                {shouldShowLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                )}
                <img
                  src={currentPhoto}
                  onClick={() => hasPhotos && handleClickedPhoto(currentPhoto)}
                  onLoad={() => setImageLoading(false)}
                  onError={handleImageError}
                  className={`w-full h-96 select-none transition-all duration-300 ${
                    shouldShowLoading ? "opacity-0" : "opacity-100"
                  } ${
                    hasPhotos
                      ? "cursor-zoom-in hover:scale-105"
                      : "cursor-default"
                  } ${
                    isLowQualityImage(currentPhoto) || !hasPhotos
                      ? "object-contain"
                      : "object-contain"
                  }`}
                  alt={
                    hasPhotos
                      ? `İlan Fotoğrafı ${selectedPhoto + 1}`
                      : "Yenigün Emlak"
                  }
                  loading={hasPhotos ? "lazy" : "eager"}
                  decoding="async"
                />

                {hasPhotos && safePhotos.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === 0 ? safePhotos.length - 1 : p - 1
                        )
                      }
                    >
                      <ChevronLeft className="text-gray-700" size={16} />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === safePhotos.length - 1 ? 0 : p + 1
                        )
                      }
                    >
                      <ChevronRight className="text-gray-700" size={16} />
                    </button>
                  </>
                )}

                {hasPhotos && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {selectedPhoto + 1} / {safePhotos.length}
                  </div>
                )}

                {isLowQualityImage(currentPhoto) && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                    ⚠️ Düşük Çözünürlük
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {hasPhotos && (
                      <button
                        onClick={() => handleClickedPhoto(currentPhoto)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                      >
                        <ZoomIn size={16} />
                        Fotoğrafı Büyüt
                      </button>
                    )}
                    {data.video && (
                      <button
                        onClick={() => setOpenVideo(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <Play size={16} />
                        Videoyu İzle
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-gray-100 text-gray-600 flex flex-row items-center gap-2 hover:bg-gray-200 rounded-lg transition-colors"
                      onClick={handleShare}
                    >
                      <Share2 size={16} /> Paylaş
                    </button>
                  </div>
                </div>
              </div>

              {hasPhotos && safePhotos.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <PhotoThumbnails
                    photos={safePhotos}
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={setSelectedPhoto}
                    visibleCount={8}
                  />
                </div>
              )}
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-4 text-center font-medium text-base border-b-2 transition-colors ${
                    activeTab === "details"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  İlan Detayı
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium text-base border-b-2 transition-colors ${
                    activeTab === "description"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Açıklama
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium text-base border-b-2 transition-colors ${
                    activeTab === "location"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("location")}
                >
                  Konum
                </button>
              </div>
              <div className="p-6">{renderContentByTab()}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Konum</h2>
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-0.5 shrink-0" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Tam Adres
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getAddressText()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-96 w-full rounded-xl overflow-hidden mt-4">
                <PublicGoogleMap
                  lat={
                    typeof data.address.mapCoordinates?.lat === "string"
                      ? parseFloat(data.address.mapCoordinates.lat)
                      : data.address.mapCoordinates?.lat || 0
                  }
                  lng={
                    typeof data.address.mapCoordinates?.lng === "string"
                      ? parseFloat(data.address.mapCoordinates.lng)
                      : data.address.mapCoordinates?.lng || 0
                  }
                  province={data.address.province}
                  district={data.address.district}
                />
              </div>
            </div>
          </div>

          {/* Sağ Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 flex flex-col gap-6">
              <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90">Fiyat</p>
                <p className="text-3xl font-bold mt-1">{data.fee}</p>
                <p className="text-sm opacity-90 mt-2">{data.steps.second}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-16 bg-white flex items-center justify-center rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Yenigün Emlak"
                      className="w-full h-full select-none object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-logo.png";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Yenigün Emlak
                    </h3>
                    <p className="text-sm text-gray-500">
                      {data.advisor.name + " " + data.advisor.surname}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <span className="font-mono text-lg text-gray-900 tracking-wide">
                      {formatPhoneNumber(placeholderPhoneNumber)}
                    </span>
                    <button
                      onClick={() => copyNumber(placeholderPhoneNumber)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      {copied ? (
                        <Check className="text-green-500" size={16} />
                      ) : (
                        <Copy className="text-gray-600" size={16} />
                      )}
                      {copied ? "Kopyalandı" : "Kopyala"}
                    </button>
                  </div>

                  <a
                    href={`tel:${placeholderPhoneNumber}`}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Phone size={16} />
                    Telefonla Ara
                  </a>

                  <a
                    href={`https://wa.me/90${placeholderPhoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle size={16} />
                    WhatsApp&apos;tan Yaz
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Bizi tercih ettiğiniz için teşekkürler!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="block lg:hidden mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-14 bg-white flex items-center justify-center rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Yenigün Emlak"
                  className="w-full h-full select-none object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-logo.png";
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Yenigün Emlak
                </h3>
                <p className="text-sm text-gray-500">
                  {data.advisor.name + " " + data.advisor.surname}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="font-mono text-lg text-gray-900 tracking-wide">
                  {formatPhoneNumber(placeholderPhoneNumber)}
                </span>
                <button
                  onClick={() => copyNumber(placeholderPhoneNumber)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {copied ? (
                    <Check className="text-green-500" size={16} />
                  ) : (
                    <Copy className="text-gray-600" size={16} />
                  )}
                  {copied ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>

              <a
                href={`tel:${placeholderPhoneNumber}`}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Phone size={16} />
                Telefonla Ara
              </a>

              <a
                href={`https://wa.me/90${placeholderPhoneNumber}?text=Merhaba,%20${data.advisor.name}%20${data.advisor.surname},%20${data.title}%20ilanınızla%20ilgileniyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={16} />
                WhatsApp&apos;tan Yaz
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Bizi tercih ettiğiniz için teşekkürler!
              </p>
            </div>
          </div>
        </div>
      </div>

      <SimilarAds similarAds={similarAds} currentAdType={data.steps.second} />

      <Footer />
      <GoToTop />

      {openVideo && data.video && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setOpenVideo(false)}
        >
          <div
            className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] mx-2 sm:mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setOpenVideo(false)}
            >
              <X size={32} />
            </button>

            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-none sm:rounded-2xl">
                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white"></div>
              </div>
            )}

            <div className="relative grow sm:grow-0 sm:aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden">
              <iframe
                src={data.video}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
                onError={handleVideoError}
              />
            </div>
          </div>
        </div>
      )}

      {zoomPhoto.show && (
        <div
          className=" pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setZoomPhoto({ show: false, photo: "", level: 1 })}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setZoomPhoto({ show: false, photo: "", level: 1 });
              }}
            >
              <X size={24} />
            </button>

            {hasPhotos && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousPhoto();
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextPhoto();
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="relative max-w-7xl max-h-[80vh] flex items-center justify-center mb-4">
              <img
                src={zoomPhoto.photo}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickedPhoto(zoomPhoto.photo);
                }}
                className={`max-h-[70vh] max-w-full select-none object-contain transition-transform duration-300 cursor-zoom-out ${
                  zoomPhoto.level === 2 ? "scale-150" : "scale-100"
                }`}
                onError={handleImageError}
              />
            </div>

            {hasPhotos && safePhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                  <PhotoThumbnailsHorizontal
                    photos={safePhotos}
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={(index) => {
                      setSelectedPhoto(index);
                      setZoomPhoto({ ...zoomPhoto, photo: safePhotos[index] });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdvertPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const resolvedParams = use(params);
  const uid = resolvedParams.uid;

  const [advertData, setAdvertData] = useState<{
    data: AdvertData;
    similarAds: SimilarAd[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertData = async () => {
      try {
        setLoading(true);
        const data = await getAdvertData(uid);
        setAdvertData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
        console.error("❌ API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchAdvertData();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !advertData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            İlan Bulunamadı
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "İlan mevcut değil veya yayından kaldırılmış."}
          </p>
          <a
            href="/ads"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Tüm İlanlara Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdvertDetail data={advertData.data} similarAds={advertData.similarAds} />
  );
}
