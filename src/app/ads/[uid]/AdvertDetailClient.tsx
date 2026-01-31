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
  FileText,
} from "lucide-react";
import PublicGoogleMap from "@/app/components/PublicGoogleMap";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

const DesktopSpecRow = ({
  label,
  value,
  important,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  important?: boolean;
  valueClassName?: string;
}) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "0" ||
    value === 0
  )
    return null;

  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-[12px] leading-5 border-b border-dotted border-gray-300">
      <div className="text-gray-900 font-semibold whitespace-nowrap">
        {label}
      </div>
      <div
        className={`text-right font-semibold ${
          important ? "text-red-600" : "text-gray-900"
        } ${valueClassName || ""}`}
      >
        {value}
      </div>
    </div>
  );
};

const DesktopTabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-2 text-[12px] font-semibold border border-gray-300",
        "border-b-0 rounded-t-sm",
        active
          ? "bg-blue-400 text-gray-900"
          : "bg-[#f3f3f3] text-blue-700 hover:bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
};

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
  const [desktopTab, setDesktopTab] = useState<
    "details" | "location" | "index"
  >("details");

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

  const valueTranslations: Record<string, string> = {
    yes: "Evet",
    no: "Hayır",
    true: "Evet",
    false: "Hayır",
    Yes: "Evet",
    No: "Hayır",
    True: "Evet",
    False: "Hayır",
  };

  const isEmptyValue = (v: any) => {
    if (v === null || v === undefined) return true;
    if (typeof v === "string" && v.trim() === "") return true;
    if (typeof v === "number" && v === 0) return true;
    if (v === "0") return true;
    if (Array.isArray(v) && v.length === 0) return true;
    return false;
  };

  const formatAnyValue = (v: any) => {
    if (isEmptyValue(v)) return "";
    if (Array.isArray(v)) {
      const joined = v.filter(Boolean).join(", ");
      return valueTranslations[joined] || joined;
    }
    if (typeof v === "boolean") return v ? "Evet" : "Hayır";

    const s = String(v).trim();
    return valueTranslations[s] || s;
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

  const renderDesktopFeaturesLike = () => {
    if (data?.isFeatures) {
      const features = Array.isArray(data?.featureValues)
        ? data.featureValues
        : [];

      const rows = features
        .filter((f: any) => f?.name && !isEmptyValue(f?.value))
        .map((f: any) => ({
          name: String(f.name),
          value: formatAnyValue(f.value),
        }));

      return (
        <div className="border border-gray-300 bg-white">
          <div className="px-3 py-2 border-b border-gray-300 bg-white">
            <div className="font-semibold text-[12px] text-gray-900">
              Özellikler
            </div>
          </div>

          <div className="p-3">
            {rows.length === 0 ? (
              <div className="text-[12px] text-gray-600">
                Özellik bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6">
                {rows.map((r, idx) => (
                  <div
                    key={`${r.name}-${idx}`}
                    className="flex items-start justify-between gap-4 py-1.5 text-[12px] leading-5 border-b border-dotted border-gray-300"
                  >
                    <div className="text-gray-900 font-semibold">{r.name}</div>
                    <div className="text-right font-semibold text-gray-900">
                      {r.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    const d: any = data?.details || {};
    const rows: Array<[string, any]> = [
      ["m² (Brüt)", d.grossArea],
      ["m² (Net)", d.netArea],
      ["Oda Sayısı", d.roomCount],
      ["Bina Yaşı", d.buildingAge],
      ["Bulunduğu Kat", d.floor],
      ["Kat Sayısı", d.totalFloor],
      ["Isıtma", d.heating],
      ["Banyo Sayısı", d.bathCount],
      ["Mutfak", d.kitchen],
      ["Balkon", d.balcony],
      ["Asansör", d.elevator],
      ["Otopark", d.parking || d.park],
      ["Eşyalı", d.furniture],
      ["Site İçinde", d.inSite],
      ["Cephe", d.whichSide],
      ["Aidat", d.dues],
      ["Depozito", d.deposit],
    ];

    const filtered = rows
      .filter(([, v]) => !isEmptyValue(v))
      .map(([k, v]) => [k, formatAnyValue(v)] as const);

    return (
      <div className="border border-gray-300 bg-white">
        <div className="px-3 py-2 border-b border-gray-300 bg-white">
          <div className="font-semibold text-[12px] text-gray-900">
            Özellikler
          </div>
        </div>

        <div className="p-3">
          {filtered.length === 0 ? (
            <div className="text-[12px] text-gray-600">Özellik bulunamadı.</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6">
              {filtered.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-start justify-between gap-4 py-1.5 text-[12px] leading-5 border-b border-dotted border-gray-300"
                >
                  <div className="text-gray-900 font-semibold">{k}</div>
                  <div className="text-right font-semibold text-gray-900">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDesktopDescriptionBox = () => {
    return (
      <div className="border border-gray-300 bg-white">
        <div className="px-3 py-2 border-b border-gray-300 bg-white">
          <div className="font-semibold text-[12px] text-gray-900">
            Açıklama
          </div>
        </div>

        <div className="p-3 text-[12px] leading-5 text-gray-800">
          {data.thoughts ? (
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer content={data.thoughts} />
            </div>
          ) : (
            <div className="text-gray-600">Açıklama bulunmuyor.</div>
          )}
        </div>
      </div>
    );
  };

  const renderDesktopDetailsContent = () => {
    return (
      <div className="space-y-3">
        {renderDesktopDescriptionBox()}
        {renderDesktopFeaturesLike()}
      </div>
    );
  };

  const renderDesktopLocationContent = () => {
    return (
      <div className="border border-gray-300 bg-white">
        <div className="px-3 py-2 border-b border-gray-300 bg-white">
          <div className="font-semibold text-[12px] text-gray-900">
            Konumu ve Sokak Görünümü
          </div>
        </div>

        <div className="p-3">
          <div className="text-[12px] text-gray-700 mb-2">
            {getAddressText()}
          </div>
          <div className="h-[420px] w-full overflow-hidden border border-gray-200">
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
    );
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="w-full lg:mx-auto lg:max-w-[1200px] lg:px-4 py-0 lg:py-4">
        <div className="hidden lg:block">
          <div className=" pt-4 flex items-center justify-between mb-2">
            <h1 className="text-[14px] font-bold text-gray-900">
              {data.title}
            </h1>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* SOL: Foto alanı */}
            <div className="col-span-6">
              <div className="border border-gray-300 bg-white">
                <div className="relative">
                  <img
                    src={currentPhoto}
                    onClick={() =>
                      hasPhotos && handleClickedPhoto(currentPhoto)
                    }
                    onLoad={() => setImageLoading(false)}
                    onError={handleImageError}
                    className="w-full h-[360px] object-cover select-none"
                    alt={
                      hasPhotos ? `İlan Fotoğrafı ${selectedPhoto + 1}` : "İlan"
                    }
                    loading={hasPhotos ? "lazy" : "eager"}
                    decoding="async"
                  />

                  {hasPhotos && safePhotos.length > 1 && (
                    <>
                      <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white"
                        onClick={() =>
                          setSelectedPhoto((p) =>
                            p === safePhotos.length - 1 ? 0 : p + 1,
                          )
                        }
                        aria-label="Sonraki"
                      >
                        <ChevronRight size={18} className="text-gray-700" />
                      </button>
                    </>
                  )}
                </div>

                <div className="px-3 py-2 border-t border-gray-300 bg-white flex items-center justify-between text-[12px]">
                  <button
                    onClick={() => handleClickedPhoto(currentPhoto)}
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                  >
                    <ZoomIn size={14} /> Büyük Fotoğraf
                  </button>

                  {data.video ? (
                    <button
                      onClick={() => setOpenVideo(true)}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <Play size={14} /> Video
                    </button>
                  ) : (
                    <span className="text-gray-400">Video</span>
                  )}
                </div>

                {hasPhotos && safePhotos.length > 1 && (
                  <div className="px-3 py-3 border-t border-gray-300 bg-white">
                    <div className="grid grid-cols-6 gap-2">
                      {safePhotos.slice(0, 12).map((p, i) => (
                        <button
                          key={p + i}
                          onClick={() => setSelectedPhoto(i)}
                          className={[
                            "h-[52px] border overflow-hidden",
                            selectedPhoto === i
                              ? "border-blue-600"
                              : "border-gray-300 hover:border-gray-400",
                          ].join(" ")}
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

                    <div className="mt-2 text-[12px] text-gray-600">
                      1/{safePhotos.length} Fotoğraf
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ORTA: Fiyat + detay tablo */}
            <div className="col-span-3">
              <div className="border border-gray-300 bg-white p-3">
                {/* Fiyat (mavi) */}
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-bold text-blue-700">
                    {data.fee || "Fiyat yok"}
                  </div>
                  <Calendar size={14} className="text-gray-400" />
                </div>

                {/* Konum (mavi link gibi) */}
                <div className="mt-1 text-[12px] text-blue-700 font-semibold">
                  {data.address.province} / {data.address.district}
                  {data.address.quarter ? ` / ${data.address.quarter}` : ""}
                </div>

                <div className="mt-2">
                  <DesktopSpecRow
                    label="İlan No"
                    value={String(data.uid)}
                    important
                  />
                  <DesktopSpecRow
                    label="İlan Tarihi"
                    value={
                      data?.created?.createdTimestamp
                        ? new Date(
                            data.created.createdTimestamp,
                          ).toLocaleDateString("tr-TR")
                        : "-"
                    }
                  />
                  <DesktopSpecRow
                    label="Emlak Tipi"
                    value={`${data.steps.second} ${data.steps.first}`}
                  />
                  <DesktopSpecRow
                    label="m² (Brüt)"
                    value={data.details?.grossArea || ""}
                  />
                  <DesktopSpecRow
                    label="m² (Net)"
                    value={data.details?.netArea || ""}
                  />
                  <DesktopSpecRow
                    label="Oda Sayısı"
                    value={data.details?.roomCount || ""}
                  />
                  <DesktopSpecRow
                    label="Bina Yaşı"
                    value={data.details?.buildingAge || ""}
                  />
                  <DesktopSpecRow
                    label="Bulunduğu Kat"
                    value={data.details?.floor || ""}
                  />
                  <DesktopSpecRow
                    label="Kat Sayısı"
                    value={data.details?.totalFloor || ""}
                  />
                  <DesktopSpecRow
                    label="Isıtma"
                    value={data.details?.heating || ""}
                  />
                  <DesktopSpecRow
                    label="Banyo Sayısı"
                    value={data.details?.bathCount || ""}
                  />
                  <DesktopSpecRow
                    label="Balkon"
                    value={
                      typeof data.details?.balcony === "boolean"
                        ? data.details.balcony
                          ? "Var"
                          : "Yok"
                        : (data.details?.balcony as any) || ""
                    }
                  />
                  <DesktopSpecRow
                    label="Asansör"
                    value={
                      typeof data.details?.elevator === "boolean"
                        ? data.details.elevator
                          ? "Var"
                          : "Yok"
                        : (data.details?.elevator as any) || ""
                    }
                  />

                  <DesktopSpecRow
                    label="Eşyalı"
                    value={
                      typeof data.details?.furniture === "boolean"
                        ? data.details.furniture
                          ? "Evet"
                          : "Hayır"
                        : (data.details?.furniture as any) || ""
                    }
                  />

                  <DesktopSpecRow
                    label="Site İçerisinde"
                    value={
                      typeof data.details?.inSite === "boolean"
                        ? data.details.inSite
                          ? "Evet"
                          : "Hayır"
                        : (data.details?.inSite as any) || ""
                    }
                  />
                  <DesktopSpecRow
                    label="Tapu Durumu"
                    value={data.details?.deed || ""}
                  />
                  <DesktopSpecRow
                    label="Kimden"
                    value={"Sahibinden"}
                    valueClassName="text-blue-700"
                  />
                </div>

                <div className="mt-2 text-[12px] text-blue-700 hover:underline cursor-pointer">
                  İlan ile ilgili Şikayetim Var
                </div>
              </div>
            </div>

            {/* SAĞ: Kişi kartı + güvenlik ipucu */}
            <div className="col-span-3">
              <div className="border border-gray-300 bg-white">
                <div className="p-3 border-b border-gray-300">
                  <div className="text-[12px] font-semibold text-gray-900">
                    {data.advisor?.name} {data.advisor?.surname}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Hesap açma tarihi: Şubat 2022
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] text-gray-500">Cep</div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">
                      {formatPhoneNumber(placeholderPhoneNumber)}
                    </div>

                    <button
                      onClick={() => copyNumber(placeholderPhoneNumber)}
                      className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-600" />{" "}
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Kopyala
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3">
                    <button className="w-full h-8 border border-gray-300 bg-gray-50 text-[12px] font-semibold text-gray-700 hover:bg-white">
                      Mesaj Gönder
                    </button>
                  </div>
                </div>
              </div>

              {/* Güvenlik ipuçları */}
              <div className="mt-3 border border-gray-300 bg-white p-3">
                <div className="text-[12px] font-bold text-blue-700">
                  Güvenlik İpuçları
                </div>
                <div className="mt-2 text-[11px] text-gray-700 leading-4">
                  Kiralayacağınız gayrimenkulü görmeden kapora ve benzeri bir
                  ödeme gerçekleştirmeyin.
                </div>
                <div className="mt-2 text-[11px] text-blue-700 hover:underline cursor-pointer">
                  Detaylı bilgi için tıklayın.
                </div>
              </div>
            </div>

            {/* ALT TAB MENÜ + İÇERİK */}
            <div className="col-span-12 mt-4">
              <div className="flex items-end gap-1">
                <DesktopTabButton
                  active={desktopTab === "details"}
                  onClick={() => setDesktopTab("details")}
                >
                  İlan Detayları
                </DesktopTabButton>

                <DesktopTabButton
                  active={desktopTab === "location"}
                  onClick={() => setDesktopTab("location")}
                >
                  Konumu ve Sokak Görünümü
                </DesktopTabButton>

                <div className="flex-1 border-b border-gray-300" />
              </div>

              <div className="mt-0 border border-gray-300 bg-[#f7f7f7] p-3">
                {desktopTab === "details" && renderDesktopDetailsContent()}
                {desktopTab === "location" && renderDesktopLocationContent()}
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
