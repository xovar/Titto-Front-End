import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function WomensCollection() {
  const navigate = useNavigate();

  // ১. Redux Store থেকে প্রোডাক্ট ডাটা নিয়ে আসা
  const { items: products, loading } = useSelector((state) => state.products);

  // ২. Women ক্যাটাগরির প্রোডাক্ট ফিল্টারিং লজিক (Gender: 2 = Female)
  const womensProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // জেন্ডার ২ (Female) ফিল্টার করা
    return products.filter((product) => Number(product.gender) === 0);
  }, [products]);

  // লোডিং স্টেট হ্যান্ডলার
  if (loading) {
    return (
      <div className="w-full py-16 text-center text-neutral-500">
        Loading Women's Collection...
      </div>
    );
  }

  // ডাটা না থাকলে সেকশনটি হাইড রাখার হ্যান্ডলার
  if (!womensProducts || womensProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 px-4 md:px-12 lg:px-16 font-sans select-none">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Women's Collection
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Discover the latest trends and redefine your style statement.
          </p>
        </div>

        {/* PRODUCT GRID CONTAINER */}
        {/* grid-cols-1: মোবাইলে ১টি করে কার্ড দেখাবে */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {womensProducts.map((product) => {
            // প্রোডাক্ট ডাটা থেকে ইমেজ প্রসেস করা
            const displayImage =
              product.variants?.[0]?.images?.[0] ||
              product.images?.[0] ||
              "https://via.placeholder.com/300";

            // ডিসকাউন্ট ক্যালকুলেশন
            const hasDiscount = product.discount && Number(product.discount) > 0;
            const originalPrice = parseFloat(product.price);
            const discountedPrice = hasDiscount
              ? originalPrice - (originalPrice * parseFloat(product.discount)) / 100
              : originalPrice;

            // কার্ডে ক্লিক করার হ্যান্ডলার ফাংশন
            const handleCardClick = () => {
              navigate(`/product/${product.id}`);
            };

            return (
              <div
                key={product.id}
                onClick={handleCardClick}
                className="flex flex-col text-left group bg-white cursor-pointer h-full"
              >
                {/* Product Image Card Container Box */}
                <div className="w-full h-72 border border-neutral-200/80 rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden group-hover:border-neutral-300 transition-colors duration-300">
                  
                  {/* Discount Tag */}
                  {hasDiscount && (
                    <span className="absolute z-10 top-4 left-4 bg-red-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-sm tracking-wide shadow-xs">
                      -{product.discount}%
                    </span>
                  )}

                  {/* Main Product Image Asset */}
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-contain z-0 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Metadata Info Block */}
                <div className="pt-4 px-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-neutral-400 tracking-wide">
                      {product.category?.name || "Women"}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-neutral-800 tracking-tight transition-colors duration-200 mb-1.5 truncate">
                    {product.name}
                  </h3>

                  {/* Dynamic Price Calculation */}
                  <div className="text-sm font-medium text-neutral-500">
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-['Bangla'] text-neutral-800">
                          ৳{discountedPrice.toFixed(2)}
                        </span>
                        <span className="line-through font-['Bangla'] text-xs text-neutral-400">
                          ৳{originalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold font-['Bangla'] text-neutral-800">
                        ৳{originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEE MORE BUTTON */}
        <div className="mt-12 flex justify-center">
          <NavLink
            to="/women"
            className="btn btn-outline btn-error hover:text-white hover:bg-red-500 rounded-none px-8"
          >
            SEE MORE
          </NavLink>
        </div>
      </div>
    </div>
  );
}