// src/features/home/comments/ui/CommentCard.client.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CommentItem } from "../types";
import { cardVariants } from "../motion/variants";
import StarsRow from "./StarsRow.client";

type Props = {
  item: CommentItem;
};

export default function CommentCard({ item }: Props) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="group bg-white rounded-xl border border-gray-200 shadow-sm
                 hover:shadow-md hover:border-indigo-200
                 transition-all duration-300 h-full overflow-hidden relative"
    >
      {/* Decorative large quote */}
      <div className="absolute top-4 right-4 text-indigo-100 group-hover:text-indigo-200 transition-colors duration-300 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.3 2.5c-1.6.9-2.8 1.9-3.7 3.1C6.7 6.8 6.2 8.2 6.2 9.8c0 .8.2 1.4.5 1.8.3.4.8.6 1.3.6.5 0 .9-.2 1.2-.5.3-.3.5-.8.5-1.3 0-.5-.2-.9-.5-1.2-.3-.3-.7-.5-1.2-.5-.1 0-.3 0-.4.1.3-.9.8-1.7 1.5-2.5.7-.8 1.5-1.4 2.2-1.8L11.3 2.5zm6.7 0c-1.6.9-2.8 1.9-3.7 3.1-.9 1.2-1.4 2.6-1.4 4.2 0 .8.2 1.4.5 1.8.3.4.8.6 1.3.6.5 0 .9-.2 1.2-.5.3-.3.5-.8.5-1.3 0-.5-.2-.9-.5-1.2-.3-.3-.7-.5-1.2-.5-.1 0-.3 0-.4.1.3-.9.8-1.7 1.5-2.5.7-.8 1.5-1.4 2.2-1.8L18 2.5z" />
        </svg>
      </div>

      <div className="p-6 h-full flex flex-col">
        {/* Author — top */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            <img
              src={item.author.image}
              alt={item.author.title}
              className="w-11 h-11 rounded-full border-2 border-indigo-100 object-cover
                         group-hover:border-indigo-300 transition-colors duration-300"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {item.author.title}
            </h4>
            <p className="text-gray-400 text-xs truncate">
              {item.author.job} &middot; {item.author.location}
            </p>
          </div>
        </div>

        {/* Stars */}
        <StarsRow count={item.star} />

        {/* Comment text */}
        <p className="text-gray-600 leading-relaxed text-sm flex-grow line-clamp-4 italic">
          &ldquo;{item.comment}&rdquo;
        </p>

        {/* Title tag — bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
