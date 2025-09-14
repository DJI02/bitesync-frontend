import { useEffect } from "react";

function PageNumberBar({ pageNumber, setPageNumber, totalPages }) {
  useEffect(() => {
    setPageNumber(1); // Reset to page 1 when totalPages changes
  }, [totalPages, setPageNumber]);

  let maxVisiblePages = 5; // Maximum number of page buttons to display (beggining and end not included sometimes)]

  // Calculate start, whatever is lower:
  //  the max of 1 and pagenumber - 2 (keeping the highlighted button in the middle but display the first 5 pages)
  //  or total pages - max visible pages + 1 (to display only 5 pages at the end)
  const start = Math.min(
    Math.max(1, pageNumber - 2),
    totalPages - maxVisiblePages + 1
  );

  // Calculate end for array length
  const end = Math.min(totalPages, start + maxVisiblePages - 1);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  return (
    totalPages > 1 && (
      <div className="flex flex-row justify-center items-center gap-4 p-4">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        {start > 1 && (
          <div className="flex flex-row items-center">
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 rounded ${
                pageNumber === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              1
            </button>
            {start > 2 && <span className="pl-3 py-1">...</span>}
          </div>
        )}
        {Array.from({ length: end - start + 1 }, (_, index) => {
          const page = start + index;
          if (page > totalPages) return null; // Prevent rendering pages beyond totalPages
          if (page < 1) return null; // Prevent rendering pages less than 1
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                pageNumber === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}
        {end < totalPages && (
          <div className="flex flex-row items-center">
            {end < totalPages - 1 && <span className="pr-3 py-1">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 rounded ${
                pageNumber === totalPages
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {totalPages}
            </button>
          </div>
        )}
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    )
  );
}

export default PageNumberBar;
