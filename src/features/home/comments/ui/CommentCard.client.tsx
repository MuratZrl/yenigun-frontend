// src/features/home/comments/ui/CommentCard.client.tsx
"use client";

import React from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { CommentItem } from "../types";
import { cardVariants, quoteVariants } from "../motion/variants";
import StarsRow from "./StarsRow.client";

type Props = {
  item: CommentItem;
  index: number;
};

export default function CommentCard({ item, index }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group cursor-pointer relative h-full"
    >
      <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />

      <div className="relative p-6 z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
          >
            {item.title}
          </motion.h3>

          <motion.div
            variants={quoteVariants}
            whileHover="hover"
            className="p-2 bg-blue-100 rounded-lg text-blue-600"
          >
            <Quote className="text-lg" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          viewport={{ once: true }}
        >
          <StarsRow count={item.star} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          viewport={{ once: true }}
          className="text-gray-600 leading-relaxed mb-6 flex-grow text-sm"
        >
          &quot;{item.comment}&quot;
        </motion.p>

        <div className="w-full h-px bg-gray-200 mb-4" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <img
              src={item.author.image}
              alt={item.author.title}
              className="w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {item.author.title}
            </h4>
            <p className="text-gray-500 text-xs">{item.author.job}</p>
            <p className="text-gray-400 text-xs">{item.author.location}</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500" />
    </motion.div>
  );
}
