"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { teamData } from "../info";

export default function WhatsAppCTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-500 to-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 mb-4 sm:mb-6"
          >
            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2"
          >
            Hemen WhatsApp&apos;tan Yazın
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
          >
            Danışmanlarımızdan biriyle doğrudan WhatsApp üzerinden iletişime
            geçin. Sorularınızı hızlıca yanıtlayalım.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            {teamData.slice(0, 3).map((member, index) => (
              <motion.a
                key={index}
                href={member.whatsapp}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 sm:gap-3 bg-white text-green-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-0 justify-center text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">{member.title}</span>
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-green-100 text-xs sm:text-sm mt-4 sm:mt-6"
          >
            7/24 mesaj atabilirsiniz. En kısa sürede dönüş yapacağız.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
