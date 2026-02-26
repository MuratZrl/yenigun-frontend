// src/features/admin/contracts/ui/ContractsPage.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { Search, Filter, AlertTriangle, ChevronDown, Plus, FileText } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import { Pagination } from "@/components/Pagination";
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
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-lg text-gray-600">Yükleniyor...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30"
        style={PoppinsFont.style}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Sözleşme Yönetimi
                </h1>
                <p className="text-gray-600 mt-2 text-sm lg:text-base">
                  Toplam {c.listContracts.length} sözleşme bulunuyor
                </p>
              </div>

              {/* New contract dropdown */}
              <div className="relative">
                <button
                  className="bg-slate-900 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 font-semibold text-sm lg:text-base w-full lg:w-auto justify-center"
                  onClick={c.toggleDropdown}
                  type="button"
                >
                  <Plus size={18} />
                  Yeni Sözleşme
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${c.showContractDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {c.showContractDropdown && (
                  <ul className="absolute z-50 right-0 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <li>
                      <button
                        className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer w-full text-left transition-colors flex items-center gap-2"
                        onClick={() => c.openNewContract(0)}
                      >
                        <FileText size={14} className="text-gray-400" />
                        Kira Sözleşmesi
                      </button>
                    </li>
                    <li>
                      <button
                        className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer w-full text-left transition-colors flex items-center gap-2"
                        onClick={() => c.openNewContract(1)}
                      >
                        <FileText size={14} className="text-gray-400" />
                        Satış Sözleşmesi
                      </button>
                    </li>
                    <li>
                      <button
                        className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer w-full text-left transition-colors flex items-center gap-2"
                        onClick={() => c.openNewContract(2)}
                      >
                        <FileText size={14} className="text-gray-400" />
                        İş Sözleşmesi
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* ── Search & Filters ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tüm sözleşmelerde ara..."
                    className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm lg:text-base"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    className="bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 duration-200 px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow-md text-sm lg:text-base flex-1 sm:flex-none justify-center"
                    type="button"
                  >
                    <Filter size={16} />
                    Filtrele
                  </button>

                  {c.hasActiveFilter && (
                    <button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 duration-200 px-4 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all text-sm lg:text-base flex-1 sm:flex-none justify-center"
                      onClick={c.clearFilter}
                      type="button"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active filter warning */}
            {c.hasActiveFilter && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-2.5">
                <AlertTriangle size={16} />
                <span>
                  Aktif bir filtreleme mevcut.{" "}
                  <button
                    className="underline font-medium hover:text-amber-900 transition-colors"
                    onClick={c.clearFilter}
                  >
                    Temizle
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] overflow-hidden">
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
                        className="text-center px-4 py-12"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-black/60">Yükleniyor...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!c.loading && c.paginatedContracts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center px-4 py-12"
                      >
                        <div className="flex flex-col items-center gap-2 text-black/38">
                          <Search size={32} strokeWidth={1.5} />
                          <span className="text-sm font-medium text-black/60">Kayıt bulunamadı</span>
                          <p className="text-xs text-black/38">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                        </div>
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
            {c.listContracts.length > 0 && (
              <Pagination
                page={c.page}
                totalPages={c.totalPages}
                rowsPerPage={c.rowsPerPage}
                totalItems={c.listContracts.length}
                startIndex={c.startIndex}
                endIndex={Math.min(c.endIndex, c.listContracts.length)}
                onPageChange={c.handleChangePage}
                onRowsPerPageChange={c.handleChangeRowsPerPage}
              />
            )}
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
