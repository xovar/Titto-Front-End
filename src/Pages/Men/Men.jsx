import React, { useState } from 'react';
import ProductCard from '../../Components/Shared/ProductCard'; // Adjust import path

export default function Men() {
  // 1. UPDATED DUMMY DATA
  const products = [
    { id: 1, title: "Leather Mens Slipper", category: "Shoes", sizes: ['M', 'L', 'XL'], price: 240.00, originalPrice: 300.00, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 2, title: "Quickiin Mens shoes", category: "Shoes", sizes: ['S', 'M', 'L'], price: 150.00, originalPrice: null, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 3, title: "Macbook Pro 14", category: "Computer", sizes: [], price: 290.00, originalPrice: 300.00, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 4, title: "Modern Smart Shoes", category: "Shoes", sizes: ['L', 'XL', 'XXL'], price: 180.00, originalPrice: 300.00, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 5, title: "Leather Jacket", category: "Genuine Leather", sizes: ['M', 'L'], price: 90.00, originalPrice: null, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 6, title: "Medical Mask Pack", category: "Covid-19", sizes: ['S', 'M'], price: 210.00, originalPrice: 300.00, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 7, title: "Smart Watch", category: "Electronics", sizes: [], price: 110.00, originalPrice: null, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 8, title: "Aviator Sunglasses", category: "Frame Sunglasses", sizes: ['M'], price: 260.00, originalPrice: 300.00, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
    { id: 9, title: "Hollister V-Neck knit", category: "Clothing", sizes: ['S', 'M', 'L', 'XL'], price: 140.00, originalPrice: 300.00, discount: 10, image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" },
  ];

  const categoriesList = ['All', 'Shoes', 'Computer', 'Covid-19', 'Electronics', 'Frame Sunglasses', 'Furniture', 'Genuine Leather', 'Clothing'];
  const sizesList = ['All', 'S', 'M', 'L', 'XL', 'XXL'];

  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortOption, setSortOption] = useState('Default');
  const [maxPrice, setMaxPrice] = useState(300);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  // To track if mobile filter menu is open
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // NEW STATE: To track the layout view (grid or list)
  const [viewMode, setViewMode] = useState('grid'); 

  // --- LOGIC: FILTER, SORT, THEN PAGINATE ---
  let processedProducts = products.filter(product => {
    const matchesPrice = product.price <= maxPrice;
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'All' || (product.sizes && product.sizes.includes(selectedSize));
    return matchesPrice && matchesCategory && matchesSize;
  });

  if (sortOption === 'Price: Low to High') {
    processedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Price: High to Low') {
    processedProducts.sort((a, b) => b.price - a.price);
  }

  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1; 
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setCurrentPage(1); 
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 font-sans text-neutral-800 bg-[#fafafa]">
      
      {/* MOBILE FILTER TOGGLE BUTTON */}
      <div className="lg:hidden mb-6">
        <button 
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-700 font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-neutral-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {isFilterMenuOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className={`w-full lg:w-[280px] shrink-0 space-y-6 ${isFilterMenuOpen ? 'block' : 'hidden lg:block'}`}>
          
          {/* Top Categories */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4 text-sm">Top Categories</h3>
            <ul className="space-y-3 text-sm">
              {categoriesList.map((cat) => (
                <li 
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex justify-between cursor-pointer transition-colors ${
                    selectedCategory === cat 
                      ? 'text-[#ea4c3b] font-bold' 
                      : 'text-neutral-500 hover:text-[#ea4c3b]'
                  }`}
                >
                  <span>{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4 text-sm">Price Filter: Up to ${maxPrice}</h3>
            <div className="flex justify-between text-xs text-neutral-500 mb-2">
              <span>$10</span>
              <span>$300</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={300} 
              value={maxPrice} 
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="range range-xs range-error w-full" 
            />
          </div>

          {/* Color Filter */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4 text-sm">Color</h3>
            <div className="flex flex-wrap gap-2">
              {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-gray-500', 'bg-black'].map((color, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${color} cursor-pointer border border-neutral-200 hover:scale-110 transition-transform`}></div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-4 text-sm">Size</h3>
            <ul className="space-y-3 text-sm">
              {sizesList.map((size) => (
                <li 
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`flex justify-between cursor-pointer transition-colors ${
                    selectedSize === size 
                      ? 'text-[#ea4c3b] font-bold' 
                      : 'text-neutral-500 hover:text-[#ea4c3b]'
                  }`}
                >
                  <span>{size}</span>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* RIGHT MAIN CONTENT: PRODUCTS */}
        <main className="flex-1">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-neutral-200 rounded-xl p-3 mb-6 gap-4 shadow-sm">
            <span className="text-sm text-neutral-500">
              <span className="text-[#ea4c3b] font-bold">{totalItems}</span> Product{totalItems !== 1 && 's'} Found
            </span>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* VIEW TOGGLES */}
              <div className="flex gap-2 text-neutral-400">
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
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500 whitespace-nowrap">Sort By :</span>
                <select 
                  className="select select-bordered select-sm w-full max-w-[150px] bg-transparent font-normal focus:outline-none"
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

          {/* DYNAMIC PRODUCT CONTAINER */}
          <div className={`mb-10 w-full ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}`}>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))
            ) : (
              <p className="text-neutral-500 col-span-full text-center py-10 bg-white border border-neutral-200 rounded-xl shadow-sm">
                No products match your selected filters. Try changing category, size, or increasing the price.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}

        </main>

      </div>
    </div>
  );
}