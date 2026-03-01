// src/components/modals/UserFilterModals.tsx
import React, { useState } from "react";
import JSONDATA from "../../app/data.json";
import { Poppins } from "next/font/google";
import { Filter, Trash2, X } from "lucide-react";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});
import Select from "react-select";

const App = ({
  open,
  setOpen,
  filteredValues,
  setFilteredValues,
  handleFilterUsers,
  handleCleanFilters,
}: any) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterUsers();
  };

  const handleCheckboxChange = (genderValue: string) => {
    const newGender = filteredValues.gender === genderValue ? "" : genderValue;
    setFilteredValues({
      ...filteredValues,
      gender: newGender,
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
      <div className="bg-white w-[350px] md:w-[500px] max-h-[90vh] overflow-y-auto flex flex-col relative p-3 gap-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Gelişmiş Filtreleme</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              E-Posta
            </label>
            <input
              type="email"
              name="email"
              placeholder="örn: yenigünemlak@gmail.com"
              value={filteredValues.email || ""}
              onChange={(e) => {
                setFilteredValues({
                  ...filteredValues,
                  email: e.target.value,
                });
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Cinsiyet</label>
            <div className="flex flex-row justify-start gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={filteredValues.gender === "Erkek"}
                  onChange={() => handleCheckboxChange("Erkek")}
                  className="w-4 h-4"
                />
                Erkek
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={filteredValues.gender === "Kadın"}
                  onChange={() => handleCheckboxChange("Kadın")}
                  className="w-4 h-4"
                />
                Kadın
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-medium">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="örn: (+90) 5XX XXX XX XX"
              value={filteredValues.phone || ""}
              onChange={(e) => {
                setFilteredValues({
                  ...filteredValues,
                  phone: e.target.value,
                });
              }}
              autoComplete="off"
              className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-medium">
              Müşteri Türü
            </label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={
                filteredValues.status.selected
                  ? {
                      value: filteredValues.status.selected,
                      label: filteredValues.status.selected,
                    }
                  : null
              }
              options={filteredValues.status.options.map((type: string) => ({
                value: type,
                label: type,
              }))}
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
                setFilteredValues({
                  ...filteredValues,
                  status: {
                    ...filteredValues.status,
                    selected: selectedOption ? selectedOption.value : "",
                  },
                });
              }}
              isClearable={true}
              placeholder="Müşteri türü seçin..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="font-medium">
              Kimlik No / Mernis No
            </label>
            <div className="flex flex-row justify-between">
              <input
                type="text"
                name="turkish_id"
                value={filteredValues.turkish_id || ""}
                onChange={(e) =>
                  setFilteredValues({
                    ...filteredValues,
                    turkish_id: e.target.value,
                  })
                }
                autoComplete="off"
                placeholder="TC Kimlik No"
                className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100"
              />
              <input
                type="text"
                name="mernis_no"
                value={filteredValues.mernis_no || ""}
                onChange={(e) =>
                  setFilteredValues({
                    ...filteredValues,
                    mernis_no: e.target.value,
                  })
                }
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={
                  filteredValues.province
                    ? {
                        value: filteredValues.province,
                        label: filteredValues.province,
                      }
                    : null
                }
                options={turkeyCities.map((city: any) => ({
                  value: city.province,
                  label: city.province,
                }))}
                placeholder="İl"
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
                  setFilteredValues({
                    ...filteredValues,
                    province: selectedOption ? selectedOption.value : "",
                    district: "",
                    quarter: "",
                  });
                }}
                isClearable={true}
              />
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={
                  filteredValues.district
                    ? {
                        value: filteredValues.district,
                        label: filteredValues.district,
                      }
                    : null
                }
                options={
                  turkeyCities
                    .find(
                      (city: any) => city.province === filteredValues.province
                    )
                    ?.districts.map((district: any) => ({
                      value: district.district,
                      label: district.district,
                    })) || []
                }
                placeholder="İlçe"
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
                noOptionsMessage={() => "İl seçiniz"}
                isDisabled={!filteredValues.province}
                onChange={(selectedOption: any) => {
                  setFilteredValues({
                    ...filteredValues,
                    district: selectedOption ? selectedOption.value : "",
                    quarter: "",
                  });
                }}
                isClearable={true}
              />
              <Select
                className="basic-single col-span-2 md:col-span-1"
                classNamePrefix="select"
                value={
                  filteredValues.quarter
                    ? {
                        value: filteredValues.quarter,
                        label: filteredValues.quarter,
                      }
                    : null
                }
                options={
                  turkeyCities
                    .find(
                      (city: any) => city.province === filteredValues.province
                    )
                    ?.districts.find(
                      (district: any) =>
                        district.district === filteredValues.district
                    )
                    ?.quarters.map((quarter: any) => ({
                      value: quarter,
                      label: quarter,
                    })) || []
                }
                placeholder="Mahalle"
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
                isDisabled={!filteredValues.district}
                onChange={(selectedOption: any) => {
                  setFilteredValues({
                    ...filteredValues,
                    quarter: selectedOption ? selectedOption.value : "",
                  });
                }}
                isClearable={true}
              />
            </div>
          </div>

          <div className="flex flex-row gap-5 items-center">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-900 w-1/2 duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none flex items-center justify-center gap-2"
            >
              Filtrele <Filter size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                handleCleanFilters();
                setOpen(false);
              }}
              className="bg-custom-orange hover:bg-custom-orange-dark w-1/2 duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none flex items-center justify-center gap-2"
            >
              Temizle <Trash2 size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
