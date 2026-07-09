import { useState, useMemo } from "react";
import { useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom"; 
import { addToCart } from "../../store/features/cart/cartSlice"; 
import { addToWishlist } from "../../store/features/wishList/wishListSlice";
import { FiX, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";
import { toast } from "react-toastify";

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
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  const [quantity, setQuantity] = useState(1);
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // 🔍 Magnifier / Zoom Lens State
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // 🎨 ১. কালার সিলেক্ট করার জন্য স্টেট (শুরুতে প্রথম কালারটি ডিফল্ট থাকবে)
  const [userSelectedColor, setUserSelectedColor] = useState("");
  const selectedColor = userSelectedColor || availableColors[0]?.name || "";

  // 🔄 ২. সিলেক্টেড কালারের ওপর ভিত্তি করে একটিভ ভ্যারিয়েন্ট ফিল্টার (SingleProduct এর মতো useMemo)
  const activeVariant = useMemo(() => {
    const variants = product?.variants;
    if (!variants || !Array.isArray(variants)) return null;

    return (
      variants.find(v => v?.color?.name === selectedColor) ||
      variants[0] ||
      null
    );
  }, [product, selectedColor]);

  // 📏 ৩. একটিভ ভ্যারিয়েন্ট থেকে ডাইনামিক সাইজ লিস্ট বের করা
  const modalAvailableSizes = useMemo(() => {
    const extractedSizes = activeVariant?.sizes
      ? activeVariant.sizes.map((s) => s.size)
      : [];
    return extractedSizes.length > 0 ? [...new Set(extractedSizes)] : [];
  }, [activeVariant]);

  // 💡 ৪. সাইজ সিলেকশন স্টেট ও ভ্যালিডেশন
  const [userSelectedSize, setUserSelectedSize] = useState("");
  const currentSizeToShow = modalAvailableSizes.includes(userSelectedSize) 
    ? userSelectedSize 
    : "";

  // 💖 উইশলিস্ট হ্যান্ডলার
  const handleWishlistClick = () => {
    const totalStock = product.variants?.reduce((total, variant) => {
      return total + variant.sizes.reduce((sTotal, s) => sTotal + s.stock, 0);
    }, 0) || 0;

    const wishlistPayload = {
      id: product.id,
      name: product.name,
      image: product.variants?.[0]?.images?.[0] || "", 
      price: product.price,
      inStock: totalStock > 0, 
    };

    toast.success("Excellent Taste! ❤️");
    dispatch(addToWishlist(wishlistPayload));
  };

  if (!isOpen) return null;

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ইমেজ এবং প্রাইস সেটআপ
  const displayImages = activeVariant?.images || product?.images || ["https://via.placeholder.com/400x400?text=Product"];
  const numericPrice = Number(product?.price) || 0;
  const discountPercent = Number(product?.discount) || 0;
  const numericOriginalPrice = product?.originalPrice 
    ? Number(product.originalPrice) 
    : discountPercent > 0 
      ? numericPrice / (1 - discountPercent / 100) 
      : 0;

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
    if (swiperRef) swiperRef.slideTo(index);
  };

  // 🔍 Magnifier Box লজিক
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    const lensSize = 100;
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

  // 🚀 রেডাক্স এবং চেকাউট নেভিগেশনের সাথে অ্যাকশন হ্যান্ডলার (হুবহু SingleProduct এর স্ট্রাকচারে)
  const handleAction = (actionType) => {
    if (!currentSizeToShow) {
      toast.error("Please select a size first!");
      return;
    }

    // 📦 SingleProduct পেজের মতোই প্রপার স্ট্রাকচারড ডেটা পেলোড (Payload)
    const orderPayload = {
      productId: product?.id,
      variantId: activeVariant?.id,
      name: product?.name,
      quantity,
      size: currentSizeToShow,
      color: selectedColor,
      price: numericPrice,
      image: displayImages[0] || "https://via.placeholder.com/150",
      category: product?.category?.name || ""
    };

    if (actionType === "cart") {
      // 🛒 রিডাক্স কার্টে ডাটা পুশ
      dispatch(addToCart(orderPayload));
      toast.success(`${quantity}x ${product?.name} added to cart!`);

      if (onAddToCart) {
        onAddToCart({
          quantity,
          size: currentSizeToShow,
          color: selectedColor,
          finalPrice: numericPrice,
          action: actionType
        });
      }
    } else if (actionType === "buy_now") {
      onClose(); // ১. মোডাল বন্ধ হবে
      toast.info(`Proceeding to buy ${quantity}x ${product?.name}!`);
      
      // ⚡ ২. আপনার কাঙ্ক্ষিত হুবহু চেকাউট নেভিগেশন স্টেট সহকারে!
      navigate("/checkout", { state: { checkoutItem: orderPayload } });
    }

    console.log(`${actionType} payload:`, orderPayload);
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

        {/* Left Column: Image Slider & Thumbnails Grid */}
        <div className="flex-1 w-full flex flex-col gap-4 relative">
          <div className="w-full aspect-square md:h-100 bg-white border border-neutral-100 rounded-2xl relative overflow-hidden group/slider flex items-center justify-center">
            <Swiper
              onSwiper={setSwiperRef}
              key={`modal-${product.id}-${selectedColor}`}
              modules={[Pagination, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
              className="w-full h-full rounded-2xl"
            >
              {displayImages.map((imgUrl, idx) => (
                <SwiperSlide key={`modal-${imgUrl}-${idx}`} className="bg-white flex items-center justify-center select-none w-full h-full p-4">
                  <div 
                    className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setIsZoomed(false)}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full max-h-90 object-contain mx-auto"
                    />

                    {isZoomed && (
                      <div 
                        className="absolute border border-neutral-400 bg-white/20 pointer-events-none shadow-md shadow-black/10"
                        style={{
                          width: "100px",
                          height: "100px",
                          left: `${lensPos.x}px`,
                          top: `${lensPos.y}px`
                        }}
                      />
                    )}

                    {isZoomed && (
                      <div 
                        className="absolute inset-0 z-40 border border-neutral-300 bg-white shadow-xl pointer-events-none rounded-2xl"
                        style={{
                          backgroundImage: `url(${imgUrl})`,
                          backgroundSize: "250%",
                          backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                          backgroundRepeat: "no-repeat"
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {displayImages.length > 1 && (
            <div className="grid grid-cols-6 gap-2 max-h-35 overflow-y-auto pt-1">
              {displayImages.map((imgUrl, idx) => (
                <button
                  key={`thumb-${idx}`}
                  type="button"
                  onClick={() => handleThumbnailClick(idx)}
                  className={`aspect-square border rounded-md p-1 bg-white overflow-hidden transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx 
                      ? "border-black ring-1 ring-black scale-95" 
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img src={imgUrl} alt={`thumbnail-${idx}`} className="w-full h-full object-contain mx-auto" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information Panel */}
        <div className="flex-1 flex flex-col justify-start text-left pt-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
            {product?.category?.name}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">
            {product.name}
          </h2> 

          <div className="flex items-center gap-3 text-lg md:text-xl font-bold mb-4">
            {numericOriginalPrice > 0 && (
              <span className="text-neutral-400 line-through font-normal">
                ৳{numericOriginalPrice.toFixed(0)}
              </span>
            )}
            <span className="text-[#ea4c3b]">
              ৳{numericPrice.toFixed(0)}
            </span>
          </div>

          <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-6 font-normal max-w-md">
            {product.description || "Classic and comfortable premium product built for daily lifestyle and active sports durability."}
          </p>

          <div className="space-y-4 mb-6">
            {/* MODAL SIZE SELECTOR */}
            {modalAvailableSizes.length > 0 && (
              <div>
                <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                  Size: <span className="text-neutral-400 font-normal ml-1">{currentSizeToShow || "Select yours"}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {modalAvailableSizes.map((size) => {
                    const isSelected = currentSizeToShow === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setUserSelectedSize(size)}
                        className={`h-9 min-w-9 px-3 rounded-md text-xs font-semibold uppercase transition-all duration-150 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-black text-white border border-black ring-1 ring-black"
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

            {/* MODAL COLOR SELECTOR */}
            {availableColors.length > 0 && (
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
                        onClick={() => setUserSelectedColor(colorObj.name)}
                        style={{ backgroundColor: colorObj.code }}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 relative ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-neutral-900 scale-110 z-10"
                            : "border border-neutral-200"
                        }`}
                        title={colorObj.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* QUANTITY SELECTOR */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-neutral-200 rounded bg-white h-8 overflow-hidden">
              <button
                type="button"
                onClick={decrementQty}
                className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-sm border-r border-neutral-200"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-semibold select-none text-neutral-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-sm border-l border-neutral-200"
              >
                +
              </button>
            </div>
          </div>

          {/* SIZE & CARE GUIDE */}
          <div className="flex gap-5 text-xs font-medium text-neutral-800 mb-4 select-none">
            <button type="button" className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0">
              <svg className="w-4 h-4 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v6H3z"/><path d="M6 9v3M9 9v2M12 9v3M15 9v2M18 9v3"/></svg>
              Size guide
            </button>
            <button type="button" className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0">
              <svg className="w-4 h-4 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14l1 7H4z"/><path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 14h6"/></svg>
              Care guide
            </button>
          </div>

          {/* LIVE TRACKING DATA BOX */}
          <div className="border border-neutral-300 rounded-2xs p-3 bg-white text-xs text-neutral-900 space-y-2.5 mb-5 max-w-md w-full font-normal">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-sm select-none">🗹</span>
              <span><strong>Viewed:</strong> 232 people recently VIEWED this product.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-bold text-sm select-none">🔥</span>
              <span><strong>Popular:</strong> 5 people have BOUGHT this product.</span>
            </div>
          </div>

          {/* DYNAMIC BUTTONS BLOCK */}
          <div className="space-y-2 w-full max-w-md mt-auto">
            {!currentSizeToShow ? (
              <button
                type="button"
                className="w-full bg-black text-white font-medium text-sm py-3 rounded transition-colors cursor-pointer"
                onClick={() => toast.error("Please select a size first!")}
              >
                Select Size
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="bg-black cursor-pointer hover:bg-neutral-900 text-white font-medium text-sm py-3 rounded transition-all flex items-center justify-center gap-1.5"
                  onClick={() => handleAction('buy_now')}
                >
                  Buy Now <span className="text-xs">❯</span>
                </button>
                <button
                  type="button"
                  className="bg-white cursor-pointer hover:bg-neutral-900 text-black border hover:text-white border-black font-medium text-sm py-3 rounded transition-all flex items-center justify-center gap-1.5"
                  onClick={() => handleAction('cart')}
                >
                  Add To Cart <FiShoppingBag className="w-4 h-4 mb-0.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleWishlistClick}
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