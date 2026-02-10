import React, { useState } from "react";
import { Poppins } from "next/font/google";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import api from "@/lib/api";

const EditAdminModal = ({ open, setOpen, user, cookies }: any) => {
  const [newUser, setNewUser] = useState(user) as any;

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

  const cleanPhoneNumber = (formattedPhone: string) => {
    return formattedPhone.replace(/\D/g, "");
  };

  React.useEffect(() => {
    if (user) {
      const formattedGsmNumber = user.gsmNumber
        ? formatPhoneNumber(user.gsmNumber)
        : "";

      setNewUser({
        uid: user.uid && user.uid,
        profilePicture: user.profilePicture && user.profilePicture,
        name: user.name && user.name,
        surname: user.surname && user.surname,
        mail: user.mail && user.mail,
        birth:
          user.birth &&
          new Date(user.birth.year, user.birth.month, user.birth.day),
        role: user.role && user.role,
        password: user.password && user.password,
        gsmNumber: formattedGsmNumber,
        gender: user.gender && user.gender === "male" ? "Erkek" : "Kadın",
        link: user.link && user.link,
      });
    } else {
      setNewUser({
        uid: "",
        profilePicture: "",
        name: "",
        surname: "",
        mail: "",
        birth: "",
        role: "",
        link: "",
        password: "",
        gsmNumber: "",
      });
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const cleanedGsmNumber = cleanPhoneNumber(newUser.gsmNumber);

    api
      .post("/admin/update-admin", {
        uid: newUser.uid,
        name: newUser.name,
        surname: newUser.surname,
        mail: newUser.mail,
        birth: {
          day: newUser.birth.getDate(),
          month: newUser.birth.getMonth(),
          year: newUser.birth.getFullYear(),
        },
        role: newUser.role,
        password: newUser.password,
        gsmNumber: cleanedGsmNumber,
        link: newUser.link,
        gender: newUser.gender === "Erkek" ? "male" : "female",
      })
      .then((res) => {
        toast.success("Yetkili başarıyla güncellendi.");
        handleClose();
      })
      .catch((err) => {
        toast.error("Yetkili güncellenirken bir hata oluştu.");
        console.log(err);
        handleClose();
      });

    setNewUser({
      uid: "",
      profilePicture: "",
      name: "",
      surname: "",
      mail: "",
      birth: "",
      link: "",
      role: "",
      password: "",
      gsmNumber: "",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white w-[350px] sm:w-[500px] max-h-[95vh] overflow-y-auto flex flex-col p-5 gap-3 rounded-xl"
        style={PoppinsFont.style}
      >
        <h2 className="text-xl font-bold mb-2">Yetkiliyi Düzenle</h2>

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
                required
                placeholder="Ad"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="surname"
                value={newUser.surname}
                onChange={(e: any) => {
                  e.preventDefault();
                  setNewUser((prev: any) => ({
                    ...prev,
                    surname: e.target.value,
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
                type="radio"
                name="gender"
                value="Erkek"
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
                value="Kadın"
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
              type="email"
              name="email"
              placeholder="örn: yenigünemlak@gmail.com"
              value={newUser.mail}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  mail: e.target.value,
                }));
              }}
              autoComplete="off"
              required
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
              value={newUser.gsmNumber}
              onChange={(e: any) => {
                e.preventDefault();
                const formattedValue = formatPhoneNumber(e.target.value);
                setNewUser((prev: any) => ({
                  ...prev,
                  gsmNumber: formattedValue,
                }));
              }}
              autoComplete="off"
              required
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col items-center sm:gap-5 sm:flex-row justify-between">
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
              className="border border-gray-300 rounded-md w-[60%] sm:w-auto p-1 focus:outline-none"
              aria-label="Resim Yükle"
            />
            <input
              type="date"
              name="birth"
              value={newUser.birth}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  birth: e.target.value,
                }));
              }}
              autoComplete="off"
              required
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Yeni Şifre (isteğe bağlı)
            </label>
            <input
              type="password"
              name="password"
              placeholder="xxxxxxxx"
              value={newUser.password}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium">
              Rol
              <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "head_admin", label: "Baş Admin" },
              ]}
              value={{ value: newUser.role, label: newUser.role }}
              onChange={(e: any) => {
                setNewUser((prev: any) => ({
                  ...prev,
                  role: e.value,
                }));
              }}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="font-medium">
              Link
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="link"
              placeholder="örn: yenigünemlak.com"
              value={newUser.link}
              onChange={(e: any) => {
                e.preventDefault();
                setNewUser((prev: any) => ({
                  ...prev,
                  link: e.target.value,
                }));
              }}
              autoComplete="off"
              required
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 duration-300 py-2 text-gray-800 rounded-md text-lg focus:outline-none"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-500 bg-custom-orange hover:bg-custom-orange-dark duration-300 py-2 text-white rounded-md text-lg focus:outline-none"
            >
              Yetkiliyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
