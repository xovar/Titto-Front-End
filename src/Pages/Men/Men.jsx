import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../../Components/Shared/ProductCard'; 

import FiltersSidebar from '../../Components/Shared/FiltersSidebar';
import ProductSortBar from '../../Components/Shared/ProductSortBar';
import Pagination from '../../Components/Shared/Pagination';

export default function Men() {
  const { items: products, categories, colors } = useSelector((state) => state.products);
  console.log(products, categories, colors);
  const categoriesList = categories;
  const sizesList = ['All', '39', '40', '41', '42', '43', '44', '45'];
  
  const colorsList = colors;

  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortOption, setSortOption] = useState('Default');
  
  // আপনার প্রোডাক্টের দাম যেহেতু ১২০০, তাই সর্বোচ্চ রেঞ্জ ২০০০ বা তার বেশি রাখা হলো
  const [maxPrice, setMaxPrice] = useState(12000); 
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); 

  // --- LOGIC: FILTER (স্ট্রিং প্রাইস এবং কালার অবজেক্ট হ্যান্ডেল করার জন্য সংশোধিত) ---
  let processedProducts = products.filter(product => {
    
    // ১. প্রাইস চেক (স্ট্রিং থেকে নাম্বারে কনভার্ট করা হয়েছে)
    const numericPrice = Number(product.price) || 0;
    const matchesPrice = numericPrice <= maxPrice;
    
    // ২. ক্যাটাগরি অবজেক্ট চেক
    const matchesCategory = selectedCategory === 'All' || 
      (product.category && product.category.name === selectedCategory);
    
    // ৩. ভেরিয়েন্টস -> সাইজেস -> সাইজ টেক্সট চেক
    const matchesSize = selectedSize === 'All' || 
      (product.variants && product.variants.some(variant => 
        variant.sizes && variant.sizes.some(s => s.size === selectedSize)
      ));
    
    // ৪. ভেরিয়েন্টস -> কালার অবজেক্টের name চেক
    const matchesColor = selectedColor === 'All' || 
      (product.variants && product.variants.some(variant => 
        variant.color && variant.color.name === selectedColor
      ));
    
    return matchesPrice && matchesCategory && matchesSize && matchesColor;
  });

  // Sort Logic (নাম্বার কনভার্ট করে সর্টিং করা হচ্ছে)
  if (sortOption === 'Price: Low to High') {
    processedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOption === 'Price: High to Low') {
    processedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  // Pagination Logic
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
    console.log(size);
  };

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-360 mx-auto px-4 md:px-8 py-10 font-sans text-neutral-800 bg-[#fafafa]">
      
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
        
        {/* SIDEBAR FILTERS COMPONENT */}
        <FiltersSidebar 
          isFilterMenuOpen={isFilterMenuOpen}
          categoriesList={categoriesList}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          setCurrentPage={setCurrentPage}
          colorsList={colorsList}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
          sizesList={sizesList}
          selectedSize={selectedSize}
          handleSizeChange={handleSizeChange}
        />

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1">
          
          {/* PRODUCT SORT BAR COMPONENT */}
          <ProductSortBar 
            totalItems={totalItems}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOption={sortOption}
            setSortOption={setSortOption}
            setCurrentPage={setCurrentPage}
          />

          {/* DYNAMIC PRODUCT CONTAINER */}
          <div className={`mb-10 w-full ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}`}>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))
            ) : (
              <p className="text-neutral-500 col-span-full text-center py-10 bg-white border border-neutral-200 rounded-xl shadow-sm">
                No products match your selected filters. Try changing category, size, color, or increasing the price.
              </p>
            )}
          </div>

          {/* PAGINATION COMPONENT */}
          <Pagination 
            totalPages={totalPages}
            safeCurrentPage={safeCurrentPage}
            handlePageChange={handlePageChange}
          />

        </main>
      </div>
    </div>
  );
}