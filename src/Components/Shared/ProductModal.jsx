import { useState, useMemo } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  availableColors, 
  onAddToCart 
}) {
  const [quantity, setQuantity] = useState(1);
  
  // ১. সিলেক্টেড কালার স্টেট (কার্ডের মতো অবজেক্টের নাম ট্র্যাক করবে)
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name || "");

  // ২. মোডালের ভেতরেও সিলেক্টেড কালারের ওপর বেইজ করে একটিভ ভ্যারিয়েন্ট ফিল্টার
  const activeVariant = useMemo(() => {
    return product.variants?.find(v => v.color && v.color.name === selectedColor) || product.variants?.[0];
  }, [product.variants, selectedColor]);

  // ৩. ডাইনামিকালি মোডালের জন্য সাইজ বের করা (যেন ভুল কালারের সাইজ মোডালে শো না করে)
  const modalAvailableSizes = useMemo(() => {
    const extractedSizes = activeVariant && activeVariant.sizes
      ? activeVariant.sizes.map((s) => s.size)
      : [];
    return extractedSizes.length > 0 ? [...new Set(extractedSizes)] : ["S", "M", "L", "XL"];
  }, [activeVariant]);


  const [selectedSize, setSelectedSize] = useState(modalAvailableSizes[0] || "");
  
  const currentSizeToShow = useMemo(() => {
    return modalAvailableSizes.includes(selectedSize) ? selectedSize : modalAvailableSizes[0];
  }, [selectedSize, modalAvailableSizes]);

  if (!isOpen) return null;

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const displayImages = activeVariant?.images || product.images || ["https://via.placeholder.com/400x400?text=Product"];

  const numericPrice = Number(product.price) || 0;
  const discountPercent = Number(product.discount) || 0;
  const numericOriginalPrice = product.originalPrice 
    ? Number(product.originalPrice) 
    : discountPercent > 0 
      ? numericPrice / (1 - discountPercent / 100) 
      : 0;

  const handleSubmit = () => {
    onAddToCart({
      quantity,
      size: currentSizeToShow,
      color: selectedColor,
      finalPrice: numericPrice
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-10 relative shadow-2xl flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 md:top-6 md:right-6 w-8 h-8 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 hover:scale-105 transition-all z-30"
          aria-label="Close modal"
        >
          <FiX className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Left Column: Image Slider */}
        <div className="flex-1 w-full aspect-square md:h-[420px] bg-neutral-50 border border-neutral-100 rounded-2xl relative overflow-hidden group/slider">
          <Swiper
            key={`modal-${product.id}-${selectedColor}`}
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={displayImages.length > 1}
            autoplay={displayImages.length > 1 ? { delay: 4000, disableOnInteraction: false } : false}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{ nextEl: ".modal-swiper-next", prevEl: ".modal-swiper-prev" }}
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
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full max-h-[340px] object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>

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

        {/* Right Column: Information Panel */}
        <div className="flex-1 flex flex-col justify-center text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 text-lg md:text-xl font-bold mb-4">
            {numericOriginalPrice > 0 && (
              <span className="text-neutral-400 line-through font-normal">
                ${numericOriginalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[#ea4c3b]">
              ${numericPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-6 font-normal max-w-md">
            {product.description || "Classic and comfortable premium product built for daily lifestyle and active sports durability."}
          </p>

          <div className="space-y-4 mb-6">
            {/* MODAL SIZE SELECTOR */}
            <div>
              <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                Size: <span className="text-neutral-400 font-normal ml-1">{currentSizeToShow}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {modalAvailableSizes.map((size) => {
                  const isSelected = currentSizeToShow === size;
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
                Color: <span className="text-neutral-400 font-normal capitalize ml-1">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3 py-1">
                {availableColors.map((colorObj) => {
                  const isSelected = selectedColor === colorObj.name;
                  return (
                    <button
                      key={colorObj.id || colorObj.name}
                      type="button"
                      onClick={() => setSelectedColor(colorObj.name)}
                      style={{ backgroundColor: colorObj.code }} // 👈 colorMap এর ঝামেলা বাদ দিয়ে ডাইনামিক হেক্স কোড ব্যবহার করা হয়েছে
                      className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 relative ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-neutral-900 scale-110 z-10"
                          : "border border-neutral-200 hover:border-neutral-400"
                      }`}
                      title={colorObj.name}
                      aria-label={`Select ${colorObj.name} color`}
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
              onClick={handleSubmit}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}