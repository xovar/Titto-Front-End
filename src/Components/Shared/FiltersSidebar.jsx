import { useState } from "react";

// reusable Expandable List Component
function FilterSection({ title, children, itemsCount, initialLimit = 5 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showToggleButton = itemsCount > initialLimit;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold mb-4 text-sm">{title}</h3>
      {children(isExpanded)}
      {showToggleButton && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-3 text-xs font-semibold text-[#ea4c3b] hover:underline cursor-pointer flex items-center gap-1"
        >
          {isExpanded ? "Show Less −" : "Show More +"}
        </button>
      )}
    </div>
  );
}

export default function FiltersSidebar({
  isFilterMenuOpen,
  categoriesList = [],
  selectedCategory,
  handleCategoryChange,
  maxPrice,
  setMaxPrice,
  setCurrentPage,
  colorsList = [],
  selectedColor,
  handleColorChange,
  sizesList = [],
  selectedSize,
  handleSizeChange,
  brandsList = [],
  selectedBrand,
  handleBrandChange,
}) {
  return (
    <aside
      className={`w-full lg:w-70 shrink-0 space-y-6 ${
        isFilterMenuOpen ? "block" : "hidden lg:block"
      }`}
    >
      {/* 1. Top Categories */}
      <FilterSection title="Top Categories" itemsCount={categoriesList.length}>
        {(isExpanded) => {
          const visibleCategories = isExpanded
            ? categoriesList
            : categoriesList.slice(0, 5);

          return (
            <ul className="space-y-3 text-sm">
              <li
                onClick={() => handleCategoryChange("All")}
                className={`flex justify-between cursor-pointer transition-colors ${
                  selectedCategory === "All"
                    ? "text-[#ea4c3b] font-bold"
                    : "text-neutral-500 hover:text-[#ea4c3b]"
                }`}
              >
                <span>All</span>
              </li>
              {visibleCategories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex justify-between cursor-pointer transition-colors ${
                    selectedCategory === cat.id
                      ? "text-[#ea4c3b] font-bold"
                      : "text-neutral-500 hover:text-[#ea4c3b]"
                  }`}
                >
                  <span>{cat.name}</span>
                </li>
              ))}
            </ul>
          );
        }}
      </FilterSection>

      {/* 2. Price Filter */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4 text-sm">
          Price Filter: Up to ৳{maxPrice}
        </h3>
        <div className="flex justify-between font-['Bangla'] font-bold text-xs text-neutral-500 mb-2">
          <span className="text-[18px]">৳100</span>
          <span className="text-[18px]">৳12000</span>
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

      {/* 3. Color Filter */}
      <FilterSection title="Color" itemsCount={colorsList.length}>
        {(isExpanded) => {
          const visibleColors = isExpanded
            ? colorsList
            : colorsList.slice(0, 5);

          return (
            <div className="flex flex-wrap gap-2">
              <button
                title="All"
                onClick={() => handleColorChange("All")}
                className={`w-6 h-6 rounded-full bg-linear-to-tr from-red-500 via-green-500 to-blue-500 cursor-pointer border border-neutral-200 transition-all ${
                  selectedColor === "All"
                    ? "ring-2 ring-offset-2 ring-[#ea4c3b] scale-110"
                    : "hover:scale-110"
                }`}
              ></button>
              {visibleColors.map((color) => (
                <button
                  key={color.id}
                  title={color.name}
                  onClick={() => handleColorChange(color.name)}
                  style={{ backgroundColor: color.code }}
                  className={`w-6 h-6 rounded-full cursor-pointer border border-neutral-200 transition-all ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-[#ea4c3b] scale-110"
                      : "hover:scale-110"
                  }`}
                ></button>
              ))}
            </div>
          );
        }}
      </FilterSection>

      {/* 4. Size Filter */}
      <FilterSection title="Size" itemsCount={sizesList.length}>
        {(isExpanded) => {
          const visibleSizes = isExpanded ? sizesList : sizesList.slice(0, 5);

          return (
            <ul className="space-y-3 text-sm">
              {visibleSizes.map((size) => (
                <li
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`flex justify-between cursor-pointer transition-colors ${
                    selectedSize === size
                      ? "text-[#ea4c3b] font-bold"
                      : "text-neutral-500 hover:text-[#ea4c3b]"
                  }`}
                >
                  <span>{size}</span>
                </li>
              ))}
            </ul>
          );
        }}
      </FilterSection>

      {/* 5. Brands Filter */}
      <FilterSection title="Brands" itemsCount={brandsList.length}>
        {(isExpanded) => {
          const visibleBrands = isExpanded
            ? brandsList
            : brandsList.slice(0, 5);

          return (
            <ul className="space-y-3 text-sm">
              <li
                onClick={() => handleBrandChange("All")}
                className={`flex justify-between cursor-pointer transition-colors ${
                  selectedBrand === "All"
                    ? "text-[#ea4c3b] font-bold"
                    : "text-neutral-500 hover:text-[#ea4c3b]"
                }`}
              >
                <span>All Brands</span>
              </li>
              {visibleBrands.map((brand) => (
                <li
                  key={brand.id}
                  onClick={() => handleBrandChange(brand.id)}
                  className={`flex justify-between cursor-pointer transition-colors ${
                    selectedBrand === brand.id
                      ? "text-[#ea4c3b] font-bold"
                      : "text-neutral-500 hover:text-[#ea4c3b]"
                  }`}
                >
                  <span>{brand.name}</span>
                </li>
              ))}
            </ul>
          );
        }}
      </FilterSection>
    </aside>
  );
}