import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Row = ({ row, formData, setFormData }: any) => {
  const handleChange = (event: any, row: any) => {
    if (event.target.checked) {
      setFormData({ ...formData, users: [...formData.users, row.uid] });
    } else {
      const filteredUsers = formData.users.filter(
        (item: any) => item !== row.uid
      );
      setFormData({ ...formData, users: filteredUsers });
    }
  };

  return (
    <tr className="hover:bg-custom-orange-dark/10 duration-300 border-b">
      <td className="p-3 border-x">
        <input
          type="checkbox"
          checked={formData.users.includes(row.uid)}
          onChange={(e) => handleChange(e, row)}
          name={row.uid.toString()}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="p-3 border-x flex items-center gap-3">
        {row.image ? (
          <img
            src={row.image}
            alt={`${row.name} ${row.surname}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
            {row.name[0]}
          </div>
        )}
        {`${row.name} ${row.surname}`}
      </td>
      <td className="p-3 border-x">{row.mail.mail}</td>
      <td className="p-3 border-x">
        {row.gender === "male" ? "Erkek" : "Kadın"}
      </td>
      <td className="p-3 border-x">{row.status}</td>
      <td className="p-3 border-x">
        {row.phones.map((phone: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <p>
              {phone.number.startsWith("0") ? phone.number : "0" + phone.number}
            </p>
            {phone.isAbleToSendSMS ? (
              <p className="text-green-500 text-xs">SMS</p>
            ) : (
              <p className="text-red-500 text-xs">SMS</p>
            )}
          </div>
        ))}
      </td>
      <td className="p-3 border-x">
        {row.city} / {row.county} / {row.neighbourhood}
      </td>
    </tr>
  );
};

const App = ({ open, setOpen, users, groups, setGroups, group }: any) => {
  const handleClose = () => {
    setOpen({
      ...open,
      open: false,
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    users: [],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name ? group.name : "",
        description: group.description ? group.description : "",
        users: group.users ? group.users : [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        users: [],
      });
    }
  }, [group]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const currentGroup = groups.find((item: any) => item.uid === group.uid);
    const filteredGroups = groups.filter((item: any) => item.uid !== group.uid);
    const updatedGroup = {
      ...currentGroup,
      name: formData.name,
      description: formData.description,
      users: formData.users,
    };
    setGroups([...filteredGroups, updatedGroup]);
    setFormData({ name: "", description: "", users: [] });
    handleClose();
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [filterAll, setFilterAll] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  if (!open) return null;

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[95vw] max-w-[500px] max-h-[95vh] overflow-y-auto flex flex-col relative p-5 gap-3 rounded-xl shadow-lg"
        style={PoppinsFont.style}
      >
        {/* Kapatma Butonu */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 bg-red-100 text-red-500 w-8 h-8 rounded-full p-1 flex items-center justify-center hover:bg-red-200 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-bold mb-2">Grubu Düzenle</h2>

        {/* Grup Adı */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium">
            Grup Adı
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="örn: Sakarya Ev Sahipleri"
            onChange={(e: any) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            value={formData.name}
            autoComplete="off"
            required
            className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-custom-orange focus:border-transparent"
          />
        </div>

        {/* Grup Açıklaması */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-medium">
            Grup Açıklaması
          </label>
          <textarea
            name="description"
            onChange={(e: any) => {
              setFormData({ ...formData, description: e.target.value });
            }}
            value={formData.description}
            required
            autoComplete="off"
            placeholder="Grup hakkında kısa bir açıklama yapınız."
            className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-custom-orange focus:border-transparent resize-vertical"
            rows={3}
          />
        </div>

        {/* Kullanıcı Listesi */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Arama Yap"
            className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-custom-orange focus:border-transparent"
            onChange={(e) => {
              setFilterAll(e.target.value);
              setFilteredUsers(
                users.filter(
                  (user: any) =>
                    user.name.includes(e.target.value) ||
                    user.surname.includes(e.target.value) ||
                    user.mail.mail.includes(e.target.value) ||
                    user.gender.includes(e.target.value) ||
                    user.status.includes(e.target.value) ||
                    user.city.includes(e.target.value) ||
                    user.county.includes(e.target.value) ||
                    user.neighbourhood.includes(e.target.value)
                )
              );
            }}
          />

          <div className="overflow-auto max-h-[300px] border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="border-b">
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Seçim
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Ad Soyad
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Email
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Cinsiyet
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Durum
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Telefon
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700 border-x bg-gray-100">
                    Adres
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((row: any) => (
                  <Row
                    key={row.uid}
                    row={row}
                    formData={formData}
                    setFormData={setFormData}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sayfa başına:</span>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="text-sm text-gray-700">
              {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} arası
              toplam {filteredUsers.length}
            </div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          className=" bg-orange-500 bg-custom-orange hover:bg-custom-orange-dark duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-offset-2 transition-colors"
        >
          Grubu Düzenle
        </button>
      </form>
    </div>
  );
};

export default App;
