import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showPageInfo?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showPageInfo = false,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-gray-600">
          Sayfa {currentPage} / {totalPages}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          } transition-colors duration-200`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* First Page - Show on larger screens */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border ${
                currentPage === 1
                  ? "bg-custom-orange text-white border-custom-orange"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              } transition-colors duration-200`}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-500">
                <MoreHorizontal size={16} />
              </span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border ${
              currentPage === page
                ? "bg-custom-orange text-white border-custom-orange"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
            } transition-colors duration-200 text-sm sm:text-base`}
          >
            {page}
          </button>
        ))}

        {/* Last Page - Show on larger screens */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-500">
                <MoreHorizontal size={16} />
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border ${
                currentPage === totalPages
                  ? "bg-custom-orange text-white border-custom-orange"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              } transition-colors duration-200`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          } transition-colors duration-200`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile Page Info */}
      {showPageInfo && (
        <div className="sm:hidden text-sm text-gray-600">
          {currentPage} / {totalPages}
        </div>
      )}
    </div>
  );
};

export default CustomPagination;
