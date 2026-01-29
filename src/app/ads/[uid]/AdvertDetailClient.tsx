"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SimilarAds from "@/app/components/SimilarAds";
import GoToTop from "@/app/components/GoToTop";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
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
  FileText,
} from "lucide-react";
import PublicGoogleMap from "@/app/components/PublicGoogleMap";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

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
    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
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

export default function AdvertDetailClient({
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
  const [imageLoading, setImageLoading] = useState(false);
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
        (photo: any) => typeof photo === "string" && photo.trim() !== "",
      )
    : [];

  const hasPhotos = safePhotos.length > 0;
  const currentPhoto = hasPhotos ? safePhotos[selectedPhoto] : "/logo.png";
  const shouldShowLoading = hasPhotos && imageLoading;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStartMain = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMoveMain = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEndMain = () => {
    if (!touchStart || !touchEnd || !hasPhotos) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setSelectedPhoto((prev) =>
        prev === safePhotos.length - 1 ? 0 : prev + 1,
      );
    }

    if (isRightSwipe) {
      setSelectedPhoto((prev) =>
        prev === 0 ? safePhotos.length - 1 : prev - 1,
      );
    }
  };

  const handleTouchStartZoom = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMoveZoom = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEndZoom = () => {
    if (!touchStart || !touchEnd || !hasPhotos) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextPhoto();
    }

    if (isRightSwipe) {
      goToPreviousPhoto();
    }
  };

  const handleShare = async () => {
    if (!data) return;

    if (navigator.share) {
      await navigator.share({
        title: data.title,
        text: ` ${data.fee || "Fiyat yok"}\n📍 ${
          data.address?.province || ""
        } ${data.address?.district || ""}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied2(true);
      setTimeout(() => setCopied2(false), 2000);
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
    e: React.SyntheticEvent<HTMLImageElement, Event>,
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
      (part, index, self) => self.indexOf(part) === index,
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        {" "}
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Özellikler
        </h2>{" "}
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Açıklama</h2>

            {data.thoughts ? (
              <div className="prose prose-gray max-w-none">
                <MarkdownRenderer content={data.thoughts} />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Açıklama bulunmuyor</p>
              </div>
            )}
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
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="w-full lg:container lg:mx-auto lg:max-w-7xl lg:px-4 py-0 lg:py-6">
        {/* ÜST BAR: breadcrumb + aksiyonlar */}
        <div className="hidden lg:flex items-center justify-between text-xs text-gray-500 border-b border-gray-200 pb-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-blue-700 hover:underline cursor-pointer">
              Anasayfa
            </span>
            <span>›</span>
            <span className="text-blue-700 hover:underline cursor-pointer">
              Emlak
            </span>
            <span>›</span>
            <span className="text-blue-700 hover:underline cursor-pointer">
              {data.steps.first}
            </span>
            <span>›</span>
            <span className="text-blue-700 hover:underline cursor-pointer">
              {data.steps.second}
            </span>
            <span>›</span>
            <span className="text-blue-700 hover:underline cursor-pointer">
              {data.address.province}
            </span>
            <span>›</span>
            <span className="text-blue-700 hover:underline cursor-pointer">
              {data.address.district}
            </span>
            {data.address.quarter ? (
              <>
                <span>›</span>
                <span className="text-blue-700 hover:underline cursor-pointer">
                  {data.address.quarter}
                </span>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-blue-700"
            >
              Paylaş
            </button>
          </div>
        </div>

        {/* BAŞLIK */}
        <div className="hidden lg:block pt-3">
          <h1 className="text-[22px] font-bold text-gray-900 leading-snug">
            {data.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-blue-700" />
            <span>
              {data.address.province} / {data.address.district}
              {data.address.quarter ? ` / ${data.address.quarter}` : ""}
            </span>

            <span className="text-gray-300">•</span>

            <Calendar size={16} className="text-blue-700" />
            <span>
              {data?.created?.createdTimestamp
                ? new Date(data.created.createdTimestamp).toLocaleDateString(
                    "tr-TR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )
                : "-"}
            </span>

            <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold border border-blue-100">
              İlan No: {data.uid}
            </span>
          </div>
        </div>

        {/* ANA 3 KOLON */}
        <div className="hidden lg:grid grid-cols-12 gap-6 mt-4">
          {/* SOL: Fotoğraf alanı */}
          <div className="col-span-6">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="relative">
                <img
                  src={currentPhoto}
                  onClick={() => hasPhotos && handleClickedPhoto(currentPhoto)}
                  onLoad={() => setImageLoading(false)}
                  onError={handleImageError}
                  className="w-full h-[380px] object-cover select-none"
                  alt={
                    hasPhotos ? `İlan Fotoğrafı ${selectedPhoto + 1}` : "İlan"
                  }
                  loading={hasPhotos ? "lazy" : "eager"}
                  decoding="async"
                />

                {hasPhotos && safePhotos.length > 1 && (
                  <>
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === 0 ? safePhotos.length - 1 : p - 1,
                        )
                      }
                      aria-label="Önceki"
                    >
                      <ChevronLeft size={18} className="text-gray-700" />
                    </button>

                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === safePhotos.length - 1 ? 0 : p + 1,
                        )
                      }
                      aria-label="Sonraki"
                    >
                      <ChevronRight size={18} className="text-gray-700" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs px-3 py-1 rounded-full">
                      {selectedPhoto + 1} / {safePhotos.length}
                    </div>
                  </>
                )}
              </div>

              {/* küçük fotoğraflar */}
              {hasPhotos && safePhotos.length > 1 && (
                <div className="border-t border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => handleClickedPhoto(currentPhoto)}
                      className="text-sm text-blue-700 hover:underline flex items-center gap-2"
                    >
                      <ZoomIn size={16} /> Büyük Fotoğraf
                    </button>

                    {data.video ? (
                      <button
                        onClick={() => setOpenVideo(true)}
                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                      >
                        <Play size={16} /> Video
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Video</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {safePhotos.slice(0, 6).map((p, i) => (
                      <button
                        key={p + i}
                        onClick={() => setSelectedPhoto(i)}
                        className={`w-24 h-16 rounded-md border overflow-hidden transition ${
                          selectedPhoto === i
                            ? "border-blue-600 ring-2 ring-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        title={`${i + 1}. Fotoğraf`}
                      >
                        <img
                          src={p}
                          alt={`thumb-${i}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/logo.png";
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {Math.min(6, safePhotos.length)}/{safePhotos.length}{" "}
                    Fotoğraf
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ORTA: Fiyat + Detay tablosu (GELİŞTİRİLDİ) */}
          <div className="col-span-3">
            <div className="sticky top-6 space-y-4">
              {/* Fiyat kartı */}
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <div className="p-4 bg-linear-to-r from-blue-700 to-blue-600 text-white">
                  <div className="text-xs opacity-90">Fiyat</div>
                  <div className="mt-1 text-2xl font-extrabold tracking-tight">
                    {data.fee || "Fiyat yok"}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-1">
                      {data.steps.second}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin
                      size={16}
                      className="text-blue-700 mt-0.5 shrink-0"
                    />
                    <div className="font-medium">
                      {data.address.province} / {data.address.district}
                      {data.address.quarter ? ` / ${data.address.quarter}` : ""}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Tag size={14} className="text-gray-500" />
                      İlan Bilgileri
                    </div>

                    <div className="space-y-2">
                      {[
                        ["İlan No", String(data.uid)],
                        [
                          "İlan Tarihi",
                          data?.created?.createdTimestamp
                            ? new Date(
                                data.created.createdTimestamp,
                              ).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-",
                        ],
                        [
                          "Emlak Tipi",
                          `${data.steps.second} ${data.steps.first}`,
                        ],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                          <span className="text-xs font-medium text-gray-600">
                            {k}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* üst header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                      <img
                        src="/logo.png"
                        alt="Yenigün Emlak"
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/logo.png";
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {data.advisor?.name} {data.advisor?.surname}
                      </div>
                      <div className="text-xs text-gray-500">
                        Yenigün Emlak • Şubat 2022
                      </div>
                    </div>
                  </div>
                </div>

                {/* telefon kutusu */}
                <div className="p-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs text-gray-500 mb-1">Cep</div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-extrabold text-gray-900 tracking-wide whitespace-nowrap">
                        {formatPhoneNumber(placeholderPhoneNumber)}
                      </div>

                      <button
                        onClick={() => copyNumber(placeholderPhoneNumber)}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700"
                        title="Kopyala"
                      >
                        {copied ? (
                          <>
                            <Check size={14} className="text-green-600" />
                            Kopyalandı
                          </>
                        ) : (
                          <>
                            <Copy size={14} className="text-gray-600" />
                            Kopyala
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <a
                      href={`tel:${placeholderPhoneNumber}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold shadow-sm"
                    >
                      <Phone size={16} /> Telefonla Ara
                    </a>

                    <a
                      href={`https://wa.me/90${placeholderPhoneNumber}?text=Merhaba,%20${data.title}%20ilanınızla%20ilgileniyorum.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-white py-2.5 text-sm font-semibold shadow-sm"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>

                    <button
                      onClick={handleShare}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 py-2.5 text-sm font-semibold text-gray-800"
                    >
                      <Share2 size={16} /> Linki Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ALT: Sekmeler (2 tab) */}
          <div className="col-span-12 mt-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-5 py-3 text-sm font-semibold border-r border-gray-200 ${
                    activeTab === "details"
                      ? "bg-[#f6c343] text-gray-900"
                      : "bg-white text-blue-700 hover:bg-gray-50"
                  }`}
                >
                  İlan Detayları
                </button>

                <button
                  onClick={() => setActiveTab("location")}
                  className={`px-5 py-3 text-sm font-semibold ${
                    activeTab === "location"
                      ? "bg-[#f6c343] text-gray-900"
                      : "bg-white text-blue-700 hover:bg-gray-50"
                  }`}
                >
                  Konumu ve Sokak Görünümü
                </button>
              </div>

              <div className="p-4">
                {activeTab === "location" ? (
                  <div>
                    <div className="text-sm text-gray-700 mb-3">
                      {getAddressText()}
                    </div>
                    <div className="h-[420px] w-full overflow-hidden border border-gray-200 rounded-lg">
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
                ) : (
                  <div className="space-y-4">
                    {data.isFeatures
                      ? renderFeatureValues()
                      : renderTraditionalFeatures()}
                    {!data.isFeatures && renderTraditionalDetails()}

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-2">
                        Açıklama
                      </div>
                      {data.thoughts ? (
                        <div className="prose prose-gray max-w-none">
                          <MarkdownRenderer content={data.thoughts} />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Açıklama bulunmuyor
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Mobil Görünüm */}
            <div className="block lg:hidden">
              {/* Mobil App Bar */}
              <div className="sticky top-0 z-40 bg-[#1f6f93] text-white">
                <div className="flex items-center justify-between h-12 px-3">
                  <button
                    className="p-2 -ml-2 active:opacity-80"
                    onClick={() => history.back()}
                    aria-label="Geri"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <div className="font-semibold text-base">İlan Detayı</div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 active:opacity-80"
                      onClick={handleShare}
                      aria-label="Paylaş"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white px-3 pt-3 pb-2 border-b border-gray-200">
                <div className="text-[13px] font-semibold text-gray-800 leading-snug uppercase">
                  {data.title}
                </div>
                <div className="mt-1 text-xs text-gray-400">#{data.uid}</div>
              </div>

              {/* Fotoğraf Alanı */}
              <div
                className="relative bg-white"
                onTouchStart={handleTouchStartMain}
                onTouchMove={handleTouchMoveMain}
                onTouchEnd={handleTouchEndMain}
              >
                {shouldShowLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1f6f93]"></div>
                  </div>
                )}

                <img
                  src={currentPhoto}
                  onClick={() => hasPhotos && handleClickedPhoto(currentPhoto)}
                  onLoad={() => setImageLoading(false)}
                  onError={handleImageError}
                  className={`w-full h-[260px] object-cover select-none ${
                    shouldShowLoading ? "opacity-0" : "opacity-100"
                  }`}
                  alt={
                    hasPhotos ? `İlan Fotoğrafı ${selectedPhoto + 1}` : "İlan"
                  }
                  loading={hasPhotos ? "lazy" : "eager"}
                  decoding="async"
                />

                {/* Sol / Sağ */}
                {hasPhotos && safePhotos.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex items-center justify-center shadow active:scale-95"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === 0 ? safePhotos.length - 1 : p - 1,
                        )
                      }
                      aria-label="Önceki"
                    >
                      <ChevronLeft className="text-gray-800" size={16} />
                    </button>

                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex items-center justify-center shadow active:scale-95"
                      onClick={() =>
                        setSelectedPhoto((p) =>
                          p === safePhotos.length - 1 ? 0 : p + 1,
                        )
                      }
                      aria-label="Sonraki"
                    >
                      <ChevronRight className="text-gray-800" size={16} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-700/70 text-white text-xs px-3 py-1 rounded-full">
                      {selectedPhoto + 1} / {safePhotos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Emlak adı + breadcrumb */}
              <div className="bg-white px-3 py-3 border-b border-gray-200">
                <div className="text-center text-[#1f6f93] font-semibold tracking-wide">
                  YENİGÜN EMLAK
                </div>

                <div className="mt-1 text-center text-xs text-gray-500">
                  Emlak &rsaquo; Konut &rsaquo; {data.steps.second} &rsaquo;{" "}
                  {data.steps.first}
                </div>

                <div className="mt-1 text-center text-xs text-gray-400">
                  {data.address.province}, {data.address.district}
                  {data.address.quarter ? `, ${data.address.quarter}` : ""}
                </div>
              </div>

              <div className="bg-white px-2 pt-2 border-b border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 h-11 rounded-t-md border border-gray-300 text-sm font-medium ${
                      activeTab === "details"
                        ? "bg-blue-400 text-black border-blue-600"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    İlan Bilgileri
                  </button>

                  <button
                    onClick={() => setActiveTab("description")}
                    className={`flex-1 h-11 rounded-t-md border border-gray-300 text-sm font-medium ${
                      activeTab === "description"
                        ? "bg-blue-400 text-black border-blue-600"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Açıklama
                  </button>

                  <button
                    onClick={() => setActiveTab("location")}
                    className={`flex-1 h-11 rounded-t-md border border-gray-300 text-sm font-medium ${
                      activeTab === "location"
                        ? "bg-blue-400 text-black border-blue-600"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Konumu
                  </button>
                </div>
              </div>

              {/* İçerik: Sahibinden tarzı tablo/alan */}
              <div className="bg-white">
                {activeTab === "details" && (
                  <div className="px-0">
                    {data.isFeatures
                      ? renderFeatureValues()
                      : renderTraditionalFeatures()}
                    {!data.isFeatures && renderTraditionalDetails()}
                  </div>
                )}

                {activeTab === "description" && (
                  <div className="px-3 py-4">
                    {data.thoughts ? (
                      <div className="prose prose-gray max-w-none">
                        <MarkdownRenderer content={data.thoughts} />
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        Açıklama bulunmuyor
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="px-3 py-4">
                    <div className="text-sm text-gray-700 mb-3">
                      {getAddressText()}
                    </div>
                    <div className="h-80 w-full overflow-hidden rounded-md border border-gray-200">
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
                )}
              </div>

              {/* Alt Sabit Aksiyon Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${placeholderPhoneNumber}`}
                    className="h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center active:opacity-90"
                  >
                    Ara
                  </a>

                  <a
                    href={`https://wa.me/90${placeholderPhoneNumber}?text=Merhaba,%20${data.title}%20ilanınızla%20ilgileniyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center active:opacity-90"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Alt bar yer kapladığı için içerik sonuna boşluk */}
              <div className="h-20" />
            </div>

            {/* Mobil İçerik */}
            <div className="hidden lg:hidden">{renderContentByTab()}</div>
          </div>
        </div>

        {/* Sağ Sidebar - Mobil */}
        <div className="block lg:hidden mt-4">
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
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="font-mono text-sm text-gray-900 tracking-wide">
                  {formatPhoneNumber(placeholderPhoneNumber)}
                </span>
                <button
                  onClick={() => copyNumber(placeholderPhoneNumber)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs"
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
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Phone size={16} />
                Telefonla Ara
              </a>

              <a
                href={`https://wa.me/90${placeholderPhoneNumber}?text=Merhaba,%20${data.advisor.name}%20${data.advisor.surname},%20${data.title}%20ilanınızla%20ilgileniyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
          className="pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setZoomPhoto({ show: false, photo: "", level: 1 })}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStartZoom}
            onTouchMove={handleTouchMoveZoom}
            onTouchEnd={handleTouchEndZoom}
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
