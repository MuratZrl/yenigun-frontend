// src/features/home/comments/data/comments.ts
import type { CommentItem } from "../types";

export const commentsData: CommentItem[] = [
  {
    title: "Harika Deneyim",
    comment:
      "Yenigün Emlak ile çalışmak harika bir deneyimdi. Danışmanlarımızın profesyonel yaklaşımı ve süreç boyunca gösterdikleri özen sayesinde hayalimizdeki evi bulduk.",
    star: 5,
    author: {
      title: "Defne A***",
      image: "/human.jpeg",
      location: "Serdivan, Sakarya",
      job: "Doktor",
    },
  },
  {
    title: "Güvenilir Hizmet",
    comment:
      "Emlak danışmanımız bize sadece ev bulmakla kalmadı, aynı zamanda tüm süreçte rehberlik etti. Samimi ve güvenilir hizmetleri için çok teşekkür ederiz. Kesinlikle tavsiye ediyoruz.",
    star: 5,
    author: {
      title: "Doruk K***",
      image: "/human_2.jpeg",
      location: "Adapazarı, Sakarya",
      job: "Mühendis",
    },
  },
  {
    title: "Profesyonel Ekip",
    comment:
      "Ev alma sürecimizde Yenigün Emlak ekibi adeta bir aile gibi yanımızdaydı. Her sorumuza anında cevap verdiler ve işlemlerimiz sorunsuz ilerledi. Çok memnun kaldık!",
    star: 5,
    author: {
      title: "Ahmet M***",  
      image: "/human_3.jpeg",
      location: "Sapanca, Sakarya",
      job: "Öğretmen",
    },
  },
  {
    title: "Mükemmel Destek",
    comment:
      "Yenigün Emlak'ın ilgili ve bilgili ekibi sayesinde istediğimiz özelliklere uygun birçok seçenek bulduk. Sürecin her aşamasında destek aldığımız için çok şanslıyız.",
    star: 5,
    author: {
      title: "Melih C***",
      image: "/human_4.jpeg",
      location: "Karasu, Sakarya",
      job: "İş Adamı",
    },
  },
  {
    title: "Kaliteli Hizmet",
    comment:
      "Emlak piyasasında bu kadar profesyonel ve müşteri odaklı bir firma bulmak gerçekten zor. Yenigün Emlak, verdiği kaliteli hizmetle fark yaratıyor. Teşekkürler!",
    star: 5,
    author: {
      title: "Arya R***",
      image: "/human_5.jpeg",
      location: "Akyazı, Sakarya",
      job: "Mimar",
    },
  },
  {
    title: "Hızlı Çözüm",
    comment:
      "Acil ev ihtiyacımız vardı ve Yenigün Emlak ekibi inanılmaz hızlı hareket etti. Bir hafta içinde istediğimiz kriterlere uygun ev buldular. Süper bir ekip!",
    star: 5,
    author: {
      title: "Can Y***",
      image: "/human_3.jpeg",
      location: "Hendek, Sakarya",
      job: "Serbest Meslek",
    },
  },
];
