import { Poppins } from "next/font/google";
import { ExternalLink } from "lucide-react";
import { motion, Variants } from "framer-motion";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Quality = () => {
  const data = [
    {
      title: "Satılık Konutlar",
      description:
        "Profesyonel ekibimiz ile satılık konutları size uygun şekilde sunuyoruz.",
      image: "/icons/buy.svg",
      gradient: "from-blue-600 to-indigo-700",
      button: {
        title: "Konutları Görüntüle",
        link: "/ads?action=buy",
      },
    },
    {
      title: "Hemen Evinizi Satın",
      description:
        "Beklemeye son yüksek ağımız ile konutlarınızı hemen doğru alıcıya ulaştırıyoruz.",
      image: "/icons/sell.svg",
      gradient: "from-indigo-600 to-purple-700",
      button: {
        title: "Whatsapp'tan Ulaşın",
        link: "https://wa.me/+905322328405",
      },
    },
    {
      title: "Kiralama Sistemi",
      description:
        "Geniş ağımız ile ister ev kiralayabilir ister kiraya verebilirsiniz. Size en uygun kişileri danışmanlarımız ayarlayacaktır.",
      image: "/icons/rent.svg",
      gradient: "from-purple-600 to-blue-700",
      button: {
        title: "Bilgi Al",
        link: "/about",
      },
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
    hover: {
      y: -15,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section
      className="min-h-screen py-20 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
      style={PoppinsFont.style}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <span className="text-gray-600 font-semibold tracking-widest text-sm uppercase">
              Premium Hizmet
            </span>
            <div className="w-12 h-1 bg-gradient-to-l from-blue-500 to-indigo-500 rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Üstün{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kalite
            </span>{" "}
            ve Hizmet
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Yenigün Emlak ile hayalinizdeki yaşam alanına kavuşun. Profesyonel
            danışmanlık ve güvenilir hizmet anlayışı.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-12"
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
            >
              <div className="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-xl group-hover:border-blue-200 group-hover:shadow-2xl transition-all duration-500"></div>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
              ></div>

              <div className="relative p-8 h-full flex flex-col items-center text-center z-10">
                <motion.div
                  variants={imageVariants}
                  className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg group-hover:shadow-blue-200/50 transition-shadow duration-500 border border-blue-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain"
                  />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300"
                >
                  {item.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-gray-600 leading-relaxed mb-8 grow"
                >
                  {item.description}
                </motion.p>

                <motion.a
                  href={item.button.link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-full max-w-xs"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 backdrop-blur-sm group-hover:border-blue-600 transition-all duration-300">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>
                    <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                      <span className="font-semibold text-white group-hover:text-white transition-colors duration-300">
                        {item.button.title}
                      </span>
                      <ExternalLink className="text-white text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.a>
              </div>

              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl px-8 py-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-left">
              <h4 className="text-gray-900 font-semibold text-lg mb-1">
                Size Özel Çözümler
              </h4>
              <p className="text-gray-600 text-sm">
                Özel ihtiyaçlarınız için profesyonel danışmanlık
              </p>
            </div>
            <motion.a
              href="https://wa.me/+905322328405"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Whatsapp&lsquo;tan Ulaşın
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Quality;
