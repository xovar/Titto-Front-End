

export default function ProductSortBar({
  totalItems,
  sortOption,
  setSortOption,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-neutral-200 rounded-xl p-3 mb-6 gap-4 shadow-sm">
      <span className="text-sm text-neutral-500">
        <span className="text-[#ea4c3b] font-bold">{totalItems}</span> Product{totalItems !== 1 && 's'} Found
      </span>
      
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        
        {/* VIEW TOGGLES */}
        {/* <div className="flex gap-2 text-neutral-400">
          <button 
            onClick={() => setViewMode('grid')}
            className={`transition-colors ${viewMode === 'grid' ? 'text-[#ea4c3b]' : 'hover:text-neutral-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`transition-colors ${viewMode === 'list' ? 'text-[#ea4c3b]' : 'hover:text-neutral-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div> */}
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500 whitespace-nowrap">Sort By :</span>
          <select 
            className="select select-bordered select-sm w-full max-w-37.5 bg-white font-normal focus:outline-none"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>Default</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}