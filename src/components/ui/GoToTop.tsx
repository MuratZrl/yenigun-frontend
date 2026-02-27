// src/app/components/GoToTop.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const GoToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 20);
    };

    handleScroll(); // ilk render'da kontrol
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 ${
        visible ? "flex animate-bounce" : "hidden"
      }`}
    >
      <button
        onClick={handleClick}
        className="border border-custom-pink backdrop-blur-sm hover:bg-custom-pink text-custom-orange duration-500 hover:text-white p-3 rounded-full shadow-lg"
        aria-label="Yukarı çık"
        type="button"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
};

export default GoToTop;
