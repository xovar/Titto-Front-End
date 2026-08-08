import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Redux Thunk
import { fetchBanners } from "../../store/features/banner/bannerSlice"; // আপনার স্লাইসের সঠিক পাথ দিয়ে রিপ্লেস করুন

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const dispatch = useDispatch();

  // Redux Store থেকে Banners ফেচ করা
  const { items: banners = [] } = useSelector(
    (state) => state.banner || state.banners || {}
  );

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // 🟢 ১. ডাটা ফিল্টারিং (is_active চেক সহ)
  const activeBanners = banners.filter(
    (b) => b.is_active === undefined || b.is_active === 1 || b.is_active === true
  );

  // HERO_MAIN_SLIDE ফিল্টার
  const mainSlides = activeBanners.filter(
    (b) => b.placement === "HERO_MAIN_SLIDE"
  );

  // HERO_TOP_RIGHT ফিল্টার
  const topRightBanner = activeBanners.find(
    (b) => b.placement === "HERO_TOP_RIGHT"
  );

  // HERO_BOTTOM_RIGHT ফিল্টার
  const bottomRightBanner = activeBanners.find(
    (b) => b.placement === "HERO_BOTTOM_RIGHT"
  );

  // Safe Image Extraction Helper Function
  const getImage = (banner, fallback) => {
    if (!banner) return fallback;
    let img = banner.images || banner.imageUrl || banner.image;
    if (typeof img === "string") {
      try {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch (e) {
        return e;
      }
    }
    if (Array.isArray(img) && img.length > 0) return img[0];
    return fallback;
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 lg:px-8 py-6">
      {/* Main Grid: 3 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* =========================================================
            LEFT SIDE: MAIN SWIPER SLIDER (HERO_MAIN_SLIDE ONLY)
           ========================================================= */}
        <div className="lg:col-span-2 relative h-87.5 sm:h-105 md:h-120 overflow-hidden group rounded-xl">
          
          {/* Custom Navigation Circular Arrows */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-neutral-200 slider-prev cursor-pointer">
            <FaChevronLeft size={14} />
          </button>
          
          <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-neutral-200 slider-next cursor-pointer">
            <FaChevronRight size={14} />
          </button>

          {mainSlides.length > 0 ? (
            <Swiper
              modules={[Navigation, Autoplay, EffectFade]}
              effect="fade"
              loop={mainSlides.length > 1}
              navigation={{
                prevEl: ".slider-prev",
                nextEl: ".slider-next",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              className="w-full h-full"
            >
              {mainSlides.map((slide) => {
                const imageUrl = getImage(slide, "");
                return (
                  <SwiperSlide key={slide.id || slide._id}>
                    <div className="relative w-full h-full select-none">
                      
                      {/* Banner Image */}
                      <img 
                        src={imageUrl} 
                        alt={slide.title} 
                        className="w-full h-full object-cover object-center"
                      />
                      
                      {/* Vignette Layer */}
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 text-white">
                        <h2 className="font-poppins font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-normal leading-tight max-w-2xl whitespace-pre-line drop-shadow-md">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="mt-2 text-sm sm:text-base text-gray-200 max-w-lg line-clamp-2">
                            {slide.subtitle}
                          </p>
                        )}
                        <Link 
                          to={slide.link || "/shop"}
                          className="mt-6 font-inter font-bold text-sm uppercase bg-[#1a1a1a] hover:bg-red-600 hover:scale-105 text-white py-3 px-8 rounded-full transition-all duration-300 tracking-wide inline-block"
                        >
                          Shop Now
                        </Link>
                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            // Skeleton / Placeholder if no HERO_MAIN_SLIDE exists
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
              <span className="text-gray-400 text-sm">Loading Main Slides...</span>
            </div>
          )}
        </div>

        {/* =========================================================
            RIGHT SIDE: STACKED BANNER LAYOUTS
           ========================================================= */}
        <div className="flex flex-col gap-4 h-120 lg:h-auto">
          
          {/* Top Promo Banner - HERO_TOP_RIGHT */}
          <div className="flex-1 bg-[#f4f5f7] relative overflow-hidden flex items-center px-8 group/side rounded-xl">
            <div className="z-10 max-w-[48%] text-left ">
              <h3 className="font-poppins font-bold text-xl sm:text-2xl text-neutral-800 leading-snug">
                {topRightBanner?.title || "New Sneakers"}
              </h3>
              {topRightBanner?.subtitle && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {topRightBanner.subtitle}
                </p>
              )}
              <Link 
                to={`/product/${topRightBanner?.link}`}
                className="mt-4 font-inter font-bold text-xs uppercase bg-transparent hover:bg-red-500 hover:text-white text-red-500 py-2.5 px-6 rounded-full shadow-sm transition-all duration-300 border border-solid border-red-500 cursor-pointer inline-block"
              >
                Shop Now
              </Link>
            </div>
            
            {/* RIGHT SIDE COVERED IMAGE */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <img 
                src={getImage(topRightBanner, "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop")} 
                alt={topRightBanner?.title || "Top Promo Banner"} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/side:scale-105"
              />
            </div>
          </div>

          {/* Bottom Promo Banner - HERO_BOTTOM_RIGHT */}
          <div className="flex-1 bg-[#1a233d] relative overflow-hidden flex items-center px-8 group/side rounded-xl">
            
            {/* Absolute Tag */}
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-red-500 text-white flex flex-col items-center justify-center font-poppins font-bold text-xs shadow-md z-20">
              PROMO
            </div>

            <div className="z-10 max-w-[48%] text-left text-white">
              <h3 className="font-poppins font-bold text-lg sm:text-xl text-neutral-100 leading-snug">
                {bottomRightBanner?.title || "Wireless Earbuds"}
              </h3>
              {bottomRightBanner?.subtitle && (
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                  {bottomRightBanner.subtitle}
                </p>
              )}
              <Link 
                to={bottomRightBanner?.link || "/shop"}
                className="mt-4 font-inter font-bold text-xs uppercase bg-red-500 hover:bg-transparent border border-red-500 hover:text-red-500 cursor-pointer text-white py-2.5 px-6 rounded-full transition-all duration-300 inline-block"
              >
                Shop Now
              </Link>
            </div>
            
            {/* RIGHT SIDE COVERED IMAGE */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <img 
                src={getImage(bottomRightBanner, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop")} 
                alt={bottomRightBanner?.title || "Bottom Promo Banner"} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/side:scale-105"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}