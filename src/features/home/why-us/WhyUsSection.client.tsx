// src/features/home/why-us/WhyUsSection.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { whyUsContent } from "./data/content";
import { staggerContainer, fadeUp } from "./motion/variants";
import WhyUsImageBlock from "./ui/WhyUsImageBlock.client";
import WhyUsListItem from "./ui/WhyUsListItem.client";
import StatsBanner from "./ui/StatsBanner.client";
import JoinCta from "./ui/JoinCta.client";

export default function WhyUsSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {whyUsContent.heading}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">{whyUsContent.headingHighlight}</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
            {whyUsContent.subheading}
          </p>
        </motion.div>

        {/* Image + List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center mb-12 md:mb-16"
        >
          <WhyUsImageBlock
            imageSrc={whyUsContent.image.src}
            imageAlt={whyUsContent.image.alt}
            badge={whyUsContent.badge}
          />

          <motion.div variants={fadeUp} className="flex-1 w-full">
            <ul className="space-y-4">
              {whyUsContent.whyUsItems.map((item) => (
                <WhyUsListItem key={item.title} item={item} />
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Stats Banner */}
        <div className="mb-10 md:mb-14">
          <StatsBanner stats={whyUsContent.stats} />
        </div>

        {/* CTA */}
        <JoinCta cta={whyUsContent.cta} />
      </div>
    </section>
  );
}
