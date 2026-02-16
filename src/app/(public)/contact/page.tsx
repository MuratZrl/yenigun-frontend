// src/app/(public)/contact/page.tsx
import {
  ContactHeroSection,
  ContactStatsSection,
  ContactInfoSection,
  WhatsAppCTASection,
  MapSection,
} from "@/features/contact";

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactStatsSection />
      <ContactInfoSection />
      <WhatsAppCTASection />
      <MapSection />
    </>
  );
}
