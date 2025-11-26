import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ArrowLeft, Mail, Phone, Calendar, User, Home } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/app/components/layout/AdminLayout";

interface Advisor {
  name: string;
  surname: string;
  role: "head_admin" | "advisor";
  mail: string;
  gsmNumber: string;
  birth: {
    day: number | null;
    month: number | null;
    year: number | null;
  };
  gender: "male" | "female";
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
}

interface DetailAdvisorProps {
  advisor: Advisor;
  adverts: Advert[];
  advertCount: number;
}

const DetailAdvisor = ({
  advisor,
  adverts,
  advertCount,
}: DetailAdvisorProps) => {
  const router = useRouter();

  const formatDate = (date?: {
    day: number | null;
    month: number | null;
    year: number | null;
  }) => {
    if (
      !date ||
      date.day === null ||
      date.month === null ||
      date.year === null
    ) {
      return "Belirtilmemiş";
    }

    const formatted = new Date(date.year, date.month - 1, date.day);
    if (isNaN(formatted.getTime())) {
      return "Belirtilmemiş";
    }

    return formatted.toLocaleDateString("tr-TR");
  };

  const handleAdvertClick = (advert: Advert) => {
    window.open(`/ads/${advert.uid}`, "_blank");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push("/admin/admin")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Danışman Detayları
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Sidebar - Danışman Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 bg-custom-orange rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                  {advisor.name.charAt(0)}
                  {advisor.surname.charAt(0)}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    {advisor.name} {advisor.surname}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      advisor.role === "head_admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {advisor.role === "head_admin" ? "Yönetici" : "Danışman"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() =>
                      window.open(`mailto:${advisor.mail}`, "_blank")
                    }
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
                  >
                    <Mail size={18} className="text-gray-600" />
                    <span className="text-sm">E-posta Gönder</span>
                  </button>
                  {advisor.gsmNumber && (
                    <button
                      onClick={() =>
                        window.open(`tel:${advisor.gsmNumber}`, "_blank")
                      }
                      className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
                    >
                      <Phone size={18} className="text-gray-600" />
                      <span className="text-sm">
                        {advisor.gsmNumber.startsWith("0")
                          ? advisor.gsmNumber
                          : "0" + advisor.gsmNumber}
                      </span>
                    </button>
                  )}
                </div>

                <div className="w-full border-t border-gray-200"></div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Doğum Tarihi: {formatDate(advisor.birth)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>
                      Cinsiyet: {advisor.gender === "male" ? "Erkek" : "Kadın"}
                    </span>
                  </div>
                </div>

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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Danışmana Ait İlanlar
              </h2>
              {adverts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Herhangi bir ilan bulunamadı.
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
            {advert.fee.toLocaleString()}
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

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const { uid } = context.query;
  const token = context.req.cookies.token;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/user/advisor/${uid}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.status !== 200) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        advisor: data.data.advisor,
        adverts: data.data.allAdverts,
        advertCount: data.data.allAdverts.length,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

export default DetailAdvisor;
