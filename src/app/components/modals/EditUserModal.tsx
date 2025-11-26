import React, { useState } from "react";
import JSONDATA from "../../data.json";
import { Poppins } from "next/font/google";
import { X, Trash2 } from "lucide-react";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const App = ({ open, setOpen, user, cookies }: any) => {
  // Başlangıç değerlerini tanımla - undefined yerine boş string kullan
  const [newUser, setNewUser] = useState({
    uid: "",
    image: "",
    name: "",
    lastname: "",
    email: "",
    address: "",
    comment: "",
    country: "",
    district: "",
    gender: "",
    isSmS: false,
    mernis_no: "",
    owner_url: "",
    phones: [],
    province: "",
    quarters: "",
    status: "",
    turkish_id: "",
  });

  const [newPhone, setNewPhone] = useState([]) as any;
  const [firstPhone, setFirstPhone] = useState("") as any;

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    let formatted = numbers;
    if (numbers.length > 0 && !numbers.startsWith("0")) {
      formatted = "0" + numbers;
    }

    if (formatted.length > 1) {
      formatted = formatted.replace(
        /^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
        (match, p1, p2, p3, p4, p5) => {
          let result = p1;
          if (p2) result += ` (${p2}`;
          if (p3) result += `) ${p3}`;
          if (p4) result += ` ${p4}`;
          if (p5) result += ` ${p5}`;
          return result;
        }
      );
    }

    return formatted;
  };

  const handlePhoneChange = (value: string, index: number | null = null) => {
    const formattedValue = formatPhoneNumber(value);

    if (index === null) {
      setFirstPhone(formattedValue);
    } else {
      setNewPhone((prev: any) =>
        prev.map((item: any, i: any) =>
          i === index ? { ...item, number: formattedValue } : item
        )
      );
    }
  };

  const cleanPhoneNumber = (formattedPhone: string) => {
    return formattedPhone.replace(/\D/g, "");
  };

  React.useEffect(() => {
    if (user) {
      const formattedPhones = user.phones
        ? user.phones.map((phone: any) => ({
            ...phone,
            number: formatPhoneNumber(phone.number),
          }))
        : [];

      setNewUser({
        uid: user.uid || "",
        image: user.image || "",
        name: user.name || "",
        lastname: user.surname || "",
        email: user.mail?.mail || "",
        address: user.fulladdress || "",
        comment: user.ideasAboutCustomer || "",
        country: user.country || "",
        district: user.county || "",
        gender: user.gender === "male" ? "Erkek" : "Kadın",
        isSmS: user.phones?.[0]?.isAbleToSendSMS || false,
        mernis_no: user.mernisNo || "",
        owner_url: user.ownerUrl || "",
        phones: formattedPhones,
        province: user.city || "",
        quarters: user.neighbourhood || "",
        status: user.status || "",
        turkish_id: user.tcNumber || "",
      });

      setFirstPhone(
        user.phones?.[0]?.number ? formatPhoneNumber(user.phones[0].number) : ""
      );
      setNewPhone(
        user.phones
          ? user.phones.slice(1).map((phone: any) => ({
              ...phone,
              number: formatPhoneNumber(phone.number),
            }))
          : []
      );
    } else {
      // Reset to empty values
      setNewUser({
        uid: "",
        image: "",
        name: "",
        lastname: "",
        email: "",
        address: "",
        comment: "",
        owner_url: "",
        country: "",
        district: "",
        gender: "",
        isSmS: false,
        mernis_no: "",
        phones: [],
        province: "",
        quarters: "",
        status: "",
        turkish_id: "",
      });
      setNewPhone([]);
      setFirstPhone("");
    }
  }, [user]);

  const userTypes = ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"];

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setNewUser((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleClose = () => {
    setOpen(false);
    setNewPhone([]);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const cleanedFirstPhone = cleanPhoneNumber(firstPhone);
    const cleanedNewPhones = newPhone.map((phone: any) => ({
      ...phone,
      number: cleanPhoneNumber(phone.number),
    }));

    const lastPhone = [
      {
        isAbleToSendSMS: newUser.isSmS,
        number: cleanedFirstPhone,
      },
      ...cleanedNewPhones.map((phone: any) => ({
        isAbleToSendSMS: newUser.isSmS,
        number: phone.number,
      })),
    ];

    axios
      .post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/update-customer",
        {
          uid: newUser.uid,
          name: newUser.name,
          surname: newUser.lastname,
          gender: newUser.gender === "Erkek" ? "male" : "female",
          status: newUser.status,
          mail: {
            mail: newUser.email || "",
            isAbledToSendMail: true,
          },
          phones: lastPhone,
          tcNumber: newUser.turkish_id || "",
          mernisNo: newUser.mernis_no || "",
          country: "Türkiye",
          city: newUser.district,
          owner_url: newUser.owner_url,
          county: newUser.province,
          neighbourhood: newUser.quarters,
          fulladdress: newUser.address || "",
          ideasAboutCustomer: newUser.comment || "",
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Kullanıcı başarıyla güncellendi.");
        handleClose();
      })
      .catch((err) => {
        toast.error("Kullanıcı güncellenirken bir hata oluştu.");
        console.log(err);
        handleClose();
      });
  };

  const turkeyCities = JSONDATA.map((city: any) => {
    return {
      province: city.name,
      districts: city.towns.map((district: any) => {
        return {
          district: district.name,
          quarters: district.districts.reduce((acc: any, district: any) => {
            const quarterNames = district.quarters.map(
              (quarter: any) => quarter.name
            );
            return acc.concat(quarterNames);
          }, []),
        };
      }),
    };
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[350px] sm:w-[500px] max-h-[95vh] overflow-y-auto flex flex-col relative p-5 gap-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Kullanıcıyı Düzenle</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Ad Soyad
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-between">
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                autoComplete="off"
                placeholder="Ad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="lastname"
                value={newUser.lastname}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    lastname: e.target.value,
                  }));
                }}
                autoComplete="off"
                placeholder="Soyad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-row justify-start gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.gender === "Erkek"}
                onChange={() => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    gender: "Erkek",
                  }));
                }}
                className="w-4 h-4"
              />
              Erkek
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.gender === "Kadın"}
                onChange={() => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    gender: "Kadın",
                  }));
                }}
                className="w-4 h-4"
              />
              Kadın
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              E-Posta
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="örn: yenigünemlak@gmail.com"
              value={newUser.email}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-medium">
              Zorunlu Telefon
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="örn: 0 (555) 555 55 55"
              value={firstPhone}
              onChange={(e: any) => {
                e.preventDefault();
                handlePhoneChange(e.target.value);
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="bg-custom-orange hover:bg-custom-orange-dark duration-300 text-white rounded-md px-2 focus:outline-none py-2"
              onClick={(e) => {
                e.preventDefault();
                setNewPhone([
                  ...newPhone,
                  {
                    number: "",
                    isAbleToSendSMS: newUser.isSmS,
                  },
                ]);
              }}
              type="button"
            >
              + Telefon Ekle
            </button>

            {newPhone &&
              newPhone.map((phone: any, index: any) => {
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-medium">
                      Ek {index + 2}. Telefon
                    </label>
                    <div key={index} className="flex flex-row gap-2">
                      <input
                        type="text"
                        name="phone"
                        placeholder="örn: 0 (555) 555 55 55"
                        value={phone.number}
                        onChange={(e: any) => {
                          e.preventDefault();
                          handlePhoneChange(e.target.value, index);
                        }}
                        autoComplete="off"
                        className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 w-[90%]"
                      />
                      <button
                        onClick={() => {
                          setNewPhone((prev: any) =>
                            prev.filter((item: any) => item !== phone)
                          );
                        }}
                        className="bg-red-500 hover:bg-red-600 duration-300 text-white rounded-md px-2 focus:outline-none flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex flex-col items-center sm:flex-row justify-between gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.isSmS}
                onChange={handleCheckboxChange}
                name="isSmS"
                className="w-4 h-4"
              />
              SMS İzni
            </label>
            <input
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  image: e.target.value,
                }));
              }}
              value={newUser.image}
              className="border border-gray-300 rounded-md w-full sm:w-auto p-1 focus:outline-none"
              aria-label="Resim Yükle"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-medium">
              Müşteri Türü
              <span className="text-red-500">*</span>
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              options={userTypes.map((type: string) => ({
                value: type,
                label: type,
              }))}
              defaultValue={
                userTypes.find((type: string) => type === newUser.status) || {
                  value: "Mülk Sahibi",
                  label: "Mülk Sahibi",
                }
              }
              value={
                userTypes.find((type: string) => type === newUser.status) || {
                  value: "Mülk Sahibi",
                  label: "Mülk Sahibi",
                }
              }
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "1px solid #FFB6C1",
                  boxShadow: "none",
                  "&:hover": {
                    border: "1px solid #FFB6C1",
                  },
                  "&:focus > div": {
                    border: "1px solid #FFB6C1",
                  },
                }),
              }}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  status: e.value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Kimlik No / Mernis No
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-between">
              <input
                type="number"
                name="turkish_id"
                value={newUser.turkish_id}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    turkish_id: e.target.value,
                  }));
                }}
                autoComplete="off"
                pattern="[0-9]{11}"
                placeholder="TC Kimlik No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="mernis_no"
                value={newUser.mernis_no}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    mernis_no: e.target.value,
                  }));
                }}
                autoComplete="off"
                placeholder="Mernis No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Tam Adres
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities.map((city: any) => ({
                  value: city.province,
                  label: city.province,
                }))}
                value={{
                  value: newUser.province,
                  label: newUser.province,
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    province: e.value,
                  }));
                }}
              />
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities
                  .find((city: any) => city.province === newUser.province)
                  ?.districts.map((district: any) => ({
                    value: district.district,
                    label: district.district,
                  }))}
                value={{
                  value: newUser.district,
                  label: newUser.district,
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                noOptionsMessage={() => "İlk İl Seçiniz"}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    district: e.value,
                  }));
                }}
              />
              <Select
                className="basic-single col-span-2 sm:col-span-1"
                classNamePrefix="select"
                options={turkeyCities
                  .find((city: any) => city.province === newUser.province)
                  ?.districts.find(
                    (district: any) => district.district === newUser.district
                  )
                  ?.quarters.map((quarter: any) => ({
                    value: quarter,
                    label: quarter,
                  }))}
                value={{
                  value: newUser.quarters,
                  label: newUser.quarters,
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                noOptionsMessage={() => "İlk İlçe Seçiniz"}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    quarter: e.value,
                  }));
                }}
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="örn: XXX Sokak, No: XX, Daire: XX, Kat: X"
              value={newUser.address}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  address: e.target.value,
                }));
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Link
            </label>
            <input
              type="text"
              name="owner_url"
              value={newUser.owner_url}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  owner_url: e.target.value,
                }));
              }}
              autoComplete="off"
              placeholder="örn: https://www.yenigunemlak.com"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Yetkili Notu
            </label>
            <textarea
              name="note"
              value={newUser.comment}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  comment: e.target.value,
                }));
              }}
              autoComplete="off"
              placeholder="Yetkili notu giriniz..."
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 bg-custom-orange hover:bg-custom-orange-dark duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none"
          >
            Kullanıcıyı Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
