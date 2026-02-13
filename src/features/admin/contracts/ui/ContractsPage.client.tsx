// src/features/admin/contracts/ui/ContractsPage.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { Search, AlertTriangle, ChevronDown } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import Rent_Contract from "@/components/modals/RentContrant";

import { useContractsController } from "../hooks/useContractsController";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "./components/ContractTable";
import ContractRow from "./components/ContractRow";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function ContractsPage() {
  const c = useContractsController();

  if (!c.isAuthenticated || c.loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
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
          {/* Header */}
          <div className="flex flex-row items-center justify-center">
            <h1 className="text-2xl font-bold">Sözleşmeler</h1>
          </div>

          <div className="w-full overflow-hidden shadow-sm border border-gray-200 rounded-lg">
            {/* Toolbar */}
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

                {/* New contract dropdown */}
                <div className="relative">
                  <button
                    className="bg-custom-orange text-white group px-4 py-2 rounded-md flex items-center gap-2 hover:bg-custom-orange-dark transition-colors"
                    onClick={c.toggleDropdown}
                  >
                    Yeni Sözleşme
                    <ChevronDown size={16} />
                  </button>

                  {c.showContractDropdown && (
                    <ul className="absolute z-50 w-[146px] text-sm text-nowrap left-1/2 -translate-x-1/2 py-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => c.openNewContract(0)}
                        >
                          Kira Sözleşmesi
                        </button>
                      </li>
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => c.openNewContract(1)}
                        >
                          Satış Sözleşmesi
                        </button>
                      </li>
                      <li>
                        <button
                          className="px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer w-full text-left"
                          onClick={() => c.openNewContract(2)}
                        >
                          İş Sözleşmesi
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Active filter warning */}
              {c.hasActiveFilter && (
                <p className="flex flex-row gap-2 items-center text-sm text-gray-600">
                  <AlertTriangle size={20} className="text-yellow-600" />
                  Aktif bir filtreleme mevcut temizlemek için{" "}
                  <button
                    className="underline text-custom-orange-dark hover:text-custom-orange"
                    onClick={c.clearFilter}
                  >
                    basınız
                  </button>
                  .
                </p>
              )}
            </div>

            {/* Table */}
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
                  {c.loading && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center px-4 py-8 text-gray-500"
                      >
                        Yükleniyor...
                      </TableCell>
                    </TableRow>
                  )}

                  {!c.loading && c.paginatedContracts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center px-4 py-8 text-gray-500"
                      >
                        Kayıt bulunamadı
                      </TableCell>
                    </TableRow>
                  )}

                  {c.paginatedContracts.map((row, index) => (
                    <ContractRow
                      key={index}
                      row={row}
                      onDelete={c.handleDelete}
                      onDownload={c.handleDownloadPDF}
                      onReview={c.handleReviewPDF}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <span className="text-sm text-gray-700">Sayfa başına:</span>
                <select
                  value={c.rowsPerPage}
                  onChange={c.handleChangeRowsPerPage}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                {c.startIndex + 1}-
                {Math.min(c.endIndex, c.listContracts.length)} arası toplam{" "}
                {c.listContracts.length}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => c.handleChangePage(c.page - 1)}
                  disabled={c.page === 0}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Önceki
                </button>
                {Array.from({ length: c.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => c.handleChangePage(i)}
                    className={`px-3 py-1 border border-gray-300 rounded ${
                      c.page === i
                        ? "bg-custom-orange text-white border-custom-orange"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => c.handleChangePage(c.page + 1)}
                  disabled={c.page >= c.totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rent Contract Modal */}
        <Rent_Contract
          open={c.newContract.open && c.newContract.id === 0}
          setOpen={c.setNewContract}
        />
      </div>
    </AdminLayout>
  );
}