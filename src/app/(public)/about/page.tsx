// src/app/(public)/about/page.tsx
import {
  AboutHeroSection,
  StatsSection,
  HistorySection,
  ValuesSection,
  CTASection,
} from "@/features/about";
import Comments from "@/components/layout/Comments";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <StatsSection />
      <HistorySection />
      <ValuesSection />
      <Comments />
      <CTASection />
    </>
  );
}
