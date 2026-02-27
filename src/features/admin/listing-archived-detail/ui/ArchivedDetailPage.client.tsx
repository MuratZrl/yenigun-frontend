// src/features/admin/emlak-archived-detail/ui/ArchivedDetailPage.client.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import CategorySection from "@/components/ui/CategorySection";

import { useArchivedDetail } from "../hooks/useArchivedDetail";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { useAdminActions } from "../hooks/useAdminActions";
import { getSafePhotos } from "../utils/helpers";

import PhotoGallery from "./PhotoGallery";
import PhotoZoomModal from "./PhotoZoomModal";
import VideoModal from "./VideoModal";
import FeaturesSection from "./FeaturesSection";
import DetailsSection from "./DetailsSection";
import DescriptionSection from "./DescriptionSection";
import LocationSection from "./LocationSection";
import Sidebar from "./Sidebar";

type Props = {
  uid: string;
};

export default function ArchivedDetailPage({ uid }: Props) {
  const router = useRouter();
  const { data, loading, error } = useArchivedDetail(uid);

  /* ---- Loading ---- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
          <p className="text-gray-600">Arşivlenmiş ilan yükleniyor...</p>
        </div>
      </div>
    );
  }

  /* ---- Error ---- */
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h1>
          <p className="text-gray-600 mb-4">{error || "Arşivlenmiş ilan mevcut değil."}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/admin/archived")}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Arşivlenmiş İlanlara Dön
            </button>
            <button
              onClick={() => router.push("/admin/ads")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Aktif İlanlara Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ArchivedDetailContent data={data} />;
}

/* ================================================================== */
/*  Inner component — only renders when data is available             */
/* ================================================================== */

function ArchivedDetailContent({ data }: { data: NonNullable<ReturnType<typeof useArchivedDetail>["data"]> }) {
  const safePhotos = getSafePhotos(data.photos);

  const gallery = usePhotoGallery(safePhotos);
  const actions = useAdminActions(data.uid);

  /* ---- Page title ---- */
  useEffect(() => {
    if (data.title) {
      document.title = `${data.title} (Arşivlendi) - Admin Panel - Yenigün Emlak`;
    }
  }, [data.title]);

  return (
    <AdminLayout>
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb + Header */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
              <span>Admin</span><span>›</span>
              <span>Arşivlenmiş İlanlar</span><span>›</span>
              <span>{data.steps.first}</span><span>›</span>
              <span>{data.steps.second}</span><span>›</span>
              <span className="text-gray-700">{data.address.district}</span><span>›</span>
              <span className="text-amber-600 font-medium">Detay</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {data.title}
              <span className="ml-3 text-amber-600 text-lg font-normal bg-amber-100 px-3 py-1 rounded-full">
                Arşivlenmiş İlan
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={16} />
                <span>{data.address.province}, {data.address.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600" size={16} />
                <span>
                  {new Date(data.created.createdTimestamp).toLocaleDateString("tr-TR", {
                    year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric",
                  })}
                </span>
              </div>
              <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                İlan No: {data.uid}
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                Danışman: {data.advisor.name} {data.advisor.surname}
              </div>
            </div>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <PhotoGallery
                photos={safePhotos}
                currentPhoto={gallery.currentPhoto}
                selectedPhoto={gallery.selectedPhoto}
                hasPhotos={gallery.hasPhotos}
                shouldShowLoading={gallery.shouldShowLoading}
                copied={actions.copied}
                video={data.video}
                onSelectPhoto={gallery.setSelectedPhoto}
                onClickPhoto={gallery.handleClickedPhoto}
                onImageLoad={() => gallery.setImageLoading(false)}
                onOpenVideo={() => gallery.setOpenVideo(true)}
                onShare={actions.handleShare}
              />

              <FeaturesSection details={data.details} />
              <DetailsSection data={data} />

              <CategorySection
                categoryId={data.categoryId}
                subcategoryId={data.subcategoryId}
                featureValues={data.featureValues}
              />

              <DescriptionSection thoughts={data.thoughts} />
              <LocationSection address={data.address} />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <Sidebar
                data={data}
                isReactivating={actions.isReactivating}
                isDeleting={actions.isDeleting}
                onReactivate={actions.handleReactivate}
                onDelete={actions.handleDelete}
                onEdit={() => actions.router.push(`/admin/ads/edit/${data.uid}`)}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <VideoModal
          open={gallery.openVideo}
          videoUrl={data.video || ""}
          onClose={() => gallery.setOpenVideo(false)}
        />

        <PhotoZoomModal
          zoom={gallery.zoom}
          photos={safePhotos}
          selectedPhoto={gallery.selectedPhoto}
          hasPhotos={gallery.hasPhotos}
          onClose={gallery.closeZoom}
          onPrevious={gallery.goToPrevious}
          onNext={gallery.goToNext}
          onClickPhoto={gallery.handleClickedPhoto}
          onSelectPhoto={gallery.setSelectedPhoto}
        />
      </main>
    </AdminLayout>
  );
}