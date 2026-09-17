
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart, MdShoppingBag } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ⚠️ আপনার প্রজেক্ট অনুযায়ী cartSlice-এর সঠিক পাথ দিন
import { addToCart } from "../../store/features/cart/cartSlice"; 
import { useMemo } from "react";

export default function TopSellingProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ১. Redux Store থেকে প্রোডাক্টস ও লোডিং স্টেট নেওয়া
  const { items: products, loading } = useSelector((state) => state.products || { items: [] });

  // ২. DB Schema-র sold & viewed ফিল্ডের ওপর ভিত্তি করে Top Selling ફિલ્ટર
  const topProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // আসল ডাটাবেজ ফিল্ড `sold` অথবা `viewed` অনুযায়ী সর্বোচ্চ বিক্রি হওয়া প্রোডাক্ট সাজানো
    const sortedProducts = [...products].sort((a, b) => {
      const soldA = Number(a.sold) || 0;
      const soldB = Number(b.sold) || 0;

      if (soldB !== soldA) {
        return soldB - soldA; // বেশি sold ডাটা আগে আসবে
      }

      // sold সমান বা ০ হলে viewed দিয়ে ফিল্টার
      const viewedA = Number(a.viewed) || 0;
      const viewedB = Number(b.viewed) || 0;
      return viewedB - viewedA;
    });

    // প্রথম ৪টি প্রোডাক্ট দেখাবে
    return sortedProducts.slice(0, 4);
  }, [products]);

  // ৩. কন্ট্রোলারের রেসপন্স থেকে ইমেজ ইউআরএল বের করা (JSON parsed images)
  const getProductImage = (product) => {
    const variantImage = product?.variants?.[0]?.images?.[0];
    const mainImage = product?.images?.[0];
    const singleImage = product?.image || product?.imgUrl;

    let rawImg = variantImage || mainImage || singleImage;

    if (typeof rawImg === "object" && rawImg !== null) {
      rawImg = rawImg.url || rawImg.src || rawImg.secure_url;
    }

    return rawImg || "https://via.placeholder.com/200?text=No+Image";
  };

  // ৪. প্রাইজ এবং ডিসকাউন্ট ক্যালকুলেশন
  const getProductPricing = (product) => {
    const numericOriginalPrice = Number(product?.price) || 0;
    const discountPercent = Number(product?.discount) || 0;
    const numericPrice =
      discountPercent > 0
        ? Number((numericOriginalPrice * (1 - discountPercent / 100)).toFixed(0))
        : numericOriginalPrice;

    return { numericOriginalPrice, discountPercent, numericPrice };
  };

  // ⚡ Add To Cart Handler
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const firstVariant = product?.variants?.[0];
    const firstSize = firstVariant?.sizes?.[0];

    const selectedColor = firstVariant?.color?.name || "Default";
    const selectedSize = firstSize?.size || "N/A";
    const selectedSku = firstSize?.sku || "";
    const { numericPrice } = getProductPricing(product);

    const itemToCart = {
      id: product.id,
      product_id: product.id,
      variant_id: firstVariant?.id || null,
      sku: selectedSku,
      name: product.name,
      image: getProductImage(product),
      price: numericPrice,
      originalPrice: Number(product.price) || numericPrice,
      quantity: 1,
      discount: product.discount || 0,
      size: selectedSize,
      color: selectedColor,
      product: product
    };

    dispatch(addToCart(itemToCart));

    toast.success(
      <div className="flex flex-col gap-0.5 text-left">
        <span className="font-extrabold text-neutral-900 tracking-tight text-sm">
          Added to Bag! ⚡
        </span>
        <span className="text-xs text-neutral-500 leading-normal">
          1x <strong className="text-neutral-800 font-semibold">{itemToCart.name}</strong> added to cart.
        </span>
      </div>,
      { position: "bottom-right", autoClose: 3000 }
    );
  };

  // ⚡ Buy Now Handler
  const handleBuyNow = (e, product) => {
    e.stopPropagation();

    const firstVariant = product?.variants?.[0];
    const firstSize = firstVariant?.sizes?.[0];

    const selectedColor = firstVariant?.color?.name || "Default";
    const selectedSize = firstSize?.size || "N/A";
    const selectedSku = firstSize?.sku || "";
    const { numericPrice } = getProductPricing(product);

    const itemToCheckout = {
      id: product.id,
      product_id: product.id,
      variant_id: firstVariant?.id || null,
      sku: selectedSku,
      name: product.name,
      image: getProductImage(product),
      price: numericPrice,
      quantity: 1,
      discount: product.discount || 0,
      size: selectedSize,
      color: selectedColor,
    };

    dispatch(addToCart(itemToCheckout));
    navigate("/checkout", { state: { checkoutItem: itemToCheckout } });
  };

  if (loading) {
    return (
      <div className="w-full py-16 text-center text-neutral-500">
        Loading Top Selling Products...
      </div>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 px-4 lg:px-8 font-sans select-none">
      <div className="max-w-360 mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Top Selling Products
          </h2>
          <div className="w-16 h-1 bg-red-500 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topProducts.map((product) => {
            const title = product.name;
            const imageUrl = getProductImage(product);
            const { numericOriginalPrice, discountPercent, numericPrice } = getProductPricing(product);

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 flex items-center gap-4 sm:gap-6 shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
              >
                {/* Top / Best Selling Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs z-10">
                  <FaFire size={11} />
                  Top Selling
                </div>

                {/* Product Image */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl p-2 flex items-center justify-center overflow-hidden ">
                  <img
                    src={imageUrl}
                    alt={title || "Product"}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
                    {product.brand?.name || product.category?.name || "Premium Collection"}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-neutral-800 truncate mb-1 group-hover:text-red-500 transition-colors">
                    {title}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-4">
                    {discountPercent > 0 && (
                      <span className="text-xs sm:text-sm text-neutral-400 font-bold line-through">
                        ৳{numericOriginalPrice.toLocaleString()}
                      </span>
                    )}

                    <span className="text-lg sm:text-xl font-bold text-neutral-900">
                      ৳{numericPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className="border border-neutral-300 text-neutral-800 hover:bg-neutral-900 hover:text-white font-bold px-3 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <MdOutlineShoppingCart size={16} />
                      Add To Cart
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleBuyNow(e, product)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-red-500/20 flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <MdShoppingBag size={16} />
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}