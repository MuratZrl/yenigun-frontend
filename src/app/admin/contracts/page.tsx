"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import {
  Search,
  AlertTriangle,
  FileText,
  Eye,
  Trash2,
  Download,
  ChevronDown,
} from "lucide-react";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Rent_Contract from "@/app/components/modals/RentContrant";
import AdminLayout from "@/app/components/layout/AdminLayout";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";

// Custom Table Components
const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 sticky top-0">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>;

const TableCell = ({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <td
    className={`px-4 py-3 border-x border-gray-200 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </td>
);

const TableHeaderCell = ({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <th
    className={`px-4 py-3 font-semibold text-gray-700 text-left border-x border-gray-200 bg-gray-50 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </th>
);

const Row = ({ row, contracts, setContracts, cookies }: any) => {
  const handleDelete = (uid: any) => {
    toast.error("Kullanıcı silme işlemi şu an için devre dışıdır.");
  };

  const handleDownloadPDF = (url: any) => {
    window.open(url, "_blank");
  };

  const handleReviewPDF = (uid: any) => {
    toast.error("PDF incelemesi şu an için devre dışıdır.");
  };

  return (
    <TableRow className="hover:bg-custom-orange-dark/10 duration-300">
      <TableCell>
        <div className="flex items-center gap-3">{row.landlord}</div>
      </TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.tenant}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>{formatPhoneNumber(row.phone)}</TableCell>
      <TableCell>{row.address}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <button
            onClick={() => handleDownloadPDF(row.url)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="PDF İndir"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => handleReviewPDF(row.uid)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Önizleme"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.uid)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const Contracts = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [contracts, setContracts] = useState([]) as any;
  const [listContracts, setListContracts] = useState(contracts) as any[];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Authentication kontrolü
  useEffect(() => {
    const verifyAuth = async () => {
      const authValid = await checkAuth();
      if (!authValid) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      setLoading(false);
    };

    verifyAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Fake data - gerçek uygulamada API'den çekilecek
    const tableFakeData = [
      {
        tenant: "Mehmet Demir",
        email: "mehmetdemir@yenigun.com",
        address: "Ankara, Turkey 06500",
        landlord: "Ahmet Yilmaz",
        status: "Aktif Sözleşme",
        phone: "5555555555",
        url: "https://www.atonet.org.tr/Uploads/Birimler/Internet/Duyurular/ATO%20DUYURULARI/2023-10-10-62%20No'lu/kira_sozlesmesi_ornegi.pdf",
        date: "01/01/2024",
      },
    ];
    setContracts(tableFakeData);
    setListContracts(tableFakeData);
  }, [isAuthenticated]);

  const [newContract, setNewContract] = useState({
    open: false,
    id: 0,
  });

  const [showContractDropdown, setShowContractDropdown] = useState(false);

  // Sayfalama hesaplamaları
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedContracts = listContracts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(listContracts.length / rowsPerPage);

  if (!isAuthenticated || loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen gap-5 flex flex-col"
        style={PoppinsFont.style}
      >
        <div className="p-5 gap-5 flex flex-col">
          <div className="flex flex-row items-center justify-center">
            <h1 className="text-2xl font-bold">Sözleşmeler</h1>
          </div>

          <div className="w-full overflow-hidden shadow-sm border border-gray-200 rounded-lg">
            <div className="flex flex-col gap-2 p-4 bg-white">
              <div className="flex flex-col xs:flex-row items-center justify-between my-2">
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Tüm Sözleşmelerde Ara..."
                    className="p-2 border border-gray-300 rounded-md w-[200px] md:w-[300px]"
                  />
                  <div className="flex flex-row gap-4 items-center">
                    <button className="bg-gray-700 text-white hover:bg-gray-900 duration-200 p-2 rounded-md flex flex-row gap-2 items-center">
                      <Search size={20} /> Filtrele
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <button
                    className="bg-custom-orange text-white group px-4 py-2 rounded-md flex items-center gap-2 hover:bg-custom-orange-dark transition-colors"
                    onClick={() =>
                      setShowContractDropdown(!showContractDropdown)
                    }
                  >
                    Yeni Sözleşme
                    <ChevronDown size={16} />
                  </button>

                  {showContractDropdown && (
                    <ul className="absolute z-50 w-[146px] text-sm text-nowrap left-1/2 -translate-x-1/2 py-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => {
                            setNewContract({ open: true, id: 0 });
                            setShowContractDropdown(false);
                          }}
                        >
                          Kira Sözleşmesi
                        </button>
                      </li>
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => {
                            setNewContract({ open: true, id: 1 });
                            setShowContractDropdown(false);
                          }}
                        >
                          Satış Sözleşmesi
                        </button>
                      </li>
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => {
                            setNewContract({ open: true, id: 2 });
                            setShowContractDropdown(false);
                          }}
                        >
                          İş Sözleşmesi
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {listContracts.length < contracts.length && (
                <p className="flex flex-row gap-2 items-center text-sm text-gray-600">
                  <AlertTriangle size={20} className="text-yellow-600" />
                  Aktif bir filtreleme mevcut temizlemek için{" "}
                  <button
                    className="underline text-custom-orange-dark hover:text-custom-orange"
                    onClick={() => {
                      setListContracts(contracts);
                    }}
                  >
                    basınız
                  </button>
                  .
                </p>
              )}
            </div>

            {/* Table Container */}
            <div className="overflow-auto max-h-[62vh]">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Ev Sahibi</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Kiracı</TableHeaderCell>
                    <TableHeaderCell>Durum</TableHeaderCell>
                    <TableHeaderCell>Telefon</TableHeaderCell>
                    <TableHeaderCell>Adres</TableHeaderCell>
                    <TableHeaderCell>İşlemler</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center px-4 py-8 text-gray-500"
                      >
                        Yükleniyor...
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && paginatedContracts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center px-4 py-8 text-gray-500"
                      >
                        Kayıt bulunamadı
                      </TableCell>
                    </TableRow>
                  )}

                  {paginatedContracts.map((row: any, index: number) => (
                    <Row
                      key={index}
                      row={row}
                      contracts={listContracts}
                      setContracts={setListContracts}
                      cookies={cookies}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
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

              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                {startIndex + 1}-{Math.min(endIndex, listContracts.length)}{" "}
                arası toplam {listContracts.length}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Önceki
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleChangePage(i)}
                    className={`px-3 py-1 border border-gray-300 rounded ${
                      page === i
                        ? "bg-custom-orange text-white border-custom-orange"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </div>

        <Rent_Contract
          open={newContract.open && newContract.id === 0}
          setOpen={setNewContract}
        />
      </div>
    </AdminLayout>
  );
};

export default Contracts;
