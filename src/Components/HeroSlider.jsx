import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// Import standard arrow icons directly
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import tittoImg from "../assets/Gemini_Generated_Image_que993que993que9.png"

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: tittoImg,
    subtitle: "New Arrival",
    title: "Urban Streetwear Collection",
    ctaText: "Shop Men",
    ctaLink: "/men",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    subtitle: "Trending Now",
    title: "Exclusive Women's Line",
    ctaText: "Shop Women",
    ctaLink: "/women",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop",
    subtitle: "Limited Time",
    title: "Up to 50% Off Select Sneakers",
    ctaText: "View Products",
    ctaLink: "/products",
  },
];

export default function HeroSlider() {
  return (
    <div className="w-full mt-10 h-[60vh] min-h-[400px] lg:h-[70vh] bg-black relative group">
      
      <style>{`
        /* Custom Pagination Dot Adjustments */
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #ef4444;
          opacity: 1;
          width: 32px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
        }

        /* --- Content Entrance Animations --- */
        .swiper-slide .slide-subtitle,
        .swiper-slide .slide-title,
        .swiper-slide .slide-btn {
          opacity: 0;
          transform: translateY(40px);
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease;
        }

        .swiper-slide-active .slide-subtitle { opacity: 1; transform: translateY(0); transition-delay: 0.3s; }
        .swiper-slide-active .slide-title { opacity: 1; transform: translateY(0); transition-delay: 0.5s; }
        .swiper-slide-active .slide-btn { opacity: 1; transform: translateY(0); transition-delay: 0.7s; }
      `}</style>

      {/* Custom Navigation Trigger Buttons 
        - These are fully visible by default and switch to a red theme on hover.
      */}
      <button className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-red-500 text-white p-3 rounded-lg transition-all duration-300 focus:outline-none">
        <FaChevronLeft size={22} />
      </button>
      
      <button className="custom-next absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-red-500 text-white p-3 rounded-lg transition-all duration-300 focus:outline-none">
        <FaChevronRight size={22} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop={true}
        pagination={{ clickable: true }}
        // Explicitly linking Swiper navigation to our custom HTML elements
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white z-10">
                <p className="slide-subtitle text-lg md:text-xl font-bold uppercase tracking-[0.2em] mb-4 text-red-500 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <h1 className="slide-title text-4xl md:text-6xl font-extrabold uppercase mb-8 drop-shadow-lg max-w-4xl">
                  {slide.title}
                </h1>
                <div className="slide-btn">
                  <Link
                    to={slide.ctaLink}
                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-extrabold uppercase py-3 px-8 transition-colors duration-300 tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}