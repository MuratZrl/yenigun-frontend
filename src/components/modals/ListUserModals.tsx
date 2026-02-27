// src/components/modals/ListUserModals.tsx

import React, { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import {
  X,
  Building2,
  Home,
  Armchair,
  Layers,
  Square,
  Clock,
  MapPin,
  Info,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/api";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Types ── */
interface UserLike {
  uid?: string | number;
  name?: string;
  surname?: string;
  [key: string]: unknown;
}

interface ListUserModalProps {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepting both plain callback and setState dispatch
  setOpen: (state: any) => void;
  user: UserLike | null;
  cookies?: Record<string, string>;
}

interface AdvertData {
  uid: string;
  _id?: string;
  title?: string;
  active?: boolean;
  fee?: number | string;
  photos?: string[];
  address?: {
    province?: string;
    district?: string;
    quarter?: string;
  };
  steps?: {
    first?: string;
    second?: string;
    third?: string;
  };
  details?: {
    roomCount?: string | number;
    floor?: string | number;
    netArea?: string | number;
    acre?: string | number;
    [key: string]: unknown;
  };
  created?: {
    createdTimestamp?: number;
  };
}

/* ── Helpers ── */
function formatFee(fee: number | string | undefined): string {
  if (!fee) return "Belirtilmemiş";
  const num = typeof fee === "string" ? parseFloat(fee) : fee;
  if (isNaN(num)) return String(fee);
  return num.toLocaleString("tr-TR") + " ₺";
}

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Component ── */
const ListUserModal = ({ open, setOpen, user }: ListUserModalProps) => {
  const [list, setList] = useState<AdvertData[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user?.uid && open) {
      const fetchUserAdverts = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/admin/customers/${user.uid}/adverts?sortBy=created&sortOrder=desc`
          );

          if (response.data.success) {
            setList(response.data.data || []);
          } else {
            toast.error("İlanlar yüklenirken bir hata oluştu");
            setList([]);
          }
        } catch (error) {
          console.error("İlan getirme hatası:", error);
          toast.error("İlanlar yüklenirken bir hata oluştu");
          setList([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUserAdverts();
    }
  }, [user?.uid, open]);

  const handleClose = () => {
    setOpen({ open: false, user: null });
  };

  if (!open) return null;

  const activeCount = list.filter((ad) => ad.active).length;
  const passiveCount = list.filter((ad) => !ad.active).length;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[920px] mx-4 max-h-[92vh] overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col"
        style={PoppinsFont.style}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5 shrink-0">
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-[#000066] via-[#035DBA] to-[#03409F] rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#000066] to-[#035DBA] rounded-xl flex items-center justify-center shadow-lg shadow-[#035DBA]/25">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">Mülk Sahibi Mülkleri</h2>
                <p className="text-xs text-black/38 mt-0.5">
                  {user?.name} {user?.surname}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E9EEF7] rounded-lg">
                <span className="text-xs font-semibold text-[#000066]">{list.length}</span>
                <span className="text-[10px] font-medium text-[#035DBA]">Toplam</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                <span className="text-xs font-semibold text-emerald-700">{activeCount}</span>
                <span className="text-[10px] font-medium text-emerald-600">Aktif</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                <span className="text-xs font-semibold text-red-700">{passiveCount}</span>
                <span className="text-[10px] font-medium text-red-600">Pasif</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-3 border-[#035DBA] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-black/40">İlanlar yükleniyor...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && list.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-black/30">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Info size={28} className="text-black/20" />
              </div>
              <p className="text-sm font-medium">Henüz mülk eklenmemiş</p>
            </div>
          )}

          {/* Advert Cards Grid */}
          {!loading && list.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((ad, index) => (
                <AdvertCard key={ad.uid || ad._id || index} advert={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Advert Card ── */
function AdvertCard({ advert }: { advert: AdvertData }) {
  const photo = advert.photos?.find((p) => typeof p === "string") || "/logo.png";
  const location = [
    advert.address?.province,
    advert.address?.district,
    advert.address?.quarter,
  ]
    .filter(Boolean)
    .join(" / ");

  const specs: { icon: React.ReactNode; label: string }[] = [];
  if (advert.steps?.third) specs.push({ icon: <Home size={12} />, label: advert.steps.third });
  if (advert.details?.roomCount) specs.push({ icon: <Armchair size={12} />, label: `${advert.details.roomCount}+1` });
  if (advert.details?.floor) specs.push({ icon: <Layers size={12} />, label: `${advert.details.floor}. Kat` });
  if (advert.details?.netArea) specs.push({ icon: <Square size={12} />, label: `${advert.details.netArea} m²` });
  if (advert.details?.acre) specs.push({ icon: <Square size={12} />, label: String(advert.details.acre) });

  return (
    <Link
      href={"/ads/" + advert.uid}
      target="_blank"
      className="group flex flex-col rounded-xl border border-black/6 bg-white overflow-hidden hover:border-[#035DBA]/30 hover:shadow-lg hover:shadow-[#035DBA]/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-[160px] overflow-hidden bg-gray-100">
        <img
          src={photo}
          alt={advert.title || "İlan"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {advert.active ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-emerald-500 text-white rounded-full shadow-sm">
              <Eye size={10} />
              Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-red-500 text-white rounded-full shadow-sm">
              <EyeOff size={10} />
              Pasif
            </span>
          )}
        </div>

        {/* Step Badge */}
        {advert.steps?.first && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-white/90 text-[#000066] rounded-full backdrop-blur-sm shadow-sm">
              {advert.steps.second || "0"} / {advert.steps.first}
            </span>
          </div>
        )}

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 text-sm font-bold bg-white/95 text-[#000066] rounded-lg backdrop-blur-sm shadow-sm">
            {formatFee(advert.fee)}
          </span>
        </div>

        {/* External link icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
            <ExternalLink size={14} className="text-[#035DBA]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#035DBA] transition-colors">
          {advert.title || "İsimsiz İlan"}
        </h3>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-black/40">
            <MapPin size={12} className="shrink-0" />
            <span className="text-xs truncate">{location}</span>
          </div>
        )}

        {/* Specs */}
        {specs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {specs.map((spec, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-black/6 rounded-md text-[10px] font-medium text-black/50"
              >
                {spec.icon}
                {spec.label}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 text-black/30 mt-auto pt-2">
          <Clock size={11} />
          <span className="text-[10px] font-medium">
            {formatDate(advert.created?.createdTimestamp)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ListUserModal;
