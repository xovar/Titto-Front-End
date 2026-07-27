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

    // একটিভ ভ্যারিয়েন্টের ভেতর থেকে ইউজারের সিলেক্ট করা সাইজ অবজেক্টটি খোঁজা হচ্ছে
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

  // ৩. বর্তমান বিক্রয়মূল্য (Calculated Price) - ডিসকাউন্ট থাকলে ছাড়ের পর যা হবে, না থাকলে আসল দাম
  const numericPrice =
    discountPercent > 0
      ? Number((numericOriginalPrice * (1 - discountPercent / 100)).toFixed(0))
      : numericOriginalPrice;

  // ⚡ মোডাল সাবমিশন হ্যান্ডলার (Buy Now এবং Add to Cart দুটোই হ্যান্ডেল করবে)
  const handleAddToCartSubmit = (modalData) => {
    const itemToCheckout = {
      id: product.id,
      name: product.name,
      image:
        activeVariant?.images?.[0] || product.images?.[0] || displayImages[0],
      price: modalData.finalPrice / modalData.quantity,
      quantity: modalData.quantity,
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
        onClick={handleCardClick}
        className={`relative border border-neutral-200 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 group/card cursor-pointer flex ${
          isList ? "flex-row items-center gap-6 w-full" : "flex-col h-full"
        }`}
      >
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-[#ea4c3b] text-white text-[10px] font-bold px-2 py-1 rounded z-10">
            -{product.discount}%
          </div>
        )}

        {/* Sold Out Tag */}
        {currentStock === 0 && (
          <div className="absolute top-4 right-4 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded z-10 border border-neutral-800 select-none">
            Sold Out
          </div>
        )}

        {/* Hover Action Buttons */}
        <div className="absolute w-full rounded-2xl h-83.75 bg-black/60 flex justify-center items-end pb-5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20">
          <button
            className={`btn btn-wide cursor-pointer ${currentStock === 0 ? "btn-disabled bg-neutral-800 text-neutral-500 border-none" : ""}`}
            disabled={currentStock === 0}
            onClick={(e) => {
              e.stopPropagation();
              if (currentStock > 0) setIsModalOpen(true);
            }}
          >
            {currentStock > 0 ? "Quick View" : "Out of Stock"}
          </button>
        </div>

        {/* Image Container */}
        <div
          className={`${
            isList ? "w-44 h-44 shrink-0" : "w-full aspect-square mb-4"
          } relative overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100`}
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
        <div
          className={`flex flex-col items-start text-left pb-4 pl-4 pr-4 w-full ${isList ? "flex-1" : "mt-auto"}`}
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
              {/* ⚡ সাইজগুলোকে ছোট থেকে বড় ক্রমে সাজানোর লজিক */}
              {[...availableSizes]
                .sort((a, b) => {
                  const numA = parseFloat(a);
                  const numB = parseFloat(b);

                  // ১. যদি দুটিই সংখ্যা হয় (যেমন: 40, 41, 42)
                  if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                  }

                  // ২. যদি টেক্সট সাইজ হয় (S, M, L, XL ইত্যাদি)
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

                  // ৩. সাধারণ স্ট্রিং অ্যালফাবেটিকাল শর্টিং
                  return String(a).localeCompare(String(b));
                })
                .map((sizeValue) => {
                  const isSelected = currentSizeToShow === sizeValue;
                  return (
                    <button
                      key={sizeValue}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSizeClick(sizeValue);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
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

            <span className="flex items-center text-[15px] font-['Bangla'] font-bold">
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
