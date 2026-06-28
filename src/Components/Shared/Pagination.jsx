

export default function Pagination({ totalPages, safeCurrentPage, handlePageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <div className="join shadow-sm rounded-lg overflow-hidden">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`join-item btn btn-sm bg-white border transition-colors ${
              safeCurrentPage === page 
                ? 'border-[#ea4c3b] text-[#ea4c3b] hover:bg-[#ea4c3b] hover:text-white' 
                : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}