import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // ১. কালার এক্সট্র্যাকশন
  const availableColors = useMemo(() => {
    return product.variants && product.variants.length > 0
      ? product.variants
          .map((v) => v.color)
          .filter((c) => c && c.name && c.code)
          .filter(
            (value, index, self) =>
              self.findIndex((t) => t.name === value.name) === index,
          )
      : FALLBACK_COLORS;
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name);

  // ২. সিলেক্টেড কালারের ওপর বেইজ করে একটিভ ভ্যারিয়েন্ট খুঁজে বের করা
  const activeVariant = useMemo(() => {
    return (
      product.variants?.find(
        (v) => v.color && v.color.name === selectedColor,
      ) || product.variants?.[0]
    );
  }, [product.variants, selectedColor]);

  // ৩. ডাইনামিক সাইজ এক্সট্র্যাকশন
  const availableSizes = useMemo(() => {
    const extractedSizes =
      activeVariant && activeVariant.sizes
        ? activeVariant.sizes.map((s) => s.size)
        : [];

    return extractedSizes.length > 0
      ? [...new Set(extractedSizes)]
      : FALLBACK_SIZES;
  }, [activeVariant]);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  const currentSizeToShow = useMemo(() => {
    return availableSizes.includes(selectedSize)
      ? selectedSize
      : availableSizes[0];
  }, [selectedSize, availableSizes]);

  // 🔍 ৪. সিলেক্টেড কালার এবং সাইজের লাইভ স্টক হিসাব করা
  const currentStock = useMemo(() => {
    if (!activeVariant || !activeVariant.sizes) return 0;

    const sizeObj = activeVariant.sizes.find(
      (s) => s.size === currentSizeToShow,
    );

    return sizeObj ? sizeObj.stock : 0;
  }, [activeVariant, currentSizeToShow]);

  const handleSizeClick = (sizeValue) => {
    setSelectedSize(sizeValue);
  };

  // ⚡ কার্ডে ক্লিক করলে ডিটেইলস পেজে যাওয়ার হ্যান্ডলার
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const isList = viewMode === "list";

  const displayImages = activeVariant?.images ||
    product.images || ["https://via.placeholder.com/400x400?text=Product"];

  // ১. আসল দাম (Original Price) - যা product.price এ আছে
  const numericOriginalPrice = Number(product.price) || 0;

  // ২. ডিসকাউন্ট পার্সেন্টেজ
  const discountPercent = Number(product.discount) || 0;

  // ৩. বর্তমান বিক্রয়মূল্য (Calculated Price)
  const numericPrice =
    discountPercent > 0
      ? Number((numericOriginalPrice * (1 - discountPercent / 100)).toFixed(0))
      : numericOriginalPrice;

  // ⚡ মোডাল সাবমিশন হ্যান্ডলার
  const handleAddToCartSubmit = (modalData) => {
    const itemToCheckout = {
      id: product.id,
      name: product.name,
      image:
        activeVariant?.images?.[0] || product.images?.[0] || displayImages[0],
      price: modalData.finalPrice / modalData.quantity,
      quantity: modalData.quantity,
      discount: product.discount,
      size: modalData.size,
      color: modalData.color,
    };

    if (modalData.action === "buy_now") {
      setIsModalOpen(false);
      navigate("/checkout", {
        state: { checkoutItem: itemToCheckout },
      });
      return;
    }

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
        onClick={handleCardClick}
        className={`relative border border-neutral-200/80 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 group/card cursor-pointer flex ${
          isList ? "flex-row items-center gap-6 w-full p-2" : "flex-col h-full"
        }`}
      >
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#ea4c3b] text-white text-[10px] font-bold px-2 py-0.5 rounded z-20 pointer-events-none shadow-xs">
            -{product.discount}%
          </div>
        )}

        {/* Sold Out Tag */}
        {currentStock === 0 && (
          <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded z-20 border border-neutral-800 select-none pointer-events-none">
            Sold Out
          </div>
        )}

        {/* Image Container Box */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${
            isList ? "w-44 h-44 shrink-0 mb-0" : "w-full aspect-square mb-3"
          } relative overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 z-10`}
        >
          {/* 🟢 HOVER OVERLAY - এখন শুধু ইমেজের ওপরেই দেখাবে */}
          <div className="absolute inset-0 w-full h-full bg-black/40 flex justify-center items-end p-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-30 pointer-events-none group-hover/card:pointer-events-auto">
            <button
              type="button"
              className={`w-full max-w-[80%] py-2.5 px-4 bg-white text-neutral-900 font-bold text-sm rounded-lg shadow-md hover:bg-neutral-100 transition-colors duration-200 ${
                currentStock === 0
                  ? "opacity-50 cursor-not-allowed bg-neutral-200 text-neutral-500"
                  : "cursor-pointer"
              }`}
              disabled={currentStock === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (currentStock > 0) setIsModalOpen(true);
              }}
            >
              {currentStock > 0 ? "Quick View" : "Out of Stock"}
            </button>
          </div>

          {/* Swiper Image Carousel */}
          <Swiper
            key={`${product.id}-${selectedColor}`}
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={displayImages.length > 1}
            allowTouchMove={true}
            preventClicks={true}
            preventClicksPropagation={true}
            nested={true}
            autoplay={
              displayImages.length > 1
                ? { delay: 4000, disableOnInteraction: false }
                : false
            }
            pagination={
              displayImages.length > 1 ? { clickable: true } : false
            }
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

        {/* Product Metadata Info Block */}
        <div
          className={`flex flex-col items-start text-left pb-4 pl-4 pr-4 w-full ${
            isList ? "flex-1 pb-0 pl-0" : "mt-auto"
          }`}
        >
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            {product.category && product.category.name}
          </span>
          <h3 className="text-sm font-bold text-neutral-800 mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* COLOR SELECTOR */}
          <div className="bg-white flex items-center gap-2 mb-2 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-11.25">
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
          <div className="bg-white flex items-center gap-2 mb-2 w-full">
            <span className="text-xs font-bold text-neutral-500 min-w-11.25">
              Sizes:
            </span>
            <div className="flex flex-wrap gap-1">
              {[...availableSizes]
                .sort((a, b) => {
                  const numA = parseFloat(a);
                  const numB = parseFloat(b);

                  if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                  }

                  const sizeOrder = [
                    "xs",
                    "s",
                    "m",
                    "l",
                    "xl",
                    "2xl",
                    "3xl",
                    "4xl",
                  ];
                  const indexA = sizeOrder.indexOf(String(a).toLowerCase());
                  const indexB = sizeOrder.indexOf(String(b).toLowerCase());

                  if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                  }

                  return String(a).localeCompare(String(b));
                })
                .map((sizeValue) => {
                  const sizeObj = activeVariant?.sizes?.find(
                    (s) => s.size === sizeValue,
                  );

                  const sizeStock = activeVariant?.sizes
                    ? sizeObj
                      ? sizeObj.stock
                      : 0
                    : 1;
                  const isOutOfStock = sizeStock === 0;

                  const isSelected = currentSizeToShow === sizeValue;

                  return (
                    <button
                      key={sizeValue}
                      type="button"
                      disabled={isOutOfStock}
                      title={
                        isOutOfStock ? "Out of Stock" : `Size: ${sizeValue}`
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) handleSizeClick(sizeValue);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        isOutOfStock
                          ? "bg-neutral-100 border-neutral-200 text-neutral-300 line-through cursor-not-allowed opacity-100"
                          : isSelected
                          ? "bg-neutral-900 border-neutral-900 text-white cursor-pointer"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 cursor-pointer"
                      }`}
                    >
                      {sizeValue}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 📦 LIVE STOCK STATUS INDICATOR */}
          <div className="mb-3 w-full">
            {currentStock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-600 uppercase tracking-wider select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                In Stock ({currentStock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-500 uppercase tracking-wider select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2 text-sm mt-auto">
            {discountPercent > 0 && (
              <span className="flex items-center text-[15px] text-[#929090] font-['Bangla'] font-bold">
                <span className="text-[18px]">৳</span>
                <span className="line-through ml-0.5">
                  {numericOriginalPrice.toFixed(2)}
                </span>
              </span>
            )}

            <span className="flex items-center text-[15px] font-['Bangla'] font-bold text-neutral-900">
              <span className="text-[18px]">৳</span>
              <span className="ml-0.5">{numericPrice.toFixed(2)}</span>
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
          availableColors={availableColors}
          onAddToCart={handleAddToCartSubmit}
        />
      )}
    </>
  );
}