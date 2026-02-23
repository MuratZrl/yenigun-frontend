// src/features/contact/hero/ContactHeroSection.client.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, ArrowDown } from "lucide-react";

const quickInfo = [
  { icon: Phone, value: "0532 232 84 05", label: "Telefon" },
  { icon: Mail, value: "yenigun@yenigunemlak.com", label: "E-posta" },
  { icon: Clock, value: "09:00 - 19:00", label: "Çalışma Saatleri" },
];

export default function ContactHeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-black -mt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/office.jpeg"
          alt="Yenigün Emlak İletişim"
          fill
          priority
          className="object-cover scale-105 blur-sm"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-5 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/90 border border-white/25 rounded-full mb-6 backdrop-blur-sm bg-white/5"
            >
              İletişim
            </motion.span>

            {/* Main heading */}
            {["Bize", "Ulaşın"].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-white font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05]"
                style={{
                  textShadow:
                    "0 2px 10px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.3)",
                }}
              >
                {line}
              </motion.p>
            ))}

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-16 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent mt-6 mb-4"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/65 text-base md:text-lg lg:text-xl font-medium max-w-xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Hayalinizdeki evi bulmanız için buradayız
            </motion.p>

            {/* Quick info row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10"
            >
              {quickInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-sm bg-white/5 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm leading-tight">
                      {item.value}
                    </p>
                    <p className="text-white/50 text-xs font-medium">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
