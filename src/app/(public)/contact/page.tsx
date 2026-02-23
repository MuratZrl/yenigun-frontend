// src/app/(public)/contact/page.tsx
import {
  ContactHeroSection,
  ContactInfoSection,
  ContactFormSection,
  WhatsAppCTASection,
  MapSection,
} from "@/features/contact";

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <hr className="border-t border-gray-200" />
      <ContactInfoSection />
      <hr className="border-t border-gray-200" />
      <ContactFormSection />
      <hr className="border-t border-gray-200" />
      <WhatsAppCTASection />
      <hr className="border-t border-gray-200" />
      <MapSection />
    </>
  );
}
