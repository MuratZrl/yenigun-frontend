// src/features/ads/ui/detail/index.ts

// Main client page
export { default as AdvertDetailClient } from "./AdvertDetailClient";

// Sections
export { default as HeaderSection } from "./components/sections/HeaderSection.client";
export { default as PhotoGallerySection } from "./components/sections/PhotoGallerySection.client";
export { default as PriceSummarySection } from "./components/sections/PriceSummarySection.client";
export { default as TabsSection } from "./components/sections/TabsSection.client";
export { default as BottomActionBar } from "./components/sections/BottomActionBar.client";
export { default as RightSidebarSection } from "./components/sections/RightSidebarSection.client";

// Eğer projende hâlâ kullanıyorsan kalsın; yoksa bu satırı sil.
// export { default as AdvisorSection } from "./components/sections/AdvisorSection.client";

// Panels
export { default as DescriptionPanel } from "./components/sections/panels/DescriptionPanel.client";
export { default as DetailsPanel } from "./components/sections/panels/DetailsPanel.client";
export { default as LocationPanel } from "./components/sections/panels/LocationPanel.client";


// Shared UI
export { default as DesktopSpecRow } from "./components/shared/DesktopSpecRow";
export { default as DetailRow } from "./components/shared/DetailRow";
export { default as FeatureCard } from "./components/shared/FeatureCard";
export { default as MarkdownBox } from "./components/shared/MarkdownBox";
export { default as PhotoThumbnailsHorizontal } from "./components/shared/PhotoThumbnailsHorizontal";

// Modals (senin dediğin konum: components/model)
export { default as VideoModal } from "./components/model/VideoModel";
export { default as ZoomPhotoModal } from "./components/model/ZoomPhotoModel";

// Hooks (senin dediğin konum: detail/hooks)
export { useBodyScrollLock } from "./hooks/useBodyScrollLock";
export { useCopyToClipboard } from "./hooks/useCopyToClipboard";
export { usePhotoGallery } from "./hooks/usePhotoGallery";
export { useSwipe } from "./hooks/useSwipe";
