// src/features/home/why-us/WhyUsSection.client.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { whyUsContent } from "./data/content";
import { staggerContainer, fadeUp } from "./motion/variants";
import WhyUsImageBlock from "./ui/WhyUsImageBlock.client";
import WhyUsListItem from "./ui/WhyUsListItem.client";
import StatCard from "./ui/StatCard.client";
import JoinCta from "./ui/JoinCta.client";

export default function WhyUsSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <section className="py-8 md:py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
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

        {/* Stats */}
        <motion.div
          ref={statsRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 md:mb-14"
        >
          {whyUsContent.stats.map((item) => (
            <StatCard key={item.title} item={item} isActive={isStatsInView} />
          ))}
        </motion.div>

        {/* CTA */}
        <JoinCta cta={whyUsContent.cta} />
      </div>
    </section>
  );
}
