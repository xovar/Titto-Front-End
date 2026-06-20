import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const mainSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1200&auto=format&fit=crop",
    title: "Calzature LOUIS VUITTON\nSneaker Archlight",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    title: "Titto Exclusive\nRed Retro Force",
  }
];

export default function HeroSection() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
      

      {/* Main Grid: 3 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* =========================================================
           LEFT SIDE: MAIN SWIPER SLIDER (Spans 2 columns)
           ========================================================= */}
        <div className="lg:col-span-2 relative h-[350px] sm:h-[420px] md:h-[480px] overflow-hidden group">
          
          {/* Custom Navigation Circular Arrows (Only show on hover) */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-neutral-200 slider-prev">
            <FaChevronLeft size={14} />
          </button>
          
          <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-neutral-200 slider-next">
            <FaChevronRight size={14} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            effect="fade"
            loop={true}
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
            {mainSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full select-none">
                  
                  {/* FULLY COVERED IMAGE RENDERING */}
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Vignette Layer */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Centered Typography Elements */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 text-white">
                    <h2 className="font-poppins font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-normal leading-tight max-w-2xl whitespace-pre-line drop-shadow-md">
                      {slide.title}
                    </h2>
                    <button className="mt-6 font-inter font-bold text-sm uppercase bg-[#1a1a1a] hover:bg-red-600 hover:scale-105 text-white py-3 px-8 rounded-full transition-all duration-300 tracking-wide">
                      Shop Now
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* =========================================================
           RIGHT SIDE: STACKED BANNER LAYOUTS
           ========================================================= */}
        <div className="flex flex-col gap-4 h-[480px] lg:h-auto">
          
          {/* Top Promo Banner - Running of Nature */}
          <div className="flex-1 bg-[#f4f5f7] relative overflow-hidden flex items-center px-8 group/side">
            <div className="z-10 max-w-[55%] text-left">
              <h3 className="font-poppins font-bold text-xl sm:text-2xl text-neutral-800 leading-snug">
                Running <br />of Nature
              </h3>
              <button className="mt-4 font-inter font-bold text-xs uppercase bg-transparent hover:bg-red-500 hover:text-white text-red-500 py-2.5 px-6 rounded-full shadow-sm transition-all duration-300 border border-solid border-red-500 cursor-pointer">
                Shop Now
              </button>
            </div>
            
            {/* RIGHT SIDE COVERED IMAGE */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <img 
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop" 
                alt="Running Style" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/side:scale-105"
              />
            </div>
          </div>

          {/* Bottom Promo Banner - Blue Adidas Saving */}
          <div className="flex-1 bg-[#1a233d] relative overflow-hidden flex items-center px-8 group/side">
            
            {/* Absolute -20% Pill Tag */}
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-red-500 text-white flex flex-col items-center justify-center font-poppins font-bold text-sm shadow-md z-20">
              -20%
            </div>

            <div className="z-10 max-w-[55%] text-left text-white">
              <h3 className="font-poppins font-normal text-lg sm:text-xl text-neutral-200 leading-snug">
                Blue Adidas <br />
                <span className="font-extrabold text-white">Saving $120</span>
              </h3>
              <button className="mt-4 font-inter font-bold text-xs uppercase bg-red-500 hover:bg-transparent border border-red-500 hover:text-red-500 cursor-pointer hover:border-solid text-red py-2.5 px-6 rounded-full transition-all duration-300">
                Shop Now
              </button>
            </div>
            
            {/* RIGHT SIDE COVERED IMAGE */}
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <img 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop" 
                alt="Adidas Yellow Sneaker" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/side:scale-105"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}