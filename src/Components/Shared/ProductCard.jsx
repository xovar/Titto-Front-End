import { useState } from "react";
import { FiHeart, FiShoppingCart, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// React Toastify imports
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Swiper core components and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Import core Swiper CSS files
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const COLOR_MAP = {
  black: "bg-black",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  white: "bg-white border border-neutral-300",
  gray: "bg-gray-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
};

const FALLBACK_SIZES = ["S", "M", "L", "XL"];
const FALLBACK_COLORS = ["Black", "Red", "Blue", "White"];

export default function ProductCard({ product, viewMode = "grid" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : FALLBACK_SIZES;
  const availableColors = product.colors && product.colors.length > 0 ? product.colors : FALLBACK_COLORS;

  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  const isList = viewMode === "list";

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const activeColorKey = selectedColor?.toLowerCase();
  const displayImages = 
    product.colorImages?.[activeColorKey] || 
    product.images || 
    [product.image || "https://via.placeholder.com/400x400?text=Product"];

  // Reusable add to cart handler with Toast notification trigger
  const handleAddToCart = () => {
    console.log("Added to cart payload submission:", {
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    // Custom stylized cinematic toast notification
    toast.success(
      <div className="flex flex-col gap-0.5 text-left">
        <span className="font-extrabold text-neutral-900 tracking-tight text-sm">
          Excellent choice! ⚡
        </span>
        <span className="text-xs text-neutral-500 leading-normal">
          {quantity}x <strong className="text-neutral-800 font-semibold">{product.title}</strong> ({selectedColor} / {selectedSize}) safely secured in your bag.
        </span>
      </div>,
      {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );

    setIsModalOpen(false);
  };

  return (
    <>
      {/* =========================================================================
          PRODUCT CARD VIEW (Responsive touch carousel)
          ========================================================================= */}
      <div
        className={`animate-border-red relative border border-neutral-200 rounded-2xl p-4 bg-white hover:shadow-xl transition-shadow duration-300 group/card cursor-pointer flex ${
          isList ? "flex-row items-center gap-6 w-full" : "flex-col h-full"
        }`}
      >
        {product.discount && (
          <div className="absolute top-4 left-4 bg-[#ea4c3b] text-white text-[10px] font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </div>
        )}

        {/* Hover Action Buttons Layer */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20">
          <button
            type="button"
            className="w-8 h-8 cursor-pointer bg-white border border-neutral-200 rounded shadow-sm flex items-center justify-center text-neutral-600 hover:text-[#ea4c3b] hover:border-[#ea4c3b] hover:bg-red-50 transition-colors"
            aria-label="Add to favorites"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FiHeart className="w-4 h-4" />
          </button>

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

        {/* Card Image Carousel Window */}
        <div 
          className={`${isList ? "w-48 h-48 shrink-0" : "w-full aspect-square mb-4"} relative overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100`}
          onClick={() => setIsModalOpen(true)}
        >
          <Swiper
            key={`${product.id}-${selectedColor}`}
            modules={[Pagination, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            loop={displayImages.length > 1}
            pagination={displayImages.length > 1 ? { clickable: true } : false}
            className="w-full h-full"
            style={{
              "--swiper-pagination-color": "#ea4c3b",
              "--swiper-pagination-bullet-size": "5px",
            }}
          >
            {displayImages.map((imgUrl, idx) => (
              <SwiperSlide key={`card-${imgUrl}-${idx}`} className="w-full h-full flex items-center justify-center bg-white p-4">
                <img
                  src={imgUrl}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Technical Product Metadata Container */}
        <div className={`flex flex-col items-start text-left w-full ${isList ? "flex-1" : "mt-auto"}`}>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            {product.category}
          </span>
          <h3 className="text-sm font-bold text-neutral-800 mb-2 line-clamp-1">
            {product.title}
          </h3>

          {/* DYNAMIC CARD-FACE COLOR SELECTOR */}
          <div className="bg-white flex items-center gap-2 mb-2 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-[45px]">Color:</span>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((colorName) => {
                const normalized = colorName.toLowerCase();
                const bgClass = COLOR_MAP[normalized] || "bg-neutral-300";
                const isSelected = selectedColor === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    title={colorName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(colorName);
                    }}
                    className={`w-4 h-4 rounded-full ${bgClass} cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "ring-2 ring-offset-1 ring-[#ea4c3b] scale-110 z-10" 
                        : "border border-neutral-200 hover:scale-110"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* DYNAMIC CARD-FACE SIZE SELECTOR */}
          <div className="bg-white flex items-center gap-2 mb-3 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-[45px]">Sizes:</span>
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((sizeValue) => {
                const isSelected = selectedSize === sizeValue;
                return (
                  <button
                    key={sizeValue}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(sizeValue);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                      isSelected
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    {sizeValue}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mt-auto">
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

      {/* =========================================================================
          QUICK VIEW / ADD TO CART MODAL OVERLAY
          ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-10 relative shadow-2xl flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute cursor-pointer top-4 right-4 md:top-6 md:right-6 w-8 h-8 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 hover:scale-105 transition-all z-30"
              aria-label="Close modal"
            >
              <FiX className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Left Column: Product Spotlight Slider Dynamic Swiper Layout */}
            <div className="flex-1 w-full aspect-square md:h-[420px] bg-neutral-50 border border-neutral-100 rounded-2xl relative overflow-hidden group/slider">
              <Swiper
                key={`modal-${product.id}-${selectedColor}`}
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                loop={displayImages.length > 1}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={{
                  nextEl: ".modal-swiper-next",
                  prevEl: ".modal-swiper-prev",
                }}
                className="w-full h-full rounded-2xl"
                style={{
                  "--swiper-pagination-color": "#2c2c2e",
                  "--swiper-pagination-bullet-inactive-color": "#a3a3a3",
                  "--swiper-pagination-bullet-inactive-opacity": "0.4",
                  "--swiper-pagination-bullet-size": "7px",
                }}
              >
                {displayImages.map((imgUrl, idx) => (
                  <SwiperSlide key={`modal-${imgUrl}-${idx}`} className="bg-white flex items-center justify-center p-8 select-none w-full h-full">
                    <img
                      src={imgUrl}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full max-h-[340px] object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Functional Directional Navigators */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="modal-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 cursor-pointer rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-sm opacity-0 group-hover/slider:opacity-100 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200"
                    aria-label="Previous slide"
                  >
                    <FiChevronLeft className="w-5 h-5 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    className="modal-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 cursor-pointer rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-sm opacity-0 group-hover/slider:opacity-100 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200"
                    aria-label="Next slide"
                  >
                    <FiChevronRight className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </>
              )}
            </div>

            {/* Right Column: Information & Selection Panels */}
            <div className="flex-1 flex flex-col justify-center text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">
                {product.title}
              </h2>

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

              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-6 font-normal max-w-md">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>

              <div className="space-y-4 mb-6">
                {/* MODAL SIZE SELECTOR */}
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                    Size: <span className="text-neutral-400 font-normal ml-1">{selectedSize}</span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`h-9 min-w-[36px] px-3 rounded-lg text-xs font-bold uppercase transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-neutral-900 text-white border border-neutral-900 shadow-sm scale-105"
                              : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MODAL COLOR SELECTOR */}
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                    Color:
                    <span className="text-neutral-400 font-normal capitalize ml-1">
                      {selectedColor}
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-3 py-1">
                    {availableColors.map((colorName) => {
                      const normalized = colorName.toLowerCase();
                      const bgClass = COLOR_MAP[normalized] || "bg-neutral-300";
                      const isSelected = selectedColor === colorName;

                      return (
                        <button
                          key={colorName}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          className={`w-6 h-6 rounded-full ${bgClass} cursor-pointer transition-all duration-200 hover:scale-110 relative ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-neutral-900 scale-110 z-10"
                              : "border border-neutral-200 hover:border-neutral-400"
                          }`}
                          title={colorName}
                          aria-label={`Select ${colorName} color`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 max-w-md w-full">
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

                <button
                  type="button"
                  className="flex-1 bg-[#2c2c2e] hover:bg-black text-white font-bold text-[11px] md:text-xs uppercase tracking-widest h-12 rounded-lg transition-colors duration-200 shadow-sm"
                  onClick={handleAddToCart}
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