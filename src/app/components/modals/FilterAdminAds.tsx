import React, { useState, useEffect } from "react";
import axios from "axios";
import JSONDATA from "../../data.json";
import { toast } from "react-toastify";
import { Poppins } from "next/font/google";
import Select from "react-select";
import { useCookies } from "react-cookie";
import { X, Filter, Trash2 } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const FilterAdminAds = ({
  open,
  setOpen,
  filters,
  setFilters,
  handleFilter,
  handleCleanFilters,
}: any) => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [customers, setCustomers] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/customers", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setCustomers(res.data.data);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
        setTimeout(() => {
          window.location.href = "/admin/emlak";
        }, 2000);
      });
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/users", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setAdvisors(res.data.data);
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilter();
    setOpen(false);
  };

  const handleClean = (e: React.FormEvent) => {
    e.preventDefault();
    handleCleanFilters();
    setOpen(false);
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-[350px] md:w-[500px] h-[90vh] overflow-y-auto flex flex-col relative p-3 gap-3 rounded-xl"
            style={PoppinsFont.style}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-2">Gelişmiş Filtreleme</h2>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="province" className="font-medium">
                İl
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities.map((city: any) => ({
                  value: city.province,
                  label: city.province,
                }))}
                defaultInputValue={filters.province}
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
                onChange={(e: any) => {
                  setFilters({
                    ...filters,
                    province: e.value,
                  } as any);
                }}
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="district" className="font-medium">
                İlçe
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities
                  .find((city: any) => city.province === filters.province)
                  ?.districts.map((district: any) => ({
                    value: district.district,
                    label: district.district,
                  }))}
                placeholder="İlçe"
                defaultInputValue={filters.district}
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
                  setFilters({
                    ...filters,
                    district: e.value,
                  } as any);
                }}
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="quarter" className="font-medium">
                Mahalle
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={turkeyCities
                  .find((city: any) => city.province === filters.province)
                  ?.districts.find(
                    (district: any) => district.district === filters.district
                  )
                  ?.quarters.map((quarter: any) => ({
                    value: quarter,
                    label: quarter,
                  }))}
                placeholder="Mahalle"
                defaultInputValue={filters.quarter}
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
                  setFilters({
                    ...filters,
                    quarter: e.value,
                  } as any);
                }}
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="type" className="font-medium">
                İlan Türü
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={[
                  { value: "Hepsi", label: "Hepsi" },
                  { value: "Kiralık", label: "Kiralık" },
                  { value: "Devren Kiralık", label: "Devren Kiralık" },
                  { value: "Günlük Kiralık", label: "Günlük Kiralık" },
                  { value: "Satılık", label: "Satılık" },
                  { value: "Devren Satılık", label: "Devren Satılık" },
                ]}
                placeholder="İlan Türü"
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
                  setFilters({
                    ...filters,
                    type: e.value,
                  } as any);
                }}
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="minFee" className="font-medium">
                Fiyat Aralığı
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="border-2 border-gray-300 w-[100px] rounded-md p-2"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      minFee: parseInt(e.target.value),
                    } as any);
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="border-2 border-gray-300 w-[100px] rounded-md p-2"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      maxFee: parseInt(e.target.value),
                    } as any);
                  }}
                />
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="customer" className="font-medium">
                Müşteri
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={customers.map((customer: any) => ({
                  value: customer.name + "" + customer.surname,
                  label:
                    customer.name +
                    " " +
                    customer.surname +
                    " (" +
                    customer.phones[0].number +
                    ")",
                }))}
                defaultInputValue={filters.customer}
                placeholder="Müşteri"
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
                  setFilters({
                    ...filters,
                    customer: e.value,
                  } as any);
                }}
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label htmlFor="advisor" className="font-medium">
                Danışman
              </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                options={advisors.map((advisor: any) => ({
                  value: advisor.name + " " + advisor.surname,
                  label: advisor.name + " " + advisor.surname,
                }))}
                defaultInputValue={filters.advisor}
                placeholder="Danışman"
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
                  console.log(e);
                  setFilters({
                    ...filters,
                    advisor: e.value,
                  } as any);
                }}
              />
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
                onClick={handleClean}
                className="bg-custom-orange hover:bg-custom-orange-dark w-1/2 duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none flex items-center justify-center gap-2"
              >
                Temizle <Trash2 size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FilterAdminAds;
