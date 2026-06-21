import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {
  FaHeart,
  FaShoppingCart,
  FaExchangeAlt,
  FaRandom,
} from "react-icons/fa";

// Import Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

const products = [
  {
    id: 1,
    name: "Leather Mens Slipper",
    category: "Men/Women",
    minPrice: 100.0,
    maxPrice: 240.0,
    discount: "-10%",
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 2,
    name: "Quickiin Mens shoes",
    category: "Men/Women",
    minPrice: 140.0,
    maxPrice: null,
    discount: null,
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 3,
    name: "Rexpo Womens shoes",
    category: "Men/Women",
    minPrice: 60.0,
    maxPrice: 260.0,
    discount: "-10%",
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 4,
    name: "Hollister V-Neck Knit",
    category: "Men/Women",
    minPrice: 880.0,
    maxPrice: null,
    discount: null,
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 5,
    name: "Primitive Mens shoes",
    category: "Men/Women",
    minPrice: 40.0,
    maxPrice: 280.0,
    discount: null,
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 6,
    name: "Simple Fabric Shoe",
    category: "Men/Women",
    minPrice: 400.0,
    maxPrice: 580.0,
    discount: "-10%",
    image:
      "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
];

export default function BestSeller() {
  return (
    <div className="w-full bg-white py-16 px-4 md:px-12 lg:px-16 font-sans select-none">
      <div className="max-w-360 mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Best Seller
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Tried, tested, and trending.
          </p>
        </div>

        {/* SWIPER CAROUSEL WRAPPER */}
        <div className="relative group/slider px-2">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            // --- HERE IS THE 2 SECOND AUTOPLAY CONFIGURATION ---
            autoplay={{
              delay: 2000,
              disableOnInteraction: false, // Keeps sliding even if user clicks or swipes
              pauseOnMouseEnter: true, // Optional: Pauses when hovering over a card
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full py-4"
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product.id}-${index}`}>
                <div className="flex flex-col text-left group bg-white cursor-pointer h-full">
                  {/* Product Image Card Container Box */}
                  <div className="w-full h-72 border border-neutral-200/80 rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden group-hover:border-neutral-300 transition-colors duration-300">
                    {/* Red Discount Tag */}
                    {product.discount && (
                      <span className="absolute z-10 top-4 left-4 bg-red-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-sm tracking-wide shadow-xs">
                        {product.discount}
                      </span>
                    )}

                    {/* Main Product Image Asset */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain z-0 group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* VERTICAL ACTION UTILITIES DRAWER */}
                    <div className="absolute right-3 top-4 flex flex-col gap-1 z-20 transition-all duration-300 ease-out opacity-100 translate-x-0 md:opacity-0 md:translate-x-3 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                      <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                        <FaHeart size={12} />
                      </button>
                      <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                        <FaShoppingCart size={12} />
                      </button>
                      <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                        <FaExchangeAlt size={12} />
                      </button>
                      <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                        <FaRandom size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata Info Block */}
                  <div className="pt-4 px-1 flex flex-col">
                    <span className="text-[11px] font-medium text-neutral-400 tracking-wide mb-1">
                      {product.category}
                    </span>

                    <h3 className="text-[15px] font-bold text-neutral-800 tracking-tight transition-colors duration-200 mb-1.5 truncate">
                      {product.name}
                    </h3>

                    {/* Price Label */}
                    <div className="text-sm font-medium text-neutral-500">
                      {product.maxPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-neutral-400">
                            ${product.minPrice.toFixed(2)}
                          </span>
                          <span className="text-neutral-600">
                            - ${product.maxPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-neutral-800">
                          ${product.minPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* SEE MORE BUTTON */}
      <div className="mt-12 flex justify-center">
        <button className="btn btn-outline btn-error hover:text-white hover:bg-red-500 rounded-none px-8">
          SEE MORE
        </button>
      </div>
    </div>
  );
}
