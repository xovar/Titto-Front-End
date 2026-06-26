import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { 
  FiHeart, 
  FiShoppingCart, 
  FiChevronLeft, 
  FiChevronRight, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiRefreshCw, 
  FiMinus, 
  FiPlus,
  FiChevronDown
} from "react-icons/fi";
import { toast } from "react-toastify";

// Swiper slider core components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode, A11y } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
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
};

export default function SingleProductDetail() {
  const location = useLocation();
  const { id } = useParams();
  
  // State initialization 
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Fallback API / Database fetch if user refreshes the page directly
  useEffect(() => {
    if (!product && id) {
      setLoading(true);
      // Replace this block with your actual API endpoint request
      // fetch(`/api/products/${id}`)
      //   .then(res => res.json())
      //   .then(data => { setProduct(data); setLoading(false); })
      //   .catch(() => setLoading(false));
      
      setLoading(false); // Remove this line once your real fetch is implemented
    }
  }, [id, product]);

  // Dynamic variants variations safely configuration parameters
  const availableSizes = product?.sizes?.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  const availableColors = product?.colors?.length > 0 ? product.colors : ["Black", "White", "Gray"];

  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  // Sync variant parameters if the active routing selection target product updates
  useEffect(() => {
    if (product) {
      setSelectedSize(availableSizes[0]);
      setSelectedColor(availableColors[0]);
    }
  }, [product, availableSizes, availableColors]);

  if (loading) {
    return <div className="p-16 text-center text-neutral-500">Loading secure product assets...</div>;
  }

  if (!product) {
    return (
      <div className="p-16 text-center text-neutral-500 bg-neutral-50 rounded-2xl max-w-md mx-auto my-12 border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-800 mb-1">Product Details Not Available</h2>
        <p className="text-xs text-neutral-400 mb-4">Could not parse data for configuration parameters (ID: {id}).</p>
        <a href="/" className="inline-block px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">
          Return To Shop Listings
        </a>
      </div>
    );
  }

  const activeColorKey = selectedColor?.toLowerCase();
  const displayImages = 
    product.colorImages?.[activeColorKey] || 
    product.images || 
    [product.image || "https://via.placeholder.com/600x600?text=Product+Image"];

  const handleAddToCart = () => {
    toast.success(
      <div className="flex flex-col gap-0.5 text-left">
        <span className="font-extrabold text-neutral-900 tracking-tight text-sm">Secured! ⚡</span>
        <span className="text-xs text-neutral-500">
          {quantity}x <strong className="text-neutral-800">{product.title}</strong> ({selectedColor} / {selectedSize}) added to your bag.
        </span>
      </div>,
      { position: "bottom-right", autoClose: 3500, theme: "light" }
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-16 bg-white selection:bg-red-100 selection:text-[#ea4c3b]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        
        {/* LEFT COLUMN: VISUAL GALLERY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-square bg-neutral-50 border border-neutral-100 rounded-2xl relative overflow-hidden group/gallery">
            {product.discount && (
              <span className="absolute top-4 left-4 bg-[#ea4c3b] text-white text-xs font-bold px-2.5 py-1 rounded-md z-10 shadow-sm">
                -{product.discount}% OFF
              </span>
            )}

            <Swiper
              key={`gallery-${product.id}-${selectedColor}`}
              style={{
                "--swiper-navigation-color": "#2c2c2e",
                "--swiper-pagination-color": "#ea4c3b",
              }}
              spaceBetween={10}
              navigation={{ nextEl: ".gallery-next", prevEl: ".gallery-prev" }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[FreeMode, Navigation, Thumbs, Pagination, A11y]}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="w-full h-full rounded-2xl"
            >
              {displayImages.map((imgUrl, idx) => (
                <SwiperSlide key={`main-slide-${idx}`} className="flex items-center justify-center bg-white p-6 md:p-12 select-none">
                  <img 
                    src={imgUrl} 
                    alt={`${product.title} perspective ${idx + 1}`} 
                    className="w-full h-full object-contain max-h-[500px]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {displayImages.length > 1 && (
              <>
                <button type="button" className="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-xs opacity-0 group-hover/gallery:opacity-100 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer">
                  <FiChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <button type="button" className="gallery-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-xs opacity-0 group-hover/gallery:opacity-100 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer">
                  <FiChevronRight className="w-5 h-5 stroke-[2.2]" />
                </button>
              </>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="w-full mt-2">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-slider"
              >
                {displayImages.map((imgUrl, idx) => (
                  <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer rounded-xl border border-neutral-200 p-2 bg-white aspect-square flex items-center justify-center transition-all opacity-60 [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-neutral-900">
                    <img src={imgUrl} alt="Thumbnail preview" className="max-h-full object-contain max-w-full" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS */}
        <div className="lg:col-span-5 flex flex-col text-left">
          <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-2">
            {product.category || "Premium Collection"}
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-none mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-4 h-4 fill-current stroke-[1.5]" />
              ))}
              <span className="text-xs text-neutral-700 font-bold ml-2">4.9</span>
            </div>
            <span className="text-xs text-neutral-400 font-medium">|</span>
            <span className="text-xs text-neutral-500 hover:underline cursor-pointer">128 verified customer reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-[#ea4c3b] tracking-tight">
              ${product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-neutral-400 line-through font-normal">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-xl">
            {product.description || "Crafted to elevate daily standards with lightweight premium composite integrations."}
          </p>

          <div className="space-y-6 mb-8 border-b border-neutral-100 pb-8">
            {/* COLOR MATRIX SELECTOR */}
            <div>
              <label className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-3">
                Color: <span className="text-neutral-400 font-normal ml-1 capitalize">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((colorName) => {
                  const normalized = colorName.toLowerCase();
                  const bgClass = COLOR_MAP[normalized] || "bg-neutral-300";
                  const isSelected = selectedColor === colorName;

                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setSelectedColor(colorName)}
                      className={`w-7 h-7 rounded-full ${bgClass} cursor-pointer transition-all duration-200 hover:scale-110 relative ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-neutral-900 scale-105"
                          : "border border-neutral-200"
                      }`}
                      title={colorName}
                      aria-label={`Select ${colorName}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* SIZE MATRIX SELECTOR */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                  Size: <span className="text-neutral-400 font-normal ml-1">{selectedSize}</span>
                </label>
                <button type="button" className="text-xs text-neutral-500 underline hover:text-[#ea4c3b] cursor-pointer">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-[44px] px-3 rounded-xl text-xs font-bold uppercase transition-all duration-150 cursor-pointer flex items-center justify-center border ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN TRANSACTION CONTROL BAR */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-neutral-200 rounded-xl h-14 bg-neutral-50 px-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <FiMinus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-neutral-800 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest h-14 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
            >
              <FiShoppingCart className="w-4 h-4" />
              Add To Cart — ${(product.price * quantity).toFixed(2)}
            </button>

            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-14 h-14 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted 
                  ? "border-red-100 bg-red-50 text-[#ea4c3b]" 
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
              }`}
              aria-label="Save to list"
            >
              <FiHeart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* VALUE ASSURANCE BADGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-neutral-100 rounded-2xl bg-neutral-50/50 mb-8">
            <div className="flex items-center gap-3 text-neutral-600">
              <FiTruck className="w-4 h-4 text-[#ea4c3b] shrink-0" />
              <span className="text-xs font-medium text-neutral-700">Free priority dispatch</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <FiShield className="w-4 h-4 text-[#ea4c3b] shrink-0" />
              <span className="text-xs font-medium text-neutral-700">2-year legal coverage</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <FiRefreshCw className="w-4 h-4 text-[#ea4c3b] shrink-0" />
              <span className="text-xs font-medium text-neutral-700">30-day simple swap</span>
            </div>
          </div>

          {/* EXPANDABLE ACCORDIONS */}
          <div className="border-t border-neutral-100 divide-y divide-neutral-100 text-sm">
            {["description", "specifications", "shipping"].map((tabName) => (
              <div key={tabName} className="py-4">
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === tabName ? "" : tabName)}
                  className="w-full flex justify-between items-center font-bold text-neutral-800 uppercase tracking-wider text-xs cursor-pointer text-left"
                >
                  <span>{tabName}</span>
                  <FiChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${activeTab === tabName ? "rotate-180 text-neutral-800" : ""}`} />
                </button>
                {activeTab === tabName && (
                  <div className="mt-3 text-neutral-500 leading-relaxed text-xs transition-all">
                    {tabName === "description" && (product.longDescription || "This is a detailed overview of materials.")}
                    {tabName === "specifications" && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Premium structural composition</li>
                        <li>Water resistant treatment (IPX4 rating)</li>
                        <li>Locally sourced responsible materials</li>
                        <li>Weight parameter: 340g lightweight profile</li>
                      </ul>
                    )}
                    {tabName === "shipping" && "Standard ground tracking orders deliver within 3–5 structural business cycles."}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}