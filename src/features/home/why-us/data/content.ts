// src/features/home/why-us/data/content.ts
import type { WhyUsContent } from "../types";

export const whyUsContent: WhyUsContent = {
  heading: "Neden",
  headingHighlight: "Yenigün Emlak?",
  subheading:
    "Profesyonel ekibimiz ve geniş ağımızla hayalinizdeki yaşam alanını bulmanız için buradayız.",
  image: {
    src: "https://picsum.photos/seed/yenigun-office/800/600",
    alt: "Neden Yenigün Emlak",
  },
  badge: {
    countText: "4,500+",
    label: "mutlu müşteri",
    icon: "/icons/type_1.jpeg",
  },
  whyUsItems: [
    {
      title: "Profesyonel Danışmanlar",
      icon: "/icons/type_1.jpeg",
      description:
        "Deneyimli danışmanlarımızla birebir hizmet sunuyoruz. Alım-satım ve kiralama süreçlerinde profesyonel rehberlik.",
    },
    {
      title: "En İyi Hizmet",
      icon: "/icons/type_1.jpeg",
      description:
        "Modern teknolojiler ve piyasa analizleriyle en doğru kararları almanızı sağlıyoruz.",
    },
    {
      title: "Güvenilir Ekip",
      icon: "/icons/type_1.jpeg",
      description:
        "Güven ve dürüstlük temel prensibimiz. Doğru bilgiyle süreçlerinizi kolaylaştırıyoruz.",
    },
  ],
  stats: [
    { title: "Aylık Ziyaretçi", count: 50000, suffix: "+", duration: 2.5 },
    { title: "Gayrimenkul Ağı", count: 3000, suffix: "+", duration: 2 },
    { title: "Aylık Satış", count: 7000, suffix: "+", duration: 2 },
  ],
  cta: {
    title: "Siz de Ailemize Katılın",
    description: "Binlerce mutlu müşterimiz arasında yerinizi alın",
    buttonText: "Hemen Başlayın",
    href: "https://wa.me/905322328405",
  },
};
