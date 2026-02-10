// src/features/home/representatives/ui/RepresentativeCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { RepresentativeItem } from "../types";
import { cardVariants, imageVariants } from "../motion/variants";

type Props = {
  rep: RepresentativeItem;
  index: number;
};

export default function RepresentativeCard({ rep, index }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group cursor-pointer relative"
    >
      <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-200 group-hover:border-blue-300 group-hover:shadow-2xl transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="relative overflow-hidden h-64 rounded-t-3xl bg-gray-100 flex items-center justify-center p-8">
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={rep.image}
            alt={rep.title}
            className="w-full h-full object-contain max-w-[250px] max-h-[200px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="text-center mb-6">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
            >
              {rep.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg font-medium mb-2"
            >
              {rep.type}
            </motion.p>

            <p className="text-gray-500 text-sm">{rep.phonenum}</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-3"
          >
            <Link
              href={rep.phone}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl text-base font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <Phone size={16} />
              <span>Ara</span>
            </Link>

            <Link
              href={rep.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-base font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={16} />
              <span>Mesaj</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500" />
    </motion.div>
  );
}
