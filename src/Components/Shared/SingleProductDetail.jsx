import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ⚡ useDispatch ইমপোর্ট করা হলো
import { useSelector, useDispatch } from "react-redux"; 
// 📦 আপনার প্রোজেক্টের কার্ট স্লাইস থেকে addToCart অ্যাকশনটি ইমপোর্ট করুন (পাথটি আপনার প্রোজেক্ট অনুযায়ী চেক করে নিন)
 

import {
  FiHeart,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { toast } from "react-toastify";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { addToCart } from "../../store/features/cart/cartSlice";

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ⚡ রিডাক্স ডিসপ্যাচ ইনিশিয়েলাইজ করা হলো

  // ⚡ ১. রিডাক্স স্টোর থেকে রিয়েল ডাটা এবং লোডিং স্টেট আনা
  const { items: products, loading } = useSelector((state) => state.products);
  const product = useMemo(() => {
    return products?.find((p) => p.id === id);
  }, [products, id]);

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
          self.findIndex((t) => t.name === value.name) === index,
      );
  }, [product]);

  // ⚡ ৩. ক্যাসকেডিং রেন্ডার এড়াতে Derived State
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

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ইমেজ এবং প্রাইস সেটআপ
  const displayImages = activeVariant?.images || [];
  const numericPrice = Number(product?.price) || 0;
  const discountPercent = Number(product?.discount) || 0;
  const numericOriginalPrice =
    discountPercent > 0 ? numericPrice / (1 - discountPercent / 100) : 0;

  // 🔍 Magnifier Box লজিক
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    const lensSize = 120;
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    if (lensX < 0) lensX = 0;
    if (lensX > width - lensSize) lensX = width - lensSize;
    if (lensY < 0) lensY = 0;
    if (lensY > height - lensSize) lensY = height - lensSize;

    setLensPos({ x: lensX, y: lensY });

    const zoomX = (lensX / (width - lensSize)) * 100;
    const zoomY = (lensY / (height - lensSize)) * 100;

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
      image: displayImages[0] || "https://via.placeholder.com/150",
      category: product.category?.name || ""
    };

    if (actionType === "cart") {
      dispatch(addToCart(orderPayload)); 
      toast.success(`${quantity}x ${product?.name} added to cart!`);
    } else if (actionType === "buy_now") {
      toast.info(`Proceeding to buy ${quantity}x ${product?.name}!`);
      navigate("/checkout", { state: { checkoutItem: orderPayload } });
    }

    console.log(`${actionType} payload:`, orderPayload);
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

  /* ❌ কন্ডিশন ২: লোডিং শেষ কিন্তু প্রোডাক্ট খুঁজে পাওয়া যায়নি */
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

  // 📦 কন্ডিশন ৩: ডাটা সাকসেসফুলি চলে এসেছে, এখন UI রেন্ডার হবে
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Image Area & Grid Thumbnails */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-square border border-neutral-200 rounded-2xl relative flex items-center justify-center overflow-hidden bg-white">
            <Swiper
              onSwiper={setSwiperRef}
              key={`single-${product.id}-${selectedColor}`}
              modules={[Navigation, Pagination, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(swiper) =>
                setActiveImageIndex(swiper.activeIndex)
              }
              className="w-full h-full"
            >
              {displayImages.map((imgUrl, idx) => (
                <SwiperSlide
                  key={`main-img-${idx}`}
                  className="flex items-center justify-center p-6 bg-white"
                >
                  <div
                    className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setIsZoomed(false)}
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-contain max-h-120 mx-auto"
                    />

                    {isZoomed && (
                      <div
                        className="absolute border border-neutral-300 bg-white/10 pointer-events-none shadow-sm"
                        style={{
                          width: "120px",
                          height: "120px",
                          left: `${lensPos.x}px`,
                          top: `${lensPos.y}px`,
                        }}
                      />
                    )}

                    {isZoomed && (
                      <div
                        className="absolute inset-0 z-40 border border-neutral-200 bg-white shadow-2xl pointer-events-none rounded-2xl"
                        style={{
                          backgroundImage: `url(${imgUrl})`,
                          backgroundSize: "280%",
                          backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {displayImages.length > 1 && !isZoomed && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm opacity-0 hover:bg-neutral-900 hover:text-white transition-all duration-200"
                  onClick={() => swiperRef?.slidePrev()}
                >
                  <FiChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm opacity-0 hover:bg-neutral-900 hover:text-white transition-all duration-200"
                  onClick={() => swiperRef?.slideNext()}
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
              {numericOriginalPrice > 0 && (
                <span className="text-neutral-400 line-through font-normal mr-3 text-base">
                  ৳{numericOriginalPrice.toFixed(0)}
                </span>
              )}
              <span className="text-[#ea4c3b] text-2xl">
                ৳{numericPrice.toFixed(0)}
              </span>
            </div>
            <div className="h-4 w-px bg-neutral-300" />
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <span className="text-yellow-400 text-base">★★★★★</span>
              <span>({product.viewed || 0} views)</span>
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
                      onClick={() => setUserSelectedColor(colorObj.name)}
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
                {availableSizes.map((size) => {
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
              className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0"
            >
              <svg className="w-4 h-4 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18v6H3z" />
                <path d="M6 9v3M9 9v2M12 9v3M15 9v2M18 9v3" />
              </svg>
              Size guide
            </button>
            <button
              type="button"
              className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0"
            >
              <svg className="w-4 h-4 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h14l1 7H4z" />
                <path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                <path d="M9 14h6" />
              </svg>
              Care guide
            </button>
          </div>

          {/* LIVE TRACKING DATA BOX */}
          <div className="border border-neutral-300 rounded-2xs p-3 bg-white text-xs text-neutral-900 space-y-2.5 mb-5 max-w-md w-full font-normal pt-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-sm select-none">🗹</span>
              <span><strong>Viewed:</strong> 232 people recently VIEWED this product.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm select-none">🔥</span>
              <span><strong>Popular:</strong> 5 people have BOUGHT this product.</span>
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
    </div>
  );
}