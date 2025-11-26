"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Timer, ArrowRight, Home } from "lucide-react";
import api from "@/app/lib/api";
import { Notification } from "@/app/types/notification";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Popup = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchActiveNotification = async () => {
      try {
        const response = await api.get("/notification/active");
        console.log(response.data);
        if (response.data.data) {
          setNotification(response.data.data);
          setTimeout(() => setIsVisible(true), 1000);
        }
      } catch (error) {
        console.error("Error fetching active notification:", error);
      }
    };

    fetchActiveNotification();

    const isDismissed = localStorage.getItem("notificationDismissed");
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("notificationDismissed", "true");
    setTimeout(() => {
      localStorage.removeItem("notificationDismissed");
    }, 24 * 60 * 60 * 1000);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleAdClick = () => {
    router.push("/ads");
    handleClose();
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${PoppinsFont.className} fixed inset-0 z-50 flex items-center justify-center p-4`}
          onClick={handleOverlayClick}
          initial={{ backgroundColor: "rgba(0,0,0,0)" }}
          animate={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.5,
            }}
          >
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-800 transition-all duration-300 shadow-lg border border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close popup"
            >
              <Timer className="w-5 h-5" />
            </motion.button>

            <div className="h-full flex flex-col">
              {notification.backgroundImage && (
                <div className="relative h-56 w-full">
                  <Image
                    src={notification.backgroundImage}
                    alt={notification.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                </div>

                <motion.h2
                  className="text-3xl font-bold text-gray-900 text-center mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {notification.title}
                </motion.h2>

                <motion.p
                  className="text-gray-600 text-lg text-center leading-relaxed mb-8 flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {notification.message}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={handleClose}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    Daha Sonra
                  </button>
                  <button
                    onClick={handleAdClick}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-3"
                  >
                    <span>İlanları Görüntüle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
