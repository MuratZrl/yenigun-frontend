import React, { useEffect, useState } from "react";
import JSONDATA from "../../data.json";
import { Poppins } from "next/font/google";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { X, Plus, ArrowLeft, Trash2 } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const AdUserNotes = ({ data, setOpen, cookies }: any) => {
  const [customers, setCustomers] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [note, setNote] = useState("");
  const [noteList, setNoteList] = useState<any>([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [mode, setMode] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!data.isOpen) return;
    setNoteList(data.ad.userNotes);
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/customers", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setCustomers(res.data.data);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
      });
  }, [data.isOpen]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const user = customers.find((item: any) => item.uid === selectedCustomer);
    const adUid = data.ad.uid;
    axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/update-user-notes",
        {
          uid: adUid.toString(),
          userNotes: [
            ...data.ad.userNotes,
            {
              user: {
                name: user.name + " " + user.surname,
                email: user.mail.mail,
                address: user.fullAddress,
                phone: user.phones[0].number,
              },
              note: note,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast.success("Not Başarıyla eklendi.");
        setMode(0);
        setSelectedCustomer(null);
        setNote("");
        setNoteList([
          ...noteList,
          {
            user: {
              name: user.name + " " + user.surname,
              email: user.mail.mail,
              address: user.fullAddress,
              phone: user.phones[0].number,
            },
            note: note,
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Bir hata oluştu.");
      });
  };

  const handleDelete = (item: any, index: number) => () => {
    const adUid = data.ad.uid;
    const userNotes = noteList.filter((note: any, i: number) => i !== index);
    axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/update-user-notes",
        {
          uid: adUid.toString(),
          userNotes: userNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast.success("Not Başarıyla Silindi.");
        setNoteList(userNotes);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Bir hata oluştu.");
      });
  };

  return (
    <div>
      {data.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] sm:w-[500px] md:w-[750px] h-[70vh] overflow-y-auto flex flex-col relative p-5 gap-3 rounded-xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold mb-2">İlan Kullanıcı Notları</h2>
              {mode === 0 ? (
                <button
                  onClick={() => setMode(1)}
                  className="text-orange-500 flex items-center gap-1"
                >
                  <Plus size={18} />
                  Not Ekle
                </button>
              ) : (
                <button
                  onClick={() => setMode(0)}
                  className="text-orange-500 flex items-center gap-1"
                >
                  <ArrowLeft size={18} />
                  Geri Dön
                </button>
              )}
            </div>

            {mode === 1 && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-sm">Kullanıcı</label>
                  <Select
                    options={customers.map((item: any) => ({
                      value: item.uid,
                      label: `${item.name} ${item.surname} (${item.phones[0].number})`,
                    }))}
                    value={
                      selectedCustomer
                        ? {
                            value: selectedCustomer,
                            label: `${
                              customers.find(
                                (item: any) => item.uid === selectedCustomer
                              )?.name
                            } ${
                              customers.find(
                                (item: any) => item.uid === selectedCustomer
                              )?.surname
                            }
                            (
                              ${
                                customers.find(
                                  (item: any) => item.uid === selectedCustomer
                                )?.phones[0].number
                              }
                            )
                            `,
                          }
                        : null
                    }
                    onChange={(e: any) => {
                      console.log(e);
                      setSelectedCustomer(e.value);
                    }}
                    placeholder="Seçiniz"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.5rem",
                        padding: "0.25rem",
                      }),
                    }}
                  />
                </div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Not"
                  value={note}
                  rows={10.5}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Ekle
                </button>
              </form>
            )}

            {mode === 0 && (
              <div className="flex flex-col gap-3">
                {noteList.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border border-gray-300 p-2 rounded-md"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <h4 className="text-lg font-bold">
                        {item.user.name} - {item.user.email}
                      </h4>
                      <button
                        onClick={handleDelete(item, index)}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p>{item.note}</p>
                  </div>
                ))}
                {!noteList.length && <p>Not bulunmamaktadır.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdUserNotes;
