// src/app/components/layout/Footer.tsx
import Link from "next/link";
import React from "react";
import { Phone, HelpCircle } from "lucide-react";

type FooterLink = { label: string; href: string; external?: boolean };

const Footer = () => {
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: "Kurumsal",
      links: [
        { label: "Hakkımızda", href: "/about" },
        { label: "Sürdürülebilirlik", href: "/about" },
        { label: "İnsan Kaynakları", href: "/about" },
        { label: "Haberler", href: "/about" },
        { label: "Site Haritası", href: "/about" },
        { label: "İletişim", href: "/contact" },
      ],
    },
    {
      title: "Hizmetlerimiz",
      links: [
        { label: "İlanlar", href: "/ads" },
        { label: "Detaylı Arama", href: "/search" },
        { label: "Harita", href: "/Harita" },
        { label: "Güvenli Alışveriş İpuçları", href: "/about" },
        { label: "Yardım", href: "/contact" },
      ],
    },
    {
      title: "Mağazalar",
      links: [
        { label: "Neden Mağaza?", href: "/about" },
        { label: "Mağaza Açmak İstiyorum", href: "/about" },
      ],
    },
    {
      title: "Gizlilik ve Kullanım",
      links: [
        { label: "Sözleşmeler ve Kurallar", href: "/about" },
        { label: "Hesap Sözleşmesi", href: "/about" },
        { label: "Kullanım Koşulları", href: "/about" },
        { label: "Kişisel Verilerin Korunması", href: "/about" },
        { label: "Çerez Yönetimi", href: "/about" },
        { label: "Yardım ve İşlem Rehberi", href: "/about" },
      ],
    },
    {
      title: "Bizi Takip Edin",
      links: [
        { label: "Facebook", href: "https://facebook.com", external: true },
        { label: "X", href: "https://x.com", external: true },
        { label: "LinkedIn", href: "https://linkedin.com", external: true },
        { label: "Instagram", href: "https://instagram.com", external: true },
        { label: "YouTube", href: "https://youtube.com", external: true },
      ],
    },
  ];

  const renderLink = (l: FooterLink) => {
    if (l.external) {
      return (
        <a
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          {l.label}
        </a>
      );
    }
    return (
      <Link
        href={l.href}
        className="text-sm text-slate-600 hover:text-slate-900"
      >
        {l.label}
      </Link>
    );
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>{renderLink(l)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm leading-tight">
                  <div className="font-semibold text-red-700">
                    7/24 Müşteri Hizmetleri
                  </div>
                  <div className="text-slate-700">0 (850) 000 00 00</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-sm leading-tight">
                  <div className="font-semibold text-red-700">Yardım Merkezi</div>
                  <div className="text-slate-700">yardim.yenigunemlak.com</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex items-center justify-start lg:justify-end">
              <div className="w-full sm:w-auto">
                <label className="text-xs text-slate-500 block mb-1">
                  Dil Seçimi
                </label>
                <select className="h-10 w-full sm:w-64 border border-slate-300 rounded-sm px-3 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="border border-dashed border-slate-300 rounded-sm p-4 text-xs text-slate-600 leading-relaxed">
              Yenigün Emlak’ta yer alan içerik, ilan ve bilgilerin doğruluğu ve
              yayınlanması ile ilgili sorumluluk içerik sağlayıcıya aittir.
              Yenigün Emlak; yanlış, eksik ya da kurallara aykırı içeriklerden
              sorumlu değildir. Sorularınız için ilan sahibi ile iletişime
              geçebilirsiniz.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-slate-500">
            <div>Copyright © {new Date().getFullYear()} Yenigün Emlak</div>
            <div>(*) Kampanya ve kullanım şartları ilgili sayfalarda belirtilir.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
