// src/features/home/why-us/data/content.ts
import { Users, Shield, BarChart3, Heart, TrendingUp, Home, Eye } from "lucide-react";
import type { WhyUsContent } from "../types";

export const whyUsContent: WhyUsContent = {
  heading: "Neden",
  headingHighlight: "Yenigün Emlak?",
  subheading:
    "Profesyonel ekibimiz ve geniş ağımızla hayalinizdeki yaşam alanını bulmanız için buradayız.",
  image: {
    src: "https://picsum.photos/id/1067/800/600",
    alt: "Neden Yenigün Emlak",
  },
  badge: {
    countText: "4,500+",
    label: "mutlu müşteri",
    icon: Heart,
  },
  whyUsItems: [
    {
      title: "Profesyonel Danışmanlar",
      icon: Users,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
      iconColor: "text-white",
      description:
        "Deneyimli danışmanlarımızla birebir hizmet sunuyoruz. Alım-satım ve kiralama süreçlerinde profesyonel rehberlik.",
    },
    {
      title: "En İyi Hizmet",
      icon: BarChart3,
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      iconColor: "text-white",
      description:
        "Modern teknolojiler ve piyasa analizleriyle en doğru kararları almanızı sağlıyoruz.",
    },
    {
      title: "Güvenilir Ekip",
      icon: Shield,
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      iconColor: "text-white",
      description:
        "Güven ve dürüstlük temel prensibimiz. Doğru bilgiyle süreçlerinizi kolaylaştırıyoruz.",
    },
  ],
  stats: [
    {
      title: "Aylık Ziyaretçi",
      count: 50000,
      suffix: "+",
      duration: 2.5,
      icon: Eye,
      iconColor: "text-blue-300",
      description: "Aktif kullanıcı",
    },
    {
      title: "Gayrimenkul Ağı",
      count: 3000,
      suffix: "+",
      duration: 2,
      icon: Home,
      iconColor: "text-emerald-300",
      description: "Portföy sayısı",
    },
    {
      title: "Aylık Satış",
      count: 7000,
      suffix: "+",
      duration: 2,
      icon: TrendingUp,
      iconColor: "text-amber-300",
      description: "Başarılı işlem",
    },
  ],
  cta: {
    title: "Siz de Ailemize Katılın",
    description: "Binlerce mutlu müşterimiz arasında yerinizi alın",
    buttonText: "Hemen Başlayın",
    href: "https://wa.me/905322328405",
  },
};
