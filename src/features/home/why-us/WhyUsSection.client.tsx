// src/features/home/why-us/sections/WhyUsSection.client.tsx
"use client";

import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PoppinsFont } from "./fonts";
import { whyUsContent } from "./data/content";
import { staggerContainer, fadeUp } from "./motion/variants";
import WhyUsImageBlock from "./ui/WhyUsImageBlock.client";
import WhyUsListItem from "./ui/WhyUsListItem.client";
import StatCard from "./ui/StatCard.client";
import JoinCta from "./ui/JoinCta.client";

export default function WhyUsSection() {
  const statsRef = useRef<HTMLDivElement>(null);

  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const headingNode = useMemo(() => {
    return (
      <>
        {whyUsContent.heading}{" "}
        <span className="text-blue-600">{whyUsContent.headingHighlight}</span>
      </>
    );
  }, []);

  return (
    <section className={`min-h-screen py-10 md:py-16 relative bg-white ${PoppinsFont.className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            {headingNode}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {whyUsContent.subheading}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center justify-between mb-12 md:mb-20"
        >
          <WhyUsImageBlock
            imageSrc={whyUsContent.image.src}
            imageAlt={whyUsContent.image.alt}
            badge={whyUsContent.badge}
          />

          <motion.div variants={fadeUp} className="flex-1 max-w-lg">
            <motion.ul className="space-y-6">
              {whyUsContent.whyUsItems.map((item) => (
                <WhyUsListItem key={item.title} item={item} />
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <motion.div
          ref={statsRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {whyUsContent.stats.map((item) => (
            <StatCard key={item.title} item={item} isActive={isStatsInView} />
          ))}
        </motion.div>

        <JoinCta cta={whyUsContent.cta} />
      </div>
    </section>
  );
}
