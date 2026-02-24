// src/app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#E9EEF7]/30 to-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#035DBA]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#03409F]/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Yenigün Emlak"
            width={160}
            height={50}
            className="object-contain"
          />
        </Link>
      </motion.div>

      {/* 404 Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mb-4"
      >
        <h1 className="text-[140px] md:text-[200px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#035DBA] to-[#03409F] select-none">
          404
        </h1>
        <div className="absolute inset-0 text-[140px] md:text-[200px] font-extrabold leading-none text-[#035DBA]/5 blur-sm select-none">
          404
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="text-center max-w-md mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          Lütfen adresi kontrol edin veya anasayfaya dönün.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#035DBA] text-white text-sm font-medium rounded-xl hover:bg-[#03409F] transition-all duration-300 shadow-lg shadow-[#035DBA]/20 hover:shadow-xl hover:shadow-[#035DBA]/30"
        >
          <Home size={16} />
          Anasayfa&apos;ya Dön
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:border-[#035DBA]/20 hover:text-[#035DBA] transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
      </motion.div>
    </div>
  );
}
