import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { X, Plus, ArrowLeft, Trash2 } from "lucide-react";
import api from "@/app/lib/api";

const AdUserNotes = ({ data, setOpen, cookies }: any) => {
  const [customers, setCustomers] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [note, setNote] = useState("");
  const [noteList, setNoteList] = useState<any>([]);
  const [mode, setMode] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!data.isOpen) return;

    setNoteList(data.ad?.userNotes || []);

    api
      .get("/admin/customers")
      .then((res) => {
        setCustomers(res.data.data || []);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
      });
  }, [data.isOpen, data.ad?.userNotes]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const user = customers.find((item: any) => item.uid === selectedCustomer);
    const adUid = data.ad.uid;

    if (!user) {
      toast.error("Kullanıcı bulunamadı.");
      return;
    }

    const newNote = {
      user: {
        name: `${user.name || ""} ${user.surname || ""}`.trim(),
        surname: user.surname || "",
        email: user.mail?.mail || "",
        address: user.fullAddress || "",
        phone: user.phones?.[0]?.number || "",
        phones: user.phones || [],
      },
      note: note,
    };

    const updatedNotes = [...noteList, newNote];

    api
      .post("/admin/update-user-notes", {
        uid: adUid.toString(),
        userNotes: updatedNotes,
      })
      .then((res) => {
        toast.success("Not Başarıyla eklendi.");
        setMode(0);
        setSelectedCustomer(null);
        setNote("");
        setNoteList(updatedNotes);

        setTimeout(() => {}, 100);
      })
      .catch((err) => {
        toast.error(
          "Bir hata oluştu: " + (err.response?.data?.message || err.message)
        );
      });
  };

  const handleDelete = (item: any, index: number) => () => {
    const adUid = data.ad.uid;
    const userNotes = noteList.filter((note: any, i: number) => i !== index);

    api
      .post("/admin/update-user-notes", {
        uid: adUid.toString(),
        userNotes: userNotes,
      })
      .then((res) => {
        toast.success("Not Başarıyla Silindi.");
        setNoteList(userNotes);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
      });
  };

  return (
    <div>
      {data.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] sm:w-[500px] md:w-[750px] max-h-[85vh] overflow-y-auto flex flex-col relative p-5 md:p-6 rounded-xl shadow-2xl">
            {/* Header - Üst kısımda kapatma butonu */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  İlan Kullanıcı Notları
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bu ilan için kullanıcı notlarını yönetin
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Toplam Not: {noteList.length}
                </p>
              </div>

              {/* Kapatma butonu - sağ üstte */}
              <button
                onClick={handleClose}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Kapat"
              >
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Mod değiştirme butonu - header'ın altında */}
            <div className="flex justify-end mb-6">
              {mode === 0 ? (
                <button
                  onClick={() => setMode(1)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  <span className="font-medium">Yeni Not Ekle</span>
                </button>
              ) : (
                <button
                  onClick={() => setMode(0)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Notlara Geri Dön</span>
                </button>
              )}
            </div>

            {mode === 1 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanıcı Seçin
                  </label>
                  <Select
                    options={customers.map((item: any) => ({
                      value: item.uid,
                      label: `${item.name || ""} ${item.surname || ""} (${
                        item.phones?.[0]?.number || "Telefon yok"
                      }) - ${item.mail?.mail || "Email yok"}`,
                    }))}
                    value={
                      selectedCustomer
                        ? {
                            value: selectedCustomer,
                            label: `${
                              customers.find(
                                (item: any) => item.uid === selectedCustomer
                              )?.name || ""
                            } ${
                              customers.find(
                                (item: any) => item.uid === selectedCustomer
                              )?.surname || ""
                            } (${
                              customers.find(
                                (item: any) => item.uid === selectedCustomer
                              )?.phones?.[0]?.number || "Telefon yok"
                            })`,
                          }
                        : null
                    }
                    onChange={(e: any) => {
                      console.log("Selected customer:", e);
                      setSelectedCustomer(e?.value || null);
                    }}
                    placeholder="Bir kullanıcı seçin..."
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.25rem",
                        minHeight: "44px",
                        "&:hover": {
                          borderColor: "#9CA3AF",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Not İçeriği
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Notunuzu buraya yazın..."
                    value={note}
                    rows={8}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode(0)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium border border-gray-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedCustomer || !note.trim()}
                  >
                    Notu Kaydet
                  </button>
                </div>
              </form>
            )}

            {mode === 0 && (
              <div className="flex flex-col gap-4">
                {noteList.length > 0 ? (
                  noteList.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {item.user?.name || "İsimsiz"}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.user?.email && (
                              <span className="text-sm text-gray-600">
                                {item.user.email}
                              </span>
                            )}
                            {item.user?.phone && (
                              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                                {item.user.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleDelete(item, index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                          aria-label="Notu sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-100">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Henüz not bulunmuyor
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Bu ilan için henüz bir not eklenmemiş.
                    </p>
                    <button
                      onClick={() => setMode(1)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      <Plus size={18} />
                      İlk Notu Ekle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdUserNotes;
