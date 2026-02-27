// components/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Pagination = ({
  page,
  totalPages,
  rowsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) => {
  const handleChangePage = (newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white">
      {/* Sayfa başına kayıt seçimi */}
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <span className="text-sm text-gray-700">Sayfa başına:</span>
        <select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white outline-none transition-colors"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Bilgi */}
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        <span className="font-medium text-blue-700">
          {startIndex + 1}-{Math.min(endIndex, totalItems)}
        </span>{" "}
        arası, toplam <span className="font-medium text-blue-700">{totalItems}</span> kayıt
      </div>

      {/* Sayfa navigasyonu */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber =
            page < 3
              ? i
              : page > totalPages - 3
                ? totalPages - 5 + i
                : page - 2 + i;
          return (
            <button
              key={i}
              onClick={() => handleChangePage(pageNumber)}
              className={`w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${
                page === pageNumber
                  ? "bg-blue-600 text-white border-transparent shadow-sm"
                  : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {pageNumber + 1}
            </button>
          );
        })}

        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Mobile Pagination Component
export const MobilePagination = ({
  page,
  totalPages,
  rowsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) => {
  return (
    <div className="flex flex-col items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-200 mt-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-700">Sayfa başına:</span>
        <select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white outline-none transition-colors"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="text-sm text-gray-700 mb-4 text-center">
        <span className="font-medium text-blue-700">
          {startIndex + 1}-{Math.min(endIndex, totalItems)}
        </span>{" "}
        arası, toplam <span className="font-medium text-blue-700">{totalItems}</span> kayıt
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm text-gray-700 px-3">
          Sayfa <span className="font-medium text-blue-700">{page + 1}</span> / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
