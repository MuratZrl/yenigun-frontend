import { Poppins } from "next/font/google";
import { toast } from "react-toastify";
import axios from "axios";
import { X } from "lucide-react";
import api from "@/app/lib/api";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const CreateAdmin = ({ open, setOpen, newUser, setNewUser, cookies }: any) => {
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

  const handleClose = () => {
    setOpen(false);
    setNewUser({
      name: "",
      surname: "",
      mail: "",
      gsmNumber: "",
      password: "",
      role: "",
      image: "",
      birthDate: "",
      link: "",
      gender: "",
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const cleanedGsmNumber = cleanPhoneNumber(newUser.gsmNumber);

    api
      .post("/admin/create-admin", {
        name: newUser.name,
        surname: newUser.surname,
        mail: newUser.mail,
        gender: newUser.gender === "Erkek" ? "male" : "female",
        gsmNumber: cleanedGsmNumber,
        password: newUser.password,
        role: newUser.role,
        link: newUser.link,
        birth: {
          day: new Date(newUser.birthDate).getDate(),
          month: new Date(newUser.birthDate).getMonth() + 1,
          year: new Date(newUser.birthDate).getFullYear(),
        },
      })
      .then((res) => {
        toast.success("Yetkili başarıyla oluşturuldu.");
        if (newUser.image === "") return;

        const formData = new FormData();
        formData.append("uid", res.data.data.uid);
        formData.append("image", newUser.image);

        api.post("/admin/upload-user-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white w-full max-w-[600px] max-h-[95vh] overflow-y-auto flex flex-col rounded-xl relative"
        style={PoppinsFont.style}
      >
        {/* Kapatma butonu */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <h2 className="text-xl font-bold mb-2">Yeni Yetkili Oluştur</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Ad Soyad
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-between gap-2">
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                autoComplete="off"
                required
                placeholder="Ad"
                className="px-3 py-2 focus:outline-none border w-full border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
              />
              <input
                type="text"
                name="surname"
                value={newUser.surname}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Soyad"
                className="px-3 py-2 focus:outline-none border w-full border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-row justify-start gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
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
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Erkek</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
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
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Kadın</span>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              E-Posta
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="mail"
              placeholder="örn: yenigünemlak@gmail.com"
              value={newUser.mail}
              onChange={handleChange}
              autoComplete="off"
              required
              className="px-3 py-2 focus:outline-none border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-medium">
              Telefon
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="gsmNumber"
              placeholder="örn: 0 (555) 555 55 55"
              onChange={(e: any) => {
                e.preventDefault();
                const formattedValue = formatPhoneNumber(e.target.value);
                setNewUser((prev: any) => ({
                  ...prev,
                  gsmNumber: formattedValue,
                }));
              }}
              value={newUser.gsmNumber}
              autoComplete="off"
              required
              className="px-3 py-2 focus:outline-none border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="link" className="font-medium">
              Link
            </label>
            <input
              type="text"
              name="link"
              value={newUser.link}
              onChange={handleChange}
              autoComplete="off"
              placeholder="örn: yenigunemlak"
              className="px-3 py-2 focus:outline-none border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium">Profil Resmi</label>
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
                className="border border-gray-300 rounded-md p-2 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                aria-label="Resim Yükle"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium">Doğum Tarihi</label>
              <input
                type="date"
                name="birthDate"
                value={newUser.birthDate}
                onChange={handleChange}
                className="px-3 py-2 focus:outline-none border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Şifre
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              autoComplete="off"
              placeholder="xxxxxxx"
              required
              className="px-3 py-2 focus:outline-none border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">
              Yetki
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row justify-start gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="head_admin"
                  checked={newUser.role === "head_admin"}
                  onChange={() => {
                    setNewUser((prev: any) => ({
                      ...prev,
                      role: "head_admin",
                    }));
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Baş Yetkili</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={newUser.role === "admin"}
                  onChange={() => {
                    setNewUser((prev: any) => ({
                      ...prev,
                      role: "admin",
                    }));
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Yetkili</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 duration-300 py-3 text-gray-800 rounded-md font-medium focus:outline-none transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 duration-300 py-3 text-white rounded-md font-medium focus:outline-none transition-colors"
            >
              Yetkili Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
