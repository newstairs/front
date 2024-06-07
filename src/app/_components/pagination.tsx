import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination:React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="flex items-center -space-x-px h-10 text-base">
        <li>
          <button
            className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Previous</span>
            <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index + 1}>
            <button
              className={`flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === index + 1 ? 'z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : ''
              }`}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Next</span>
            <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
