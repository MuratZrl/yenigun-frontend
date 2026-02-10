// src/features/ads/ui/detail/components/sections/HeaderSection.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Share2, Check, Star, Printer, Facebook, Mail } from "lucide-react";

import type { AdvertData } from "@/types/advert";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

type Props = {
  /**
   * Yeni kullanım: tek parça data
   */
  data?: AdvertData;

  /**
   * Eski kullanım: tek tek (geri uyumluluk)
   * data ile beraber geçersen, tek tek prop’lar önceliklidir.
   */
  title?: string | null;

  /**
   * Mobile bar başlığı (sticky)
   */
  mobileBarTitle?: string;

  /**
   * Back action. Vermezsen history.back().
   */
  onBack?: () => void;

  /**
   * Share metni / url. Vermezsen title + location.href.
   */
  shareText?: string;
  shareUrl?: string;

  /**
   * Favori yönetimi. Vermezsen local state ile "toggle" yapar.
   */
  isFavorited?: boolean;
  onToggleFavorite?: (next: boolean) => void;

  /**
   * Yazdır aksiyonu. Vermezsen window.print().
   */
  onPrint?: () => void;

  /**
   * Sağ aksiyonları kapatmak istersen.
   */
  showActions?: boolean;

  className?: string;
};

function safeText(v: any) {
  if (typeof v === "string") return v.trim();
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/**
 * X (Twitter) için lucide'de "X" genelde close ikonudur; logoya benzemiyor.
 * Bu yüzden küçük bir SVG ile gerçek X görünümünü veriyoruz.
 */
function XLogoIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1200 1227"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.276 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.12 619.934L138.692 79.6944H301.21L609.172 515.9L657.217 583.793L1058.37 1150.3H895.852L569.165 687.828Z"
      />
    </svg>
  );
}

function openPopup(url: string) {
  if (typeof window === "undefined") return;
  const w = 620;
  const h = 520;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - w) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - h) / 2));
  window.open(url, "_blank", `noopener,noreferrer,width=${w},height=${h},left=${left},top=${top}`);
}

export default function HeaderSection({
  data,
  title,
  mobileBarTitle = "İlan Detayı",
  onBack,
  shareText,
  shareUrl,
  isFavorited,
  onToggleFavorite,
  onPrint,
  showActions = true,
  className,
}: Props) {
  const resolvedTitle = useMemo(() => {
    const t = safeText(title) || safeText((data as any)?.title);
    return t || "İlan";
  }, [title, data]);

  // Favori state: dışarıdan kontrol gelirse onu kullan, yoksa local
  const [favLocal, setFavLocal] = useState(false);
  const fav = typeof isFavorited === "boolean" ? isFavorited : favLocal;

  const toggleFav = () => {
    const next = !fav;
    if (onToggleFavorite) onToggleFavorite(next);
    else setFavLocal(next);
  };

  const handleBack = () => {
    if (onBack) return onBack();
    if (typeof window !== "undefined") window.history.back();
  };

  const handlePrint = () => {
    if (onPrint) return onPrint();
    if (typeof window !== "undefined") window.print();
  };

  // Mobile share/copy için (desktop’ta share ikonları var)
  const { copied, copy } = useCopyToClipboard({ resetAfterMs: 2000 });

  const handleMobileShare = async () => {
    if (typeof window === "undefined") return;

    const url = shareUrl || window.location.href;
    const t = resolvedTitle || "Yenigün Emlak";
    const txt = safeText(shareText) || t;

    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: t, text: txt, url });
        return;
      }
      await copy(url);
    } catch {
      // kullanıcı iptal etti, dünya yıkılmadı
    }
  };

  const getShareUrl = () => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const sharePayload = () => {
    const url = getShareUrl();
    const t = resolvedTitle || "Yenigün Emlak";
    const txt = safeText(shareText) || t;
    return { url, t, txt };
  };

  const shareFacebook = () => {
    const { url } = sharePayload();
    if (!url) return;
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  };

  const shareX = () => {
    const { url, txt } = sharePayload();
    if (!url) return;
    openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(txt)}`);
  };

  const shareEmail = () => {
    const { url, t, txt } = sharePayload();
    if (typeof window === "undefined") return;
    const subject = encodeURIComponent(t);
    const body = encodeURIComponent(`${txt}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Tasarıma benzesin diye desktop title büyük ve uppercase
  const desktopTitle = useMemo(() => resolvedTitle.toUpperCase(), [resolvedTitle]);

  // SSR-safe: ilk render'da window yok; desktop ikonlar yine de buton olarak durabilir
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  return (
    <header className={className ?? "w-full"}>
      {/* DESKTOP: Tek satır header bar (breadcrumb yok) */}
      <div className="hidden lg:block bg-white">

          <div className="h-0 flex items-center justify-between gap-4">
            <h1 className="min-w-0 truncate text-[18px] font-semibold text-gray-900 uppercase tracking-normal">
              {desktopTitle}
            </h1>

            {showActions && (
              <div className="shrink-0 flex items-center gap-3 text-[12px]">
                <button
                    type="button"
                    onClick={toggleFav}
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline underline-offset-2"
                    aria-label="Favorilerime ekle"
                    title="Favorilerime Ekle"
                    >
                    <Star size={16} className={fav ? "fill-yellow-400 text-blue-700" : "text-blue-700"} />
                    <span>Favorilerime Ekle</span>
                </button>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline underline-offset-2"
                    aria-label="Yazdır"
                    title="Yazdır"
                    >
                    <Printer size={16} className="text-blue-700" />
                    <span>Yazdır</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => isHydrated && shareFacebook()}
                    className="text-gray-700 hover:text-gray-900"
                    aria-label="Facebook ile paylaş"
                    title="Facebook"
                  >
                    <Facebook size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => isHydrated && shareX()}
                    className="text-gray-700 hover:text-gray-900"
                    aria-label="X ile paylaş"
                    title="X"
                  >
                    <XLogoIcon size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => isHydrated && shareEmail()}
                    className="text-gray-700 hover:text-gray-900"
                    aria-label="E-posta ile paylaş"
                    title="E-posta"
                  >
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>

      {/* MOBILE: Sticky App Bar (breadcrumb yok) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#1f6f93] text-white">
        <div className="flex items-center justify-between h-12 px-3">
          <button
            type="button"
            className="p-2 -ml-2 active:opacity-80"
            onClick={handleBack}
            aria-label="Geri"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="font-semibold text-base truncate">{mobileBarTitle}</div>

          <button
            type="button"
            className="p-2 active:opacity-80 relative"
            onClick={handleMobileShare}
            aria-label="Paylaş"
            title="Paylaş"
          >
            <Share2 size={20} />
            {copied && (
              <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                <Check size={12} className="inline mr-1" />
                Kopyalandı
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE: Title row (istersen kaldırabilirsin, tasarım tercihi) */}
      <div className="lg:hidden bg-white px-3 py-3 border-b border-gray-200">
        <div className="text-[13px] font-semibold text-gray-800 leading-snug uppercase">
          {resolvedTitle}
        </div>

        {showActions && (
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <button
              type="button"
              onClick={toggleFav}
              className="inline-flex items-center gap-1 text-gray-700"
              aria-label="Favorilerime ekle"
            >
              <Star size={16} className={fav ? "fill-yellow-400 text-yellow-500" : "text-gray-700"} />
              <span className="font-medium">Favorilerime Ekle</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 text-gray-700"
              aria-label="Yazdır"
            >
              <Printer size={16} />
              <span className="font-medium">Yazdır</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
