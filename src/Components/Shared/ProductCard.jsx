import { useState } from "react";
import { FiHeart, FiShoppingCart, FiX, FiChevronDown } from "react-icons/fi";

export default function ProductCard({ product, viewMode = 'grid' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState("Black");

  // Handlers for quantity picker
  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const isList = viewMode === 'list';

  return (
    <>
      {/* --- PRODUCT CARD VIEW --- */}
      <div className={`animate-border-red relative border border-neutral-200 rounded-2xl p-4 bg-white hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex ${
        isList ? 'flex-row items-center gap-6 w-full' : 'flex-col h-full'
      }`}>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-[#ea4c3b] text-white text-[10px] font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Heart / Favorite Button */}
          <button
            type="button"
            className="w-8 h-8 cursor-pointer bg-white border border-neutral-200 rounded shadow-sm flex items-center justify-center text-neutral-600 hover:text-[#ea4c3b] hover:border-[#ea4c3b] hover:bg-red-50 transition-colors"
            aria-label="Add to favorites"
            onClick={(e) => {
              e.stopPropagation();
              // Handle wishlist logic here
            }}
          >
            <FiHeart className="w-4 h-4" />
          </button>

          {/* Open Quick View / Add to Cart Modal Button */}
          <button
            type="button"
            className="w-8 h-8 cursor-pointer bg-white border border-neutral-200 rounded shadow-sm flex items-center justify-center text-neutral-600 hover:text-[#ea4c3b] hover:border-[#ea4c3b] hover:bg-red-50 transition-colors"
            aria-label="Open product quick view"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image Click Trigger */}
        <div 
          className={`${isList ? 'w-48 h-48 shrink-0' : 'w-full h-48 mb-6'} flex items-center justify-center overflow-hidden`}
        >
          <img
            src={product.image || "https://via.placeholder.com/200x200?text=Shoe"}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Details */}
        <div 
          className={`flex flex-col items-start text-left w-full ${isList ? 'flex-1' : 'mt-auto'}`}
        >
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            {product.category}
          </span>
          <h3 className="text-sm font-bold text-neutral-800 mb-2 line-clamp-1">
            {product.title}
          </h3>
          {/* Card Items Colors */}
          <div className="bg-white flex gap-4">
            <h3 className="font-bold mb-4 text-sm">Color: </h3>
            <div className="flex flex-wrap gap-2">
              {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'].map((color, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${color} cursor-pointer border border-neutral-200 hover:scale-110 transition-transform`}></div>
              ))}
            </div>
          </div>
          {/* item sizes */}
          <div className="bg-white flex gap-4">
            <h3 className="font-bold mb-4 text-sm">Color: </h3>
            <div className="flex flex-wrap gap-2">
              {['40', '41', '42', '43', '44'].map((size, i) => (
                <div key={i} className=''>{size}</div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {product.originalPrice && (
              <span className="text-neutral-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[#ea4c3b] font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* --- QUICK VIEW / ADD TO CART MODAL OVERLAY --- */}
      {isModalOpen && (
        <div 
          className=" fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Container */}
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-10 relative shadow-2xl flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 hover:scale-105 transition-all z-10"
              aria-label="Close modal"
            >
              <FiX className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Left Column: Product Image */}
            <div className="flex-1 bg-white rounded-2xl flex items-center justify-center p-4 min-h-65 md:min-h-95">
              <img
                src={product.image || "https://via.placeholder.com/400x400?text=Product"}
                alt={product.title}
                className="w-full h-full max-h-87.5 object-contain"
              />
            </div>

            {/* Right Column: Information & Actions */}
            <div className="flex-1 flex flex-col justify-center text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">
                {product.title}
              </h2>
              
              {/* Pricing Grid Layout */}
              <div className="flex items-center gap-3 text-lg md:text-xl font-bold mb-4">
                {product.originalPrice && (
                  <span className="text-neutral-400 line-through font-normal">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[#ea4c3b]">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Static Context Paragraph */}
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-6 font-normal max-w-md">
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia.
              </p>

              {/* Configurations Fields */}
              <div className="space-y-4 mb-6">
                {/* Size Choice Field */}
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                    Size:
                  </label>
                  <div className="relative max-w-md">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg p-3 pr-10 text-xs md:text-sm bg-transparent text-neutral-700 focus:outline-none appearance-none font-medium cursor-pointer"
                    >
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((size) => (
                          <option key={size} value={size}>{size.toUpperCase()}</option>
                        ))
                      ) : (
                        <>
                          <option value="s">S</option>
                          <option value="m">M</option>
                          <option value="l">L</option>
                          <option value="xl">XL</option>
                        </>
                      )}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none w-4 h-4" />
                  </div>
                </div>

                {/* Color Choice Field */}
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                    Color:
                  </label>
                  <div className="relative max-w-md">
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg p-3 pr-10 text-xs md:text-sm bg-transparent text-neutral-700 focus:outline-none appearance-none font-medium cursor-pointer"
                    >
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="white">White</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Quantity Picker & Add To Cart Button Footing Section */}
              <div className="flex items-center gap-4 max-w-md w-full">
                {/* Custom Quantity Controls */}
                <div className="flex items-center border border-neutral-200 rounded-lg h-12 overflow-hidden bg-white shrink-0">
                  <button
                    type="button"
                    onClick={decrementQty}
                    className="w-10 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-base font-medium transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs md:text-sm font-semibold select-none text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQty}
                    className="w-10 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-base font-medium transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Confirm Add Action Button */}
                <button
                  type="button"
                  className="flex-1 bg-[#2c2c2e] hover:bg-black text-white font-bold text-[11px] md:text-xs uppercase tracking-widest h-12 rounded-lg transition-colors duration-200 shadow-xs"
                  onClick={() => {
                    // Inject finalized selection parameters payload into application context
                    console.log("Added to cart:", { 
                      ...product, 
                      quantity, 
                      size: selectedSize, 
                      color: selectedColor 
                    });
                    setIsModalOpen(false);
                  }}
                >
                  Add To Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}