import Link from "next/link";
import React from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Twitter,
  MapPin,
  Mail,
} from "lucide-react";

const Footer = () => {
  const navbar_items = [
    { name: "Hakkımızda", href: "/about" },
    { name: "İletişim", href: "/contact" },
    { name: "İlanlar", href: "/ads" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/logo.png"
                alt="Yenigün Emlak"
                className="w-48 h-auto"
              />
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              Yenigün Emlak olarak, hayalinizdeki yaşam alanını bulmanız için
              profesyonel danışmanlık hizmeti sunuyoruz. Güvenilir ve kaliteli
              hizmet anlayışımızla yanınızdayız.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: Facebook,
                  href: "https://facebook.com",
                  color: "hover:bg-blue-600",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com",
                  color: "hover:bg-pink-600",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com",
                  color: "hover:bg-black",
                },
                {
                  icon: MessageCircle,
                  href: "https://wa.me/905322328405",
                  color: "hover:bg-green-600",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <social.icon className="text-white text-lg" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">İletişim</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <div className="flex flex-col">
                  <a
                    href="tel:+905322328405"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    (+90) 532 232 84 05
                  </a>
                  <a
                    href="tel:+902642721630"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    (+90) 264 272 16 30
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-400 flex-shrink-0" size={20} />
                <a
                  href="mailto:yenigun@yenigunemlak.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  yenigun@yenigunemlak.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-400 flex-shrink-0" size={20} />
                <span className="text-gray-300">Sakarya, Türkiye</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              {navbar_items.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex md:flex-row flex-col items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 <span className="text-blue-400">Yenigün Emlak</span>. Tüm
              hakları saklıdır.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              Bu Site{" "}
              <span className="text-green-400 font-semibold">
                Eupholias Developers
              </span>
              tarafından geliştirildi.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
