"use client";
import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Home,
  Info,
  Phone,
  List,
  ChevronDown,
  Menu,
  X,
  Search,
} from "lucide-react";
import api from "@/app/lib/api";
import { User as UserType } from "@/app/types/user";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navbar_items = [
    { name: "İlanlar", href: "/ads", icon: List },
    { name: "Hakkımızda", href: "/about", icon: Info },
    { name: "İletişim", href: "/contact", icon: Phone },
  ];

  const [activeHref, setActiveHref] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      if (cookies.token) {
        try {
          const response = await api.get("/user/auth");
          setUser(response.data.data.user);
        } catch (err) {
          console.log(err);
          removeCookie("token");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [cookies.token, removeCookie]);

  useEffect(() => {
    setActiveHref(window.location.pathname);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    removeCookie("token");
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/ads?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      window.location.href = `/ads?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = `/ads`;
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };

  if (loading) {
    return (
      <div
        className={`h-20 bg-gray-900 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      ></div>
    );
  }

  return (
    <>
      {!isMobile && (
        <div>
          <div className="fixed top-0 left-0 right-0 h-24 bg-gray-900 z-998"></div>
          <motion.nav
            className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
              scrolled
                ? "bg-transparent backdrop-blur-xl py-3"
                : "bg-transparent backdrop-blur-lg py-5"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center">
                    <motion.img
                      src="/logo.png"
                      alt="Yenigün Emlak"
                      className={`transition-all duration-300 ${
                        scrolled ? "w-28" : "w-32"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                  <div className="relative">
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        placeholder="İlanlarda ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-48 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pl-10 text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Ara
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
                  {navbar_items.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link key={index} href={item.href}>
                        <motion.div
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            activeHref === item.href
                              ? "bg-white/20 text-white shadow-lg border border-white/20"
                              : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                          }`}
                          whileHover={{ y: -2, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="font-semibold">{item.name}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                <div>
                  {user ? (
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <motion.button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="profile"
                            className="w-8 h-8 rounded-full border-2 border-white/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-900 to-gray-900 flex items-center justify-center text-white font-semibold shadow-lg">
                            <span className="text-sm">
                              {user.name.charAt(0)}
                              {user.surname.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-semibold">
                          {user.name} {user.surname}
                        </span>
                        <motion.div
                          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-2">
                              <Link
                                href="/admin/emlak"
                                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <User className="w-4 h-4" />
                                <span>Hesabım</span>
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Çıkış Yap</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => {
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 border border-white/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="w-4 h-4" />
                      <span>Giriş Yap</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.nav>
        </div>
      )}

      {isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 h-20 bg-gray-900 z-[998]"></div>
          <motion.nav
            className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
              scrolled
                ? "bg-transparent backdrop-blur-xl py-3"
                : "bg-transparent backdrop-blur-lg py-4"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="px-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <img src="/logo.png" alt="Yenigün Emlak" className="w-36" />
                </Link>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleSearchButtonClick}
                    className="p-2.5 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-300"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>

                  {user ? (
                    <Link href="/admin/emlak" className="flex items-center">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="profile"
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-900 to-gray-900 flex items-center justify-center text-white text-xs font-semibold">
                          <span>
                            {user.name.charAt(0)}
                            {user.surname.charAt(0)}
                          </span>
                        </div>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = "/login";
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-sm border border-white/20"
                    >
                      Giriş
                    </button>
                  )}

                  <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white/80 hover:text-white transition-colors duration-300"
                    whileTap={{ scale: 0.9 }}
                  >
                    {isOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {false && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        placeholder="İlanlarda ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-12"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />

                <motion.div
                  className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-[999] border-l border-white/20"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-lg font-semibold text-white">
                        Menü
                      </span>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-white/80 hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <form onSubmit={handleSearch} className="relative">
                        <input
                          type="text"
                          placeholder="İlanlarda ara..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-12"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded text-xs font-medium"
                        >
                          Ara
                        </button>
                      </form>
                    </div>

                    <nav className="flex-1">
                      {navbar_items.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Link key={index} href={item.href}>
                            <motion.div
                              className={`flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition-all duration-300 ${
                                activeHref === item.href
                                  ? "bg-white/20 text-white shadow-lg border border-white/20"
                                  : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                              }`}
                              whileHover={{ x: 4 }}
                              onClick={() => setIsOpen(false)}
                            >
                              <IconComponent className="w-5 h-5" />
                              <span className="font-medium">{item.name}</span>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </nav>

                    {user && (
                      <div className="border-t border-white/20 pt-6 mt-6">
                        <div className="flex items-center gap-3 mb-4 px-4">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt="profile"
                              className="w-10 h-10 rounded-full border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-gray-900 flex items-center justify-center text-white font-semibold">
                              <span className="text-sm">
                                {user.name.charAt(0)}
                                {user.surname.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">
                              {user.name} {user.surname}
                            </p>
                            <p className="text-sm text-white/60">Hesabım</p>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-colors duration-300"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Çıkış Yap</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      <div
        className={`transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}
      ></div>
    </>
  );
};

export default Navbar;
