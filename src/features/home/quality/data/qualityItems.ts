// src/features/home/quality/data/qualityItems.ts
import type { QualityItem } from "../types";

export const qualityItems: QualityItem[] = [
  {
    title: "Satılık Konutlar",
    description:
      "Profesyonel ekibimiz ile satılık konutları size uygun şekilde sunuyoruz.",
    image: "/icons/buy.svg",
    gradient: "from-blue-600 to-indigo-700",
    button: {
      title: "Konutları Görüntüle",
      link: "/ads?action=buy",
    },
  },
{
    title: "Kiralama Sistemi",
    description:
      "Geniş ağımız ile ister ev kiralayabilir ister kiraya verebilirsiniz. Size en uygun kişileri danışmanlarımız ayarlayacaktır.",
    image: "/icons/rent.svg",
    gradient: "from-purple-600 to-blue-700",
    button: {
      title: "Bilgi Al",
      link: "/about",
    },
  },
];
