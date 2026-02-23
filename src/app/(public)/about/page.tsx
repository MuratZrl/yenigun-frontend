// src/app/(public)/about/page.tsx
import {
  AboutHeroSection,
  StatsSection,
  HistorySection,
  MissionVisionSection,
  ValuesSection,
  CTASection,
} from "@/features/about";
import CommentsSection from "@/features/home/comments/CommentsSection.client";
import RepresentativesSection from "@/features/home/representatives/RepresentativesSection.client";
import FaqSection from "@/features/home/faq/FaqSection.client";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <hr className="border-t border-gray-200" />
      <StatsSection />
      <hr className="border-t border-gray-200" />
      <HistorySection />
      <hr className="border-t border-gray-200" />
      <MissionVisionSection />
      <hr className="border-t border-gray-200" />
      <ValuesSection />
      <hr className="border-t border-gray-200" />
      <RepresentativesSection />
      <hr className="border-t border-gray-200" />
      <CommentsSection />
      <hr className="border-t border-gray-200" />
      <FaqSection />
      <hr className="border-t border-gray-200" />
      <CTASection />
    </>
  );
}
