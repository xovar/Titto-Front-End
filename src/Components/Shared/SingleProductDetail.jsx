import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  FiHeart,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { toast } from "react-toastify";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { addToCart } from "../../store/features/cart/cartSlice";
import axios from "axios";

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ⚡ Size Guide Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // ⚡ ১. রিডাক্স স্টোর থেকে রিয়েল ডাটা এবং লোডিং স্টেট আনা
  const { items: products, loading } = useSelector((state) => state.products);
  const product = useMemo(() => {
    return products?.find((p) => p.id === id);
  }, [products, id]);

  useEffect(() => {
    if (id) {
      axios.patch(`https://api.titto.com.bd/api/products/${id}/view`);
    }
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 🔍 Magnifier Box State
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // 🎨 ২. ডাইনামিক কালার লিস্ট বের করা
  const availableColors = useMemo(() => {
    const variants = product?.variants;
    if (!variants || !Array.isArray(variants)) return [];

    return variants
      .map((v) => v?.color)
      .filter((c) => c && c.name && c.code)
      .filter(
        (value, index, self) =>
          self.findIndex((t) => t.name === value.name) === index
      );
  }, [product]);

  // ⚡ ৩. Derived State for Selected Color
  const [userSelectedColor, setUserSelectedColor] = useState("");
  const selectedColor = userSelectedColor || availableColors[0]?.name || "";

  // 🔄 ৪. সিলেক্টেড কালারের ওপর ভিত্তি করে একটিভ ভ্যারিয়েন্ট ফিল্টার
  const activeVariant = useMemo(() => {
    const variants = product?.variants;
    if (!variants || !Array.isArray(variants)) return null;

    return (
      variants.find((v) => v?.color?.name === selectedColor) ||
      variants[0] ||
      null
    );
  }, [product, selectedColor]);

  // 📏 ৫. ডাইনামিক সাইজ লিস্ট বের করা
  const availableSizes = useMemo(() => {
    const extractedSizes = activeVariant?.sizes
      ? activeVariant.sizes.map((s) => s.size)
      : [];
    return extractedSizes.length > 0 ? [...new Set(extractedSizes)] : [];
  }, [activeVariant]);

  const [userSelectedSize, setUserSelectedSize] = useState("");
  const currentSizeToShow = availableSizes.includes(userSelectedSize)
    ? userSelectedSize
    : "";

  // ⚡ কালার চেঞ্জ হ্যান্ডলার
  const handleColorChange = (colorName) => {
    setUserSelectedColor(colorName);
    setActiveImageIndex(0);
    setIsZoomed(false);
    if (swiperRef) {
      swiperRef.slideTo(0);
    }
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ⚡ ইমেজ এবং প্রাইস সেটআপ
  const displayImages = activeVariant?.images || [];
  const currentActiveImage = displayImages[activeImageIndex] || displayImages[0] || "";

  const numericOriginalPrice = Number(product?.price) || 0;
  const discountPercent = Number(product?.discount) || 0;
  const numericPrice =
    discountPercent > 0
      ? Number((numericOriginalPrice * (1 - discountPercent / 100)).toFixed(0))
      : numericOriginalPrice;

  // 🔍 সংশোধিত Magnifier Box লজিক
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // কার্সরের পজিশন
    let x = e.clientX - left;
    let y = e.clientY - top;

    const lensSize = 120;
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // বাউন্ডারি লক
    if (lensX < 0) lensX = 0;
    if (lensX > width - lensSize) lensX = width - lensSize;
    if (lensY < 0) lensY = 0;
    if (lensY > height - lensSize) lensY = height - lensSize;

    setLensPos({ x: lensX, y: lensY });

    // ব্যাকগ্রাউন্ড জুমিং পজিশনিং (নিখুঁত করার জন্য)
    const zoomX = (x / width) * 100;
    const zoomY = (y / height) * 100;

    setZoomPos({ x: zoomX, y: zoomY });
    setIsZoomed(true);
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
    if (swiperRef) swiperRef.slideTo(index);
  };

  // ⚡ রিডাক্স ডিসপ্যাচ অ্যাকশন ফাংশন
  const handleAction = (actionType) => {
    if (!currentSizeToShow) {
      toast.error("Please select a size first!");
      return;
    }

    const orderPayload = {
      productId: product?.id,
      variantId: activeVariant?.id,
      name: product?.name,
      quantity,
      size: currentSizeToShow,
      color: selectedColor,
      price: numericPrice,
      dicount: product.discount,
      image: displayImages[0] || "https://via.placeholder.com/150",
      category: product.category?.name || "",
    };

    if (actionType === "cart") {
      dispatch(addToCart(orderPayload));
      toast.success(`${quantity}x ${product?.name} added to cart!`);
    } else if (actionType === "buy_now") {
      toast.info(`Proceeding to buy ${quantity}x ${product?.name}!`);
      navigate("/checkout", { state: { checkoutItem: orderPayload } });
    }
  };

  /* ⏳ কন্ডিশন ১: যদি রিডাক্স ডাটা ব্যাকএন্ড থেকে লোড হতে থাকে */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-white">
        <span className="loading loading-spinner loading-lg text-[#ea4c3b]"></span>
        <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider animate-pulse">
          Loading Product Details...
        </p>
      </div>
    );
  }

  /* ❌ কন্ডিশন ২: লোডিং শেষ কিন্তু প্রোডাক্ট খুঁজে পাওয়া যায়নি */
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-white">
        <h2 className="text-xl font-bold text-neutral-700">
          Product Not Found!
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black border px-4 py-2 rounded-lg transition-all"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Image Area & Grid Thumbnails */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div 
            className="w-full aspect-square border border-neutral-200 rounded-2xl relative flex items-center justify-center overflow-hidden bg-white cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Swiper
              onSwiper={setSwiperRef}
              key={`single-${product.id}-${selectedColor}`}
              modules={[Navigation, Pagination, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(swiper) => {
                setActiveImageIndex(swiper.activeIndex);
                setIsZoomed(false);
              }}
              className="w-full h-full pointer-events-none" // pointer-events-none যাতে জুম ট্র্যাকিং এ বাধা না দেয়
            >
              {displayImages.map((imgUrl, idx) => (
                <SwiperSlide
                  key={`main-img-${idx}`}
                  className="flex items-center justify-center p-6 bg-white"
                >
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-contain max-h-120 mx-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 🔍 Magnifier Glass Lens */}
            {isZoomed && (
              <div
                className="absolute border border-neutral-300 bg-black/5 pointer-events-none z-30 shadow-sm"
                style={{
                  width: "120px",
                  height: "120px",
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {/* 🔍 Full Box Zoom Window */}
            {isZoomed && currentActiveImage && (
              <div
                className="absolute inset-0 z-40 border border-neutral-200 bg-white shadow-2xl pointer-events-none rounded-2xl"
                style={{
                  backgroundImage: `url("${currentActiveImage}")`,
                  backgroundSize: "220%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Slider Navigation Buttons */}
            {displayImages.length > 1 && !isZoomed && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm opacity-80 hover:opacity-100 hover:bg-neutral-900 hover:text-white transition-all duration-200 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    swiperRef?.slidePrev();
                  }}
                >
                  <FiChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm opacity-80 hover:opacity-100 hover:bg-neutral-900 hover:text-white transition-all duration-200 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    swiperRef?.slideNext();
                  }}
                >
                  <FiChevronRight className="w-5 h-5 stroke-[2.2]" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Grid */}
          {displayImages.length > 1 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {displayImages.map((imgUrl, idx) => (
                <button
                  key={`thumb-${idx}`}
                  type="button"
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-20 h-20 border rounded-xl p-1 bg-white overflow-hidden transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[#ea4c3b] ring-1 ring-[#ea4c3b]"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt="thumb"
                    className="w-full h-full object-contain mx-auto"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start text-left pt-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
            {product.category?.name}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight">
            {product.name}
          </h1>

          {/* Price & Views */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center text-xl font-black">
              {discountPercent > 0 && numericOriginalPrice > 0 && (
                <span className="text-neutral-400 line-through font-normal mr-3 text-base">
                  ৳{numericOriginalPrice.toFixed(0)}
                </span>
              )}
              <span className="text-2xl">
                ৳{numericPrice.toFixed(0)}
              </span>
            </div>
          </div>

          <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-xl">
            {product.description}
          </p>

          {/* COLOR SELECTOR */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider mb-2.5">
                Color:{" "}
                <span className="text-neutral-400 font-normal capitalize ml-1">
                  {selectedColor}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((colorObj) => {
                  const isSelected = selectedColor === colorObj.name;
                  return (
                    <button
                      key={colorObj.name}
                      type="button"
                      onClick={() => handleColorChange(colorObj.name)}
                      style={{ backgroundColor: colorObj.code }}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 relative ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-neutral-900 scale-105"
                          : "border border-neutral-200"
                      }`}
                      title={colorObj.name}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider mb-2.5">
                Size:{" "}
                <span className="text-neutral-400 font-normal ml-1">
                  {currentSizeToShow || "Select yours"}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes
                  .slice()
                  .sort((a, b) => Number(a) - Number(b))
                  .map((size) => {
                    const isSelected = currentSizeToShow === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setUserSelectedSize(size)}
                        className={`h-10 min-w-10 px-3.5 rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-neutral-900 text-white border border-neutral-900 shadow-sm"
                            : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="flex items-center gap-3 mb-5 pt-2">
            <span className="text-shadow text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center border border-neutral-200 rounded bg-white h-8 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={decrementQty}
                className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-base border-r border-neutral-200"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-semibold select-none text-neutral-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-base border-l border-neutral-200"
              >
                +
              </button>
            </div>
          </div>

          {/* SIZE & CARE GUIDE */}
          <div className="flex gap-5 text-xs font-medium text-neutral-800 mb-4 select-none pt-2">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0"
            >
              <svg
                className="w-4 h-4 text-neutral-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v6H3z" />
                <path d="M6 9v3M9 9v2M12 9v3M15 9v2M18 9v3" />
              </svg>
              Size guide
            </button>
          </div>

          {/* LIVE TRACKING DATA BOX */}
          <div className="border border-neutral-300 rounded-2xs p-3 bg-white text-xs text-neutral-900 space-y-2.5 mb-5 max-w-md w-full font-normal pt-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-sm select-none">
                🗹
              </span>
              <span>
                <strong>Viewed:</strong> {product.viewed || 0} people recently
                VIEWED this product.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm select-none">
                🔥
              </span>
              <span>
                <strong>Popular:</strong> {product.sold || 0} people have BOUGHT
                this product.
              </span>
            </div>
          </div>

          {/* DYNAMIC ACTION BUTTONS BLOCK */}
          <div className="space-y-2 w-full max-w-md mt-auto pt-2">
            {!currentSizeToShow ? (
              <button
                type="button"
                className="w-full bg-black text-white font-medium text-sm py-3 rounded transition-colors"
                onClick={() => toast.error("Please select a size first!")}
              >
                Select Size
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="bg-black cursor-pointer hover:bg-neutral-900 text-white font-medium text-sm py-3 rounded transition-all flex items-center justify-center gap-1.5"
                  onClick={() => handleAction("buy_now")}
                >
                  Buy Now <span className="text-xs">❯</span>
                </button>
                <button
                  type="button"
                  className="bg-white cursor-pointer hover:bg-neutral-900 text-black border hover:text-white border-black font-medium text-sm py-3 rounded transition-all flex items-center justify-center gap-1.5"
                  onClick={() => handleAction("cart")}
                >
                  Add To Cart <FiShoppingBag className="w-4 h-4 mb-0.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              className="w-full cursor-pointer bg-white hover:bg-neutral-900 text-neutral-800 hover:text-white border border-neutral-300 font-medium text-sm py-2.5 rounded transition-colors flex items-center justify-center gap-2"
            >
              Add to Wishlist <FiHeart className="w-4 h-4 " />
            </button>
          </div>
        </div>
      </div>

      {/* ⚡ SIZE GUIDE MODAL POPUP */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setIsSizeGuideOpen(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto border border-neutral-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Size guide</h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-neutral-500 hover:text-black p-1 transition-colors cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
              <div className="relative w-full h-44 sm:h-52 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
                  alt="Style without compromise"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-4 text-right">
                  <h4 className="text-white text-2xl font-black uppercase tracking-tight leading-none drop-shadow-md">
                    Style <span className="text-red-500 font-light italic">without</span>
                  </h4>
                  <p className="text-white text-xl font-extrabold tracking-wider drop-shadow-md">
                    COMPROMISE
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-black tracking-tight uppercase">
                  MEN
                </h4>
              </div>

              <div className="border border-neutral-200 rounded-md overflow-hidden">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-[#ff0000] text-white text-xs font-black uppercase tracking-wider">
                      <th className="py-2.5 px-2 border-r border-red-600">
                        Titto SIZE
                      </th>
                      <th className="py-2.5 px-2 border-r border-red-600">
                        UK / LOCAL SIZE
                      </th>
                      <th className="py-2.5 px-2">HEEL TO TOE (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-neutral-800 divide-y divide-neutral-200">
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">39</td>
                      <td className="py-2 px-2 border-r border-neutral-200">5</td>
                      <td className="py-2 px-2">9.5</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">40</td>
                      <td className="py-2 px-2 border-r border-neutral-200">6</td>
                      <td className="py-2 px-2">9.8</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">41</td>
                      <td className="py-2 px-2 border-r border-neutral-200">7</td>
                      <td className="py-2 px-2">10</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">42</td>
                      <td className="py-2 px-2 border-r border-neutral-200">8</td>
                      <td className="py-2 px-2">10.3</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">43</td>
                      <td className="py-2 px-2 border-r border-neutral-200">9</td>
                      <td className="py-2 px-2">10.5</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">44</td>
                      <td className="py-2 px-2 border-r border-neutral-200">10</td>
                      <td className="py-2 px-2">10.9</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="py-2 px-2 border-r border-neutral-200">45</td>
                      <td className="py-2 px-2 border-r border-neutral-200">11</td>
                      <td className="py-2 px-2">11.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-center font-bold text-neutral-500 uppercase tracking-wide">
                <span className="text-red-500">N.B.</span> FOOT MEASUREMENT MAY VARY BY +/- 2MM
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}