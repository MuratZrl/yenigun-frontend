import React, { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Home, Armchair, Layers, Square, Clock, X } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
import axios from "axios";
import { toast } from "react-toastify";
import api from "@/app/lib/api";

const App = ({ open, setOpen, user, cookies }: any) => {
  const [list, setList] = useState([]) as any;
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user?.uid && open) {
      const fetchUserAdverts = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/admin/customers/${user.uid}/adverts?sortBy=created&sortOrder=desc`
          );

          if (response.data.success) {
            setList(response.data.data || []);
          } else {
            toast.error("İlanlar yüklenirken bir hata oluştu");
            setList([]);
          }
        } catch (error) {
          console.error("İlan getirme hatası:", error);
          toast.error("İlanlar yüklenirken bir hata oluştu");
          setList([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUserAdverts();
    }
  }, [user?.uid, open]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[350px] sm:w-[500px] lg:w-[1000px] max-h-[95vh] overflow-y-auto flex flex-col relative p-5 gap-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-center flex-1">
            Mülk Sahibi Mülkleri
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-600 text-center">
            {user?.name} {user?.surname} - Toplam {list.length} ilan
          </div>

          <div className="grid grid-cols-1 mx-auto lg:grid-cols-2 gap-6">
            {loading && (
              <div className="col-span-2 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">İlanlar yükleniyor...</p>
              </div>
            )}

            {!loading && list.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Henüz mülk eklenmemiş.
              </div>
            )}

            {!loading &&
              list.map((ad: any, index: number) => (
                <Link
                  href={"/ads/" + ad.uid}
                  target="_blank"
                  key={ad.uid || index}
                  className="flex relative flex-col z-20 gap-3 p-4 w-full min-h-[300px] rounded-lg border duration-200 hover:shadow-md transition-shadow bg-white"
                >
                  {/* Durum Badge */}
                  <div className="text-sm font-bold absolute z-50 top-2 left-2 bg-custom-orange-dark text-white py-1 px-3 rounded">
                    {ad.steps?.second || 0} / {ad.steps?.first || 0}
                  </div>

                  {/* Resim */}
                  <div className="relative h-[150px] rounded-lg overflow-hidden">
                    {ad.photos?.filter(
                      (photo: any) => typeof photo === "string"
                    )[0] ? (
                      <img
                        src={
                          ad.photos.filter(
                            (photo: any) => typeof photo === "string"
                          )[0]
                        }
                        alt="ad"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={
                          "https://as1.ftcdn.net/v2/jpg/04/34/72/82/1000_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg"
                        }
                        alt="ad"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* İlan Detayları */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h1 className="text-lg font-bold text-custom-orange line-clamp-2">
                      {ad.title || "İsimsiz İlan"}
                    </h1>

                    <p className="text-sm text-gray-600">
                      {ad.address?.province || ""}
                      {ad.address?.district && ` / ${ad.address.district}`}
                      {ad.address?.quarter && ` / ${ad.address.quarter}`}
                    </p>

                    {/* Özellikler */}
                    <div className="flex flex-row items-center gap-4 my-1 flex-wrap">
                      {ad.steps?.third && (
                        <div className="flex flex-row items-center gap-1">
                          <Home size={13} />
                          <span className="text-xs font-semibold">
                            {ad.steps.third}
                          </span>
                        </div>
                      )}
                      {ad.details?.roomCount && (
                        <div className="flex flex-row items-center gap-1">
                          <Armchair size={13} />
                          <span className="text-xs font-semibold">
                            {ad.details.roomCount} + 1
                          </span>
                        </div>
                      )}
                      {ad.details?.floor && (
                        <div className="flex flex-row items-center gap-1">
                          <Layers size={13} />
                          <span className="text-xs font-semibold">
                            {ad.details.floor}. Kat
                          </span>
                        </div>
                      )}
                      {ad.details?.netArea && (
                        <div className="flex flex-row items-center gap-1">
                          <Square size={13} />
                          <span className="text-xs font-semibold">
                            {ad.details.netArea} m²
                          </span>
                        </div>
                      )}
                      {ad.details?.acre && (
                        <div className="flex flex-row items-center gap-1">
                          <Square size={13} />
                          <span className="text-xs font-semibold">
                            {ad.details.acre}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Fiyat ve Tarih */}
                    <div className="flex flex-row items-center justify-between mt-auto">
                      <div className="text-xl font-semibold text-black">
                        {ad.fee || "Fiyat Belirtilmemiş"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={16} />
                        <span className="font-semibold">
                          {ad.created?.createdTimestamp
                            ? new Date(
                                ad.created.createdTimestamp
                              ).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Tarih Yok"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
