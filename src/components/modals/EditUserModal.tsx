import React, { useState, useEffect } from "react";
import JSONDATA from "../../app/data.json";
import { Poppins } from "next/font/google";
import { X, Trash2 } from "lucide-react";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
import Select from "react-select";
import { toast } from "react-toastify";
import api from "@/lib/api";

const EditUserModal = ({ open, setOpen, user, cookies }: any) => {
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
  const [districts, setDistricts] = useState<any[]>([]);
  const [quarters, setQuarters] = useState<any[]>([]);

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

  const updateDistricts = (province: string) => {
    const selectedCity = turkeyCities.find(
      (city: any) => city.province === province
    );
    if (selectedCity) {
      setDistricts(selectedCity.districts || []);
    } else {
      setDistricts([]);
    }
    setQuarters([]);
  };

  const updateQuarters = (district: string) => {
    const selectedDistrict = districts.find(
      (dist: any) => dist.district === district
    );
    if (selectedDistrict) {
      setQuarters(selectedDistrict.quarters || []);
    } else {
      setQuarters([]);
    }
  };

  useEffect(() => {
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
      if (user.city) {
        updateDistricts(user.city);

        if (user.county) {
          const selectedCity = turkeyCities.find(
            (city: any) => city.province === user.city
          );
          if (selectedCity) {
            setDistricts(selectedCity.districts || []);
            const selectedDistrict = selectedCity.districts.find(
              (dist: any) => dist.district === user.county
            );
            if (selectedDistrict) {
              setQuarters(selectedDistrict.quarters || []);
            }
          }
        }
      }
    } else {
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
      setDistricts([]);
      setQuarters([]);
    }
  }, [user]);

  const userTypes = ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"];

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setNewUser((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleClose = () => {
    setOpen({ open: false, user: null });
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

    const payload = {
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
      city: newUser.province,
      owner_url: newUser.owner_url,
      county: newUser.district,
      neighbourhood: newUser.quarters,
      fulladdress: newUser.address || "",
      ideasAboutCustomer: newUser.comment || "",
    };

    console.log("Güncellenecek veri:", payload);

    api
      .post("/admin/update-customer", payload)
      .then((res) => {
        toast.success("Kullanıcı başarıyla güncellendi.");
        handleClose();
      })
      .catch((err) => {
        toast.error("Kullanıcı güncellenirken bir hata oluştu.");
        console.error("Hata detayı:", err);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (selectedOption: any) => {
    const province = selectedOption?.value || "";
    setNewUser((prev: any) => ({
      ...prev,
      province: province,
      district: "",
      quarters: "",
    }));
    updateDistricts(province);
  };

  const handleDistrictChange = (selectedOption: any) => {
    const district = selectedOption?.value || "";
    setNewUser((prev: any) => ({
      ...prev,
      district: district,
      quarters: "",
    }));
    updateQuarters(district);
  };

  const handleQuarterChange = (selectedOption: any) => {
    const quarter = selectedOption?.value || "";
    setNewUser((prev: any) => ({
      ...prev,
      quarters: quarter,
    }));
  };

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
          {/* Ad Soyad */}
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
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="Ad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="lastname"
                value={newUser.lastname}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="Soyad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Cinsiyet */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Cinsiyet</label>
            <div className="flex flex-row justify-start gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
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
                  type="radio"
                  name="gender"
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
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              E-Posta
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="örn: yenigünemlak@gmail.com"
              value={newUser.email}
              onChange={handleInputChange}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Telefonlar */}
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
                handlePhoneChange(e.target.value);
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Ek Telefonlar */}
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

            {newPhone.map((phone: any, index: any) => (
              <div key={index} className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-medium">
                  Ek {index + 2}. Telefon
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="örn: 0 (555) 555 55 55"
                    value={phone.number}
                    onChange={(e: any) => {
                      handlePhoneChange(e.target.value, index);
                    }}
                    autoComplete="off"
                    className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 w-[90%]"
                  />
                  <button
                    onClick={() => {
                      setNewPhone((prev: any) =>
                        prev.filter((_: any, i: any) => i !== index)
                      );
                    }}
                    className="bg-red-500 hover:bg-red-600 duration-300 text-white rounded-md px-2 focus:outline-none flex items-center justify-center"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SMS İzni ve Resim */}
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
                const file = e.target.files?.[0];
                if (file) {
                  setNewUser((prev: any) => ({
                    ...prev,
                    image: file,
                  }));
                }
              }}
              className="border border-gray-300 rounded-md w-full sm:w-auto p-1 focus:outline-none"
              aria-label="Resim Yükle"
            />
          </div>

          {/* Müşteri Türü */}
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
              value={
                newUser.status
                  ? { value: newUser.status, label: newUser.status }
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
                  "&:focus > div": {
                    border: "1px solid #FFB6C1",
                  },
                }),
              }}
              onChange={(selectedOption: any) => {
                setNewUser((prev: any) => ({
                  ...prev,
                  status: selectedOption?.value || "",
                }));
              }}
              placeholder="Müşteri türü seçin..."
            />
          </div>

          {/* Kimlik Bilgileri */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Kimlik No / Mernis No
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-between">
              <input
                type="text"
                name="turkish_id"
                value={newUser.turkish_id}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="TC Kimlik No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="mernis_no"
                value={newUser.mernis_no}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="Mernis No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Adres */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Tam Adres
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* İl Seçimi */}
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
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                onChange={handleProvinceChange}
                placeholder="İl"
                isClearable
              />

              {/* İlçe Seçimi */}
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={districts.map((dist: any) => ({
                  value: dist.district,
                  label: dist.district,
                }))}
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
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                onChange={handleDistrictChange}
                placeholder="İlçe"
                isDisabled={!newUser.province}
                isClearable
              />

              {/* Mahalle Seçimi */}
              <Select
                className="basic-single col-span-2 sm:col-span-1"
                classNamePrefix="select"
                options={quarters.map((quarter: string) => ({
                  value: quarter,
                  label: quarter,
                }))}
                value={
                  newUser.quarters
                    ? { value: newUser.quarters, label: newUser.quarters }
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
                    "&:focus > div": {
                      border: "1px solid #FFB6C1",
                    },
                  }),
                }}
                onChange={handleQuarterChange}
                placeholder="Mahalle"
                isDisabled={!newUser.district}
                isClearable
              />
            </div>

            {/* Detaylı Adres */}
            <input
              type="text"
              name="address"
              placeholder="örn: XXX Sokak, No: XX, Daire: XX, Kat: X"
              value={newUser.address}
              onChange={handleInputChange}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 mt-2"
            />
          </div>

          {/* Link */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Link
            </label>
            <input
              type="text"
              name="owner_url"
              value={newUser.owner_url}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="örn: https://www.yenigunemlak.com"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Not */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Yetkili Notu
            </label>
            <textarea
              name="comment"
              value={newUser.comment}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Yetkili notu giriniz..."
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
              rows={3}
            />
          </div>

          {/* Kaydet Butonu */}
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

export default EditUserModal;
