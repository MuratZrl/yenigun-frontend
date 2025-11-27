"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Info,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/app/components/layout/AdminLayout";
import api from "@/app/lib/api";

interface Customer {
  _id: string;
  uid: number;
  name: string;
  surname: string;
  gender: "male" | "female";
  status: string;
  mail: {
    mail: string;
    isAbleToSendMail: boolean;
  };
  phones: {
    number: string;
    isAbleToCall: boolean;
    isAbleToWhatsapp: boolean;
  }[];
  tcNumber: string;
  mernisNo: string;
  country: string;
  city: string;
  county: string;
  neighbourhood: string;
  fulladdress: string;
  ideasAboutCustomer: string;
  created: {
    uid: number;
    createdTimestamp: number;
  };
}

interface AdvertAddress {
  district: string;
  province: string;
}

interface AdvertDetails {
  roomCount: string;
  netArea: number;
}

interface Advert {
  _id: string;
  uid: string;
  title: string;
  fee: string;
  active: boolean;
  details: AdvertDetails;
  address: AdvertAddress;
  photos: string[];
  customer: {
    uid: string;
  };
}

const DetailCustomer = () => {
  const router = useRouter();
  const params = useParams();
  const uid = params.uid;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          router.push("/login");
          return;
        }

        const customerResponse = await api.get(`/admin/customers/${uid}`);

        if (customerResponse.data.status !== 200) {
          setError("Müşteri bulunamadı");
          return;
        }

        const customerData = customerResponse.data.data;

        const advertsResponse = await api.get(
          `/admin/customers/${uid}/adverts?sortBy=created&sortOrder=desc`
        );

        const customerAdverts = advertsResponse.data.data || [];

        setCustomer(customerData);
        setAdverts(customerAdverts);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Veri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchData();
    }
  }, [uid, router]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAdvertClick = (advert: Advert) => {
    window.open(`/ads/${advert.uid}`, "_blank");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !customer) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg text-red-600">
              {error || "Müşteri bulunamadı"}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const primaryPhone = customer.phones?.[0]?.number || "Belirtilmemiş";
  const advertCount = adverts.length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push("/admin/users")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Müşteri Detayları
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Sidebar - Müşteri Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 bg-custom-orange rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                  {customer.name.charAt(0)}
                  {customer.surname.charAt(0)}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    {customer.name} {customer.surname}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      customer.gender === "male"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {customer.gender === "male" ? "Erkek" : "Kadın"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {customer.mail.mail && (
                    <button
                      onClick={() =>
                        window.open(`mailto:${customer.mail.mail}`, "_blank")
                      }
                      disabled={!customer.mail.isAbleToSendMail}
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      <Mail size={18} className="text-gray-600" />
                      <span className="text-sm truncate">
                        {customer.mail.mail || "E-posta Yok"}
                      </span>
                    </button>
                  )}
                  {primaryPhone && (
                    <button
                      onClick={() =>
                        window.open(`tel:${primaryPhone}`, "_blank")
                      }
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
                    >
                      <Phone size={18} className="text-gray-600" />
                      <span className="text-sm">{primaryPhone}</span>
                    </button>
                  )}
                </div>

                <div className="w-full border-t border-gray-200"></div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>Durum: {customer.status || "Belirtilmemiş"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      Kayıt Tarihi:{" "}
                      {formatDate(customer.created.createdTimestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span className="truncate">
                      {customer.neighbourhood}, {customer.county},{" "}
                      {customer.city}
                    </span>
                  </div>
                </div>

                <div className="w-full border-t border-gray-200"></div>

                {customer.ideasAboutCustomer && (
                  <div className="flex flex-col gap-2 w-full">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Müşteri Hakkında Notlar
                    </h3>
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {customer.ideasAboutCustomer}
                      </p>
                    </div>
                  </div>
                )}

                <div className="w-full border-t border-gray-200"></div>

                <div className="flex flex-col gap-3 w-full">
                  <h3 className="text-sm font-semibold text-gray-800 text-center">
                    İlan İstatistikleri
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <StatBox value={advertCount} label="Toplam İlan" />
                    <StatBox
                      value={adverts.filter((a) => a.active).length}
                      label="Aktif"
                      color="success"
                    />
                    <StatBox
                      value={adverts.filter((a) => !a.active).length}
                      label="Pasif"
                      color="error"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ İçerik - İlanlar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Müşteriye Ait İlanlar
                </h2>
                <span className="text-sm text-gray-600">
                  {advertCount} ilan bulundu
                </span>
              </div>
              {adverts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-gray-400">
                  <Info size={60} />
                  <p className="text-lg">Bu müşteriye ait ilan bulunamadı</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adverts.map((advert) => (
                    <AdvertCard
                      key={advert._id}
                      advert={advert}
                      onClick={() => handleAdvertClick(advert)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatBox = ({
  value,
  label,
  color = "primary",
}: {
  value: number;
  label: string;
  color?: "primary" | "success" | "error";
}) => {
  const colorClasses = {
    primary: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className={`text-center p-3 border rounded-lg ${colorClasses[color]}`}>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
};

const AdvertCard = ({
  advert,
  onClick,
}: {
  advert: Advert;
  onClick: () => void;
}) => {
  const defaultImage =
    "https://as1.ftcdn.net/v2/jpg/04/34/72/82/1000_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg";
  const imageUrl =
    advert.photos?.find((photo: any) => typeof photo === "string") ||
    defaultImage;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full relative ${
          !advert.active ? "opacity-70" : ""
        }`}
      >
        <div className="relative h-40">
          <img
            src={imageUrl}
            alt={advert.title}
            className="w-full h-full object-cover"
            style={{
              filter: advert.active ? "none" : "blur(1.5px)",
            }}
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
            {advert.fee.toLocaleString()} TL
          </div>
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium text-white ${
              advert.active ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {advert.active ? "Aktif" : "Pasif"}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate mb-1">
            {advert.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {advert.address.district}, {advert.address.province}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Home size={14} />
              <span>{advert.details.roomCount} Oda</span>
            </div>
            <span>{advert.details.netArea} m²</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailCustomer;
