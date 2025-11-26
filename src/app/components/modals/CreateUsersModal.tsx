import React, { useState } from "react";
import JSONDATA from "../../data.json";
import { Poppins } from "next/font/google";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { X, Trash2 } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const CreateUserModal = ({ open, setOpen, cookies }: any) => {
  const [newUser, setNewUser] = useState({
    image: "",
    name: "",
    lastname: "",
    gender: {
      selected: "Erkek",
      options: ["Erkek", "Kadın"],
    },
    status: {
      selected: "",
      options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
    },
    phones: [
      {
        phone: "",
        isSmS: true,
      },
    ],
    turkish_id: "",
    mernis_no: "",
    province: "Sakarya",
    district: "Serdivan",
    quarter: "Kazımpaşa Mh.",
    address: "",
    comment: "",
    owner_url: "",
    email: "",
    note: "",
    isSmS: true,
  }) as any;

  const [newPhone, setNewPhone] = useState([]) as any;
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setNewUser((prev: any) => ({ ...prev, [name]: checked }));
  };

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
      setNewUser((prev: any) => ({
        ...prev,
        phones: [
          {
            phone: formattedValue,
            isSmS: prev.phones[0]?.isSmS ?? true,
          },
        ],
      }));
    } else {
      setNewPhone((prev: any) =>
        prev.map((item: any, i: any) =>
          i === index
            ? {
                phone: formattedValue,
                isSmS: newUser.isSmS,
              }
            : item
        )
      );
    }
  };

  const cleanPhoneNumber = (formattedPhone: string) => {
    return formattedPhone.replace(/\D/g, "");
  };

  const handleClose = () => {
    setOpen(false);
    setNewPhone([]);
    setNewUser({
      image: "",
      name: "",
      lastname: "",
      gender: {
        selected: "Erkek",
        options: ["Erkek", "Kadın"],
      },
      status: {
        selected: "",
        options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
      },
      phones: [
        {
          phone: "",
          isSmS: true,
        },
      ],
      turkish_id: "",
      mernis_no: "",
      province: "Sakarya",
      district: "Serdivan",
      quarter: "Kazımpaşa Mh.",
      address: "",
      comment: "",
      owner_url: "",
      email: "",
      note: "",
      isSmS: true,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!newUser.name || !newUser.lastname) {
      toast.error("Ad ve soyad alanları zorunludur");
      return;
    }

    if (!newUser.status.selected) {
      toast.error("Müşteri türü seçilmelidir");
      return;
    }

    const allPhones = [...newUser.phones, ...newPhone].filter(
      (phone: any) => phone.phone && phone.phone !== "0" && phone.phone !== ""
    );

    if (allPhones.length === 0) {
      toast.error("En az bir geçerli telefon numarası giriniz");
      return;
    }

    setLoading(true);

    try {
      const cleanedPhones = newUser.phones.map((phone: any) => ({
        ...phone,
        phone: cleanPhoneNumber(phone.phone),
      }));

      const cleanedNewPhones = newPhone.map((phone: any) => ({
        ...phone,
        phone: cleanPhoneNumber(phone.phone),
      }));

      const allCleanedPhones = [...cleanedPhones, ...cleanedNewPhones]
        .filter(
          (phone: any) =>
            phone.phone && phone.phone !== "0" && phone.phone !== ""
        )
        .map((phone: any) => ({
          number: phone.phone.replace(/\D/g, "") || "",
          isAbleToSendSMS:
            phone.isSmS !== undefined ? phone.isSmS : newUser.isSmS,
          ownerFullName:
            `${newUser.name || ""} ${newUser.lastname || ""}`.trim() || "",
        }));

      const backendData = {
        name: newUser.name || "",
        surname: newUser.lastname || "",
        gender: newUser.gender.selected === "Erkek" ? "male" : "female",
        status: newUser.status.selected || "",
        mail: {
          mail: newUser.email || " ",
          isAbleToSendMail: true,
        },
        phones:
          allCleanedPhones.length > 0
            ? allCleanedPhones
            : [
                {
                  number: "",
                  isAbleToSendSMS: false,
                  ownerFullName: "",
                },
              ],
        tcNumber: newUser.turkish_id || " ",
        mernisNo: newUser.mernis_no || " ",
        country: "Türkiye",
        city: newUser.province || "",
        county: newUser.district || "",
        neighbourhood: newUser.quarter || "",
        fulladdress: newUser.address || " ",
        ideasAboutCustomer: newUser.note || " ",
        ownerUrl: newUser.owner_url || "",
      };

      console.log("Backend'e gönderilen veri:", backendData);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/add-customer",
        backendData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Kullanıcı başarıyla oluşturuldu.");

      if (newUser.image) {
        const formData = new FormData();
        formData.append("uid", response.data.data.uid);
        formData.append("image", newUser.image);

        await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_API + "/admin/upload-customer-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        toast.success("Kullanıcı resmi başarıyla yüklendi");
      }

      handleClose();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Kullanıcı oluşturma hatası:", error);
      toast.error(
        error.response?.data?.message ||
          "Kullanıcı oluşturulurken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold">Yeni Kullanıcı Oluştur</h2>
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
                onChange={handleChange}
                autoComplete="off"
                placeholder="Ad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="lastname"
                value={newUser.lastname}
                onChange={handleChange}
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
                checked={newUser.gender.selected === "Erkek"}
                onChange={() => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    gender: { ...prev.gender, selected: "Erkek" },
                  }));
                }}
                className="w-4 h-4"
              />
              Erkek
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUser.gender.selected === "Kadın"}
                onChange={() => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    gender: { ...prev.gender, selected: "Kadın" },
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
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              placeholder="örn: yenigünemlak@gmail.com"
              onChange={handleChange}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-medium">
              Telefon
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="örn: 0 (555) 555 55 55"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handlePhoneChange(e.target.value);
              }}
              value={newUser.phones[0]?.phone || ""}
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
                    phone: "",
                    isSmS: newUser.isSmS,
                  },
                ]);
              }}
              type="button"
            >
              + Telefon Ekle
            </button>

            {newPhone.map((phone: any, index: any) => {
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
                      onChange={(e) => {
                        handlePhoneChange(e.target.value, index);
                      }}
                      value={phone.phone}
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
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  image: e.target.files[0],
                }));
              }}
              className="border border-gray-300 rounded-md p-1 w-full sm:w-auto focus:outline-none"
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
              options={newUser.status.options.map((type: string) => ({
                value: type,
                label: type,
              }))}
              value={
                newUser.status.selected
                  ? {
                      value: newUser.status.selected,
                      label: newUser.status.selected,
                    }
                  : null
              }
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  border: "1px solid #FFB6C1",
                  boxShadow: "none",
                  "&:hover": {
                    border: "1px solid #FFB6C1",
                  },
                }),
              }}
              onChange={(e: any) => {
                setNewUser((prev: any) => ({
                  ...prev,
                  status: { ...prev.status, selected: e.value },
                }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="owner_url" className="font-medium">
              Mülk Sahibi Linki
            </label>
            <input
              type="text"
              name="owner_url"
              value={newUser.owner_url}
              placeholder="örn: https://www.yenigunemlak.com/mulk-sahibi/123"
              onChange={handleChange}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Kimlik No / Mernis No
            </label>
            <div className="flex flex-row justify-between">
              <input
                type="number"
                name="turkish_id"
                value={newUser.turkish_id}
                onChange={handleChange}
                autoComplete="off"
                pattern="[0-9]{11}"
                placeholder="TC Kimlik No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="mernis_no"
                value={newUser.mernis_no}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Mernis No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Tam Adres
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities.map((city: any) => ({
                  value: city.province,
                  label: city.province,
                }))}
                value={
                  newUser.province
                    ? { value: newUser.province, label: newUser.province }
                    : null
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                onChange={(e: any) => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    province: e.value,
                    district: "",
                    quarter: "",
                  }));
                }}
              />
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={
                  turkeyCities
                    .find((city: any) => city.province === newUser.province)
                    ?.districts.map((district: any) => ({
                      value: district.district,
                      label: district.district,
                    })) || []
                }
                value={
                  newUser.district
                    ? { value: newUser.district, label: newUser.district }
                    : null
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                noOptionsMessage={() => "İlk önce il seçiniz"}
                onChange={(e: any) => {
                  setNewUser((prev: any) => ({
                    ...prev,
                    district: e.value,
                    quarter: "",
                  }));
                }}
              />
              <Select
                className="basic-single col-span-2 sm:col-span-1"
                classNamePrefix="select"
                options={
                  turkeyCities
                    .find((city: any) => city.province === newUser.province)
                    ?.districts.find(
                      (district: any) => district.district === newUser.district
                    )
                    ?.quarters.map((quarter: any) => ({
                      value: quarter,
                      label: quarter,
                    })) || []
                }
                value={
                  newUser.quarter
                    ? { value: newUser.quarter, label: newUser.quarter }
                    : null
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: "1px solid #FFB6C1",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                noOptionsMessage={() => "İlk önce ilçe seçiniz"}
                onChange={(e: any) => {
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
              value={newUser.address}
              placeholder="örn: XXX Sokak, No: XX, Daire: XX, Kat: X"
              onChange={handleChange}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Yetkili Notu
            </label>
            <textarea
              name="note"
              value={newUser.note}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Yetkili notu giriniz..."
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
