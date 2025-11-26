import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { X } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SendMessage = ({ open, setOpen, users, type, allUsers }: any) => {
  const handleClose = () => {
    setOpen({
      ...open,
      open: false,
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: type,
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Form gönderme işlemleri buraya eklenecek
    console.log("Form gönderildi:", formData);
  };

  // Modal açık değilse render etme
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[90vw] max-w-[500px] max-h-[90vh] overflow-y-auto flex flex-col relative p-6 gap-4 rounded-xl shadow-lg"
        style={PoppinsFont.style}
      >
        {/* Kapatma Butonu */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 bg-red-100 text-red-500 w-8 h-8 rounded-full p-1 flex items-center justify-center hover:bg-red-200 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-bold mb-2 text-center">
          Toplu Mesaj Gönder
        </h2>

        {/* Kişi Sayısı */}
        <div className="flex flex-row gap-2 items-center">
          <label className="font-medium">Kişi Sayısı:</label>
          <p className="text-gray-700">{users.length} Kişi</p>
        </div>

        {/* Seçilen Kişiler */}
        <div className="flex flex-col gap-2">
          <span className="font-medium">Seçilen Kişiler:</span>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto p-2 border border-gray-200 rounded-md">
            {allUsers
              .filter((user: any) => users.includes(user.id))
              .map((user: any) => (
                <span
                  key={user.id}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {user.name}
                </span>
              ))}
          </div>
        </div>

        {/* Mesaj Başlığı */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Mesaj Başlığı
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Mesaj başlığını giriniz"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent"
          />
        </div>

        {/* Mesaj Tipi */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Mesaj Tipi</label>
          <div className="flex flex-row gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "whatsapp" })}
              className={`flex-1 text-center py-2 border rounded-lg transition-colors ${
                formData.type.includes("whatsapp")
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-400 text-gray-700 hover:bg-green-50"
              }`}
            >
              Whatsapp
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "sms" })}
              className={`flex-1 text-center py-2 border rounded-lg transition-colors ${
                formData.type.includes("sms")
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-400 text-gray-700 hover:bg-blue-50"
              }`}
            >
              SMS
            </button>
          </div>
        </div>

        {/* Mesaj İçeriği */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-medium">
            Mesaj
          </label>
          <textarea
            name="message"
            rows={8}
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Mesaj içeriğini giriniz"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent resize-vertical"
          ></textarea>
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="bg-orange-500 bg-custom-orange hover:bg-custom-orange-dark duration-300 py-3 text-white rounded-md mt-2 text-lg focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-offset-2 transition-colors"
        >
          Mesajı Gönder
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
