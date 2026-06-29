

export default function FiltersSidebar({
  isFilterMenuOpen,
  categoriesList,
  selectedCategory,
  handleCategoryChange,
  maxPrice,
  setMaxPrice,
  setCurrentPage,
  colorsList,
  selectedColor,
  handleColorChange,
  sizesList,
  selectedSize,
  handleSizeChange,
}) {
  return (
    <aside className={`w-full lg:w-70 shrink-0 space-y-6 ${isFilterMenuOpen ? 'block' : 'hidden lg:block'}`}>
      
      {/* Top Categories */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4 text-sm">Top Categories</h3>
        <ul className="space-y-3 text-sm">
          {categoriesList.map((cat) => (
            <li 
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex justify-between cursor-pointer transition-colors ${
                selectedCategory === cat 
                  ? 'text-[#ea4c3b] font-bold' 
                  : 'text-neutral-500 hover:text-[#ea4c3b]'
              }`}
            >
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4 text-sm">Price Filter: Up to ${maxPrice}</h3>
        <div className="flex justify-between text-xs text-neutral-500 mb-2">
          <span>৳100</span>
          <span>৳12000</span>
        </div>
        <input 
          type="range" 
          min={100} 
          max={12000} 
          value={maxPrice} 
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="range range-xs range-error w-full" 
        />
      </div>

      {/* Dynamic Color Filter */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4 text-sm">Color</h3>
        <div className="flex flex-wrap gap-2">
          <button
          title="All"
          onClick={() => handleColorChange("All")}
              className={`w-6 h-6 rounded-full bg-linear-to-tr from-red-500 via-green-500 to-blue-500 cursor-pointer border border-neutral-200 transition-all ${
                selectedColor === "All" 
                  ? 'ring-2 ring-offset-2 ring-[#ea4c3b] scale-110' 
                  : 'hover:scale-110'
              }`}
          ></button>
          {colorsList.map((color) => (
            <button 
              key={color.id} 
              title={color.name}
              onClick={() => handleColorChange(color.name)}
              style={{ backgroundColor: color.code }}
              className={`w-6 h-6 rounded-full cursor-pointer border border-neutral-200 transition-all ${
                selectedColor === color.name 
                  ? 'ring-2 ring-offset-2 ring-[#ea4c3b] scale-110' 
                  : 'hover:scale-110'
              }`}
            ></button>
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
  );
}