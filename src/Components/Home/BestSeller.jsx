import { FaHeart, FaShoppingCart, FaExchangeAlt, FaRandom } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Leather Mens Slipper",
    category: "Men/Women",
    minPrice: 100.0,
    maxPrice: 240.0,
    discount: "-10%",
    image: "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 2,
    name: "Quickiin Mens shoes",
    category: "Men/Women",
    minPrice: 140.0,
    maxPrice: null,
    discount: null,
    image: "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 3,
    name: "Rexpo Womens shoes",
    category: "Men/Women",
    minPrice: 60.0,
    maxPrice: 260.0,
    discount: "-10%",
    image: "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  },
  {
    id: 4,
    name: "Hollister V-Neck Knit",
    category: "Men/Women",
    minPrice: 880.0,
    maxPrice: null,
    discount: null,
    image: "https://htmldemo.net/shome/shome/assets/img/shop/product-single/1.webp",
  }
];

export default function BestSeller() {
  return (
    <div className="w-full bg-white py-16 px-4 md:px-12 lg:px-16 font-sans select-none cursor-pointer">
      <div className="max-w-360 mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            BEST SELLER
          </h2>
        </div>

        {/* RESPONSIVE GRID LAYOUT (1 Col on mobile, 2 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col text-left group bg-white">
              
              {/* Product Image Card Container Box */}
              <div className="w-full h-72 border border-neutral-200/80 rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden group-hover:border-neutral-300 transition-colors duration-300">
                
                {/* Red Discount Tag */}
                {product.discount && (
                  <span className="absolute z-2 top-4 left-4 bg-red-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-sm tracking-wide shadow-xs">
                    {product.discount}
                  </span>
                )}

                {/* Main Product Image Asset */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain z-0 group-hover:scale-102 transition-transform duration-500"
                />

                {/* VERTICAL ACTION UTILITIES DRAWER (Slides in gracefully on hover) */}
                <div className="absolute right-3 top-4 flex flex-col gap-1 z-20 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                  <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                    <FaHeart size={12} />
                  </button>
                  <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                    <FaShoppingCart size={12} />
                  </button>
                  <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                    <FaExchangeAlt size={12} />
                  </button>
                  <button className="w-8 h-8 rounded-sm bg-white border border-neutral-200 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-500 flex items-center justify-center shadow-xs transition-colors duration-200">
                    <FaRandom size={12} />
                  </button>
                </div>

              </div>

              {/* Product Metadata Info Block */}
              <div className="pt-4 px-1 flex flex-col">
                <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1">
                  {product.category}
                </span>
                
                <h3 className="text-sm font-bold text-neutral-800 tracking-tight transition-colors duration-200 mb-1.5 truncate">
                  {product.name}
                </h3>

                {/* Price Label (Evaluates standard flat rate vs range layouts automatically) */}
                <div className="text-sm font-semibold text-neutral-500">
                  {product.maxPrice ? (
                    <div className="flex items-center gap-1">
                      <span className="line-through text-neutral-300 font-normal text-xs">
                        ${product.minPrice.toFixed(2)}
                      </span>
                      <span className="text-neutral-500">
                        ${product.minPrice.toFixed(2)} - ${product.maxPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-neutral-800">${product.minPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
      <div className="mt-12.5 flex justify-center">
        <button className="cursor-pointer border border-solid border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white transition px-4 py-2 uppercase font-bold"> See More </button>
      </div>
    </div>
  );
}