// src/features/contact/form/ContactFormSection.client.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MessageSquare, FileText } from "lucide-react";

const subjectOptions = [
  "Satılık Gayrimenkul",
  "Kiralık Gayrimenkul",
  "Değerleme Talebi",
  "Danışmanlık",
  "Diğer",
];

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // TODO: Connect to your backend API
    // For now, simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("sent");

    setTimeout(() => {
      setStatus("idle");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  }

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Header & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Bize{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 pb-1 -mb-1 inline-block decoration-clone">
                Yazın
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8">
              Sorularınız, talepleriniz veya önerileriniz için formu
              doldurun. En kısa sürede size dönüş yapacağız.
            </p>

            {/* Info items */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Telefon</p>
                  <p className="text-sm text-gray-500">0532 232 84 05</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">E-posta</p>
                  <p className="text-sm text-gray-500">
                    yenigun@yenigunemlak.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Yanıt Süresi
                  </p>
                  <p className="text-sm text-gray-500">
                    En geç 24 saat içinde dönüş yapıyoruz
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız ve soyadınız"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Email & Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    E-posta
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ornek@email.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Konu
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 appearance-none"
                  >
                    <option value="" disabled>
                      Konu seçiniz
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı buraya yazınız..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  status === "sent"
                    ? "bg-green-600 text-white"
                    : status === "sending"
                      ? "bg-blue-400 text-white cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {status === "sent" ? (
                  "Mesajınız Gönderildi ✓"
                ) : status === "sending" ? (
                  "Gönderiliyor..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gönder
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
