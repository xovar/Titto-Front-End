import { useState, useMemo } from "react"; // 👈 useEffect ফেলে দিয়ে শুধু useMemo রাখা হয়েছে
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import ProductModal from "./ProductModal";

const FALLBACK_SIZES = ["S", "M", "L", "XL"];
const FALLBACK_COLORS = [{ name: "Default", code: "#d4d4d4" }];

export default function ProductCard({ product, viewMode = "grid" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ১. কালার এক্সট্র্যাকশন
  const availableColors = useMemo(() => {
    return product.variants && product.variants.length > 0
      ? product.variants
          .map((v) => v.color)
          .filter((c) => c && c.name && c.code)
          .filter((value, index, self) => 
            self.findIndex((t) => t.name === value.name) === index
          )
      : FALLBACK_COLORS;
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name);

  // ২. সিলেক্টেড কালারের ওপর বেইজ করে একটিভ ভ্যারিয়েন্ট খুঁজে বের করা
  const activeVariant = useMemo(() => {
    return product.variants?.find((v) => v.color && v.color.name === selectedColor) ||
      product.variants?.[0];
  }, [product.variants, selectedColor]);

  // ৩. ডাইনামিক সাইজ এক্সট্র্যাকশন (useMemo ব্যবহার করা হয়েছে)
  const availableSizes = useMemo(() => {
    const extractedSizes = activeVariant && activeVariant.sizes
      ? activeVariant.sizes.map((s) => s.size)
      : [];
    
    return extractedSizes.length > 0 ? [...new Set(extractedSizes)] : FALLBACK_SIZES;
  }, [activeVariant]); 

  // ৪. সিলেক্টেড সাইজ স্টেট (এটি ব্যাকআপ হিসেবে ক্লিক করা সাইজ মনে রাখবে)
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  // ⚡ ৫. ইফেক্ট ছাড়া স্টেট সিনক্রোনাইজেশন (Derived State Pattern)
  // যদি বর্তমানে সিলেক্টেড সাইজটি এই নতুন কালারের সাইজ লিস্টে না থাকে, তবে প্রথম সাইজটি দেখাবে
  const currentSizeToShow = useMemo(() => {
    return availableSizes.includes(selectedSize) ? selectedSize : availableSizes[0];
  }, [selectedSize, availableSizes]);

  // সাইজ বাটনে ক্লিক হ্যান্ডলার
  const handleSizeClick = (sizeValue) => {
    setSelectedSize(sizeValue);
  };

  const isList = viewMode === "list";
  
  const displayImages = activeVariant?.images ||
    product.images || ["https://via.placeholder.com/400x400?text=Product"];

  const numericPrice = Number(product.price) || 0;
  const discountPercent = Number(product.discount) || 0;
  const numericOriginalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : discountPercent > 0
      ? numericPrice / (1 - discountPercent / 100)
      : 0;

  const handleAddToCartSubmit = (modalData) => {
    console.log("Added to cart payload submission:", {
      ...product,
      quantity: modalData.quantity,
      size: modalData.size,
      color: modalData.color,
      finalPrice: modalData.finalPrice,
    });

    toast.success(
      <div className="flex flex-col gap-0.5 text-left">
        <span className="font-extrabold text-neutral-900 tracking-tight text-sm">
          Excellent choice! ⚡
        </span>
        <span className="text-xs text-neutral-500 leading-normal">
          {modalData.quantity}x{" "}
          <strong className="text-neutral-800 font-semibold">
            {product.name}
          </strong>{" "}
          ({modalData.color} / {modalData.size}) safely secured in your bag.
        </span>
      </div>,
      {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      },
    );

    setIsModalOpen(false);
  };

  return (
    <>
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

        {/* Hover Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20">
          <button
            type="button"
            className="w-8 h-8 cursor-pointer bg-white border border-neutral-200 rounded shadow-sm flex items-center justify-center text-neutral-600 hover:text-[#ea4c3b] hover:border-[#ea4c3b] hover:bg-red-50 transition-colors"
            aria-label="Add to favorites"
            onClick={(e) => e.stopPropagation()}
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

        {/* Image Container */}
        <div
          className={`${
            isList ? "w-44 h-44 shrink-0" : "w-full aspect-square mb-4"
          } relative overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100`}
          onClick={() => setIsModalOpen(true)}
        >
          <Swiper
            key={`${product.id}-${selectedColor}`}
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={displayImages.length > 1}
            autoplay={
              displayImages.length > 1
                ? { delay: 4000, disableOnInteraction: false }
                : false
            }
            pagination={displayImages.length > 1 ? { clickable: true } : false}
            className="w-full h-full"
            style={{
              "--swiper-pagination-color": "#ea4c3b",
              "--swiper-pagination-bullet-size": "5px",
            }}
          >
            {displayImages.map((imgUrl, idx) => (
              <SwiperSlide
                key={`card-${imgUrl}-${idx}`}
                className="w-full h-full flex items-center justify-center bg-white select-none"
              >
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Metadata */}
        <div className={`flex flex-col items-start text-left w-full ${isList ? "flex-1" : "mt-auto"}`}>
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            {product.category && product.category.name}
          </span>
          <h3 className="text-sm font-bold text-neutral-800 mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* COLOR SELECTOR */}
          <div className="bg-white flex items-center gap-2 mb-2 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-[45px]">
              Color:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((colorObj) => {
                const isSelected = selectedColor === colorObj.name;
                return (
                  <button
                    key={colorObj.id || colorObj.name}
                    type="button"
                    title={colorObj.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(colorObj.name);
                    }}
                    style={{ backgroundColor: colorObj.code }}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-offset-1 ring-[#ea4c3b] scale-110 z-10"
                        : "border border-neutral-200 hover:scale-110"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* SIZES SELECTOR */}
          <div className="bg-white flex items-center gap-2 mb-3 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-[45px]">
              Sizes:
            </span>
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((sizeValue) => {
                // 👈 এখানে ডাইনামিক `currentSizeToShow` চেক করা হচ্ছে
                const isSelected = currentSizeToShow === sizeValue; 
                return (
                  <button
                    key={sizeValue}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSizeClick(sizeValue);
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
            {numericOriginalPrice > 0 && (
              <span className="text-neutral-400 line-through">
                ${numericOriginalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[#ea4c3b] font-bold">
              ${numericPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* DETACHED MODAL COMPONENT */}
      {isModalOpen && (
        <ProductModal
          key={product.id}
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availableColors={availableColors.map(c => c.name)}
          availableSizes={availableSizes}
          onAddToCart={handleAddToCartSubmit}
        />
      )}
    </>
  );
}