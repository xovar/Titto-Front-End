import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../store/features/cart/cartSlice";
import { addToWishlist } from "../../store/features/wishList/wishListSlice";
import { FiX, FiHeart, FiShoppingBag } from "react-icons/fi";
import { LuRuler } from "react-icons/lu";
import { toast } from "react-toastify";
import axios from "axios";

// ─── 1. SUB-COMPONENT: IMAGE GALLERY WITH ZOOM ──────────────────────────────
const ImageGallery = ({ displayImages, activeImageIndex, setActiveImageIndex, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 100;
    let lensX = Math.max(0, Math.min(x - lensSize / 2, rect.width - lensSize));
    let lensY = Math.max(0, Math.min(y - lensSize / 2, rect.height - lensSize));

    setLensPos({ x: lensX, y: lensY });

    const percentX = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const percentY = Math.min(Math.max((y / rect.height) * 100, 0), 100);

    setZoomPos({ x: percentX, y: percentY });
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-4 relative">
      <div
        ref={imageContainerRef}
        className="w-full aspect-square md:h-100 bg-white border border-neutral-100 rounded-2xl relative overflow-hidden flex items-center justify-center select-none cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={currentImage}
          alt={productName || "Product view"}
          className={`w-full h-full max-h-90 object-contain p-4 transition-opacity duration-200 pointer-events-none ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`}
        />

        {isZoomed && currentImage && (
          <div
            className="absolute inset-0 z-30 bg-white pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `url("${currentImage}")`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        {isZoomed && (
          <div
            className="absolute border border-black/30 bg-black/5 rounded-full pointer-events-none z-40 shadow-sm"
            style={{
              width: "100px",
              height: "100px",
              left: `${lensPos.x}px`,
              top: `${lensPos.y}px`,
            }}
          />
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2 max-h-35 overflow-y-auto pt-1">
          {displayImages.map((imgUrl, idx) => (
            <button
              key={`thumb-${idx}`}
              type="button"
              onClick={() => {
                setActiveImageIndex(idx);
                setIsZoomed(false);
              }}
              className={`aspect-square border rounded-md p-1 bg-white overflow-hidden transition-all duration-200 cursor-pointer ${
                activeImageIndex === idx
                  ? "border-black ring-1 ring-black scale-95"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <img
                src={imgUrl}
                alt={`thumbnail-${idx}`}
                className="w-full h-full object-contain mx-auto"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 2. SUB-COMPONENT: SIZE GUIDE MODAL ──────────────────────────────────────
const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto border border-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h3 className="text-xl font-bold text-neutral-900">Size guide</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-black p-1 transition-colors cursor-pointer"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
          <div className="relative w-full h-44 sm:h-52 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
              alt="Style without compromise"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-4 text-right">
              <h4 className="text-white text-2xl font-black uppercase tracking-tight leading-none drop-shadow-md">
                Style <span className="text-red-500 font-light italic">without</span>
              </h4>
              <p className="text-white text-xl font-extrabold tracking-wider drop-shadow-md">
                COMPROMISE
              </p>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-md overflow-hidden">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#ff0000] text-white text-xs font-black uppercase tracking-wider">
                  <th className="py-2.5 px-2 border-r border-red-600">Titto SIZE</th>
                  <th className="py-2.5 px-2 border-r border-red-600">UK / LOCAL SIZE</th>
                  <th className="py-2.5 px-2">HEEL TO TOE (inches)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-neutral-800 divide-y divide-neutral-200">
                {[
                  { size: 39, local: 5, inches: "9.5" },
                  { size: 40, local: 6, inches: "9.8" },
                  { size: 41, local: 7, inches: "10" },
                  { size: 42, local: 8, inches: "10.3" },
                  { size: 43, local: 9, inches: "10.5" },
                  { size: 44, local: 10, inches: "10.9" },
                  { size: 45, local: 11, inches: "11.1" },
                ].map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50">
                    <td className="py-2 px-2 border-r border-neutral-200">{row.size}</td>
                    <td className="py-2 px-2 border-r border-neutral-200">{row.local}</td>
                    <td className="py-2 px-2">{row.inches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-center font-bold text-neutral-500 uppercase tracking-wide">
            <span className="text-red-500">N.B.</span> FOOT MEASUREMENT MAY VARY BY +/- 2MM
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── 3. MAIN COMPONENT: PRODUCT MODAL ───────────────────────────────────────
export default function ProductModal({
  product,
  isOpen,
  onClose,
  availableColors = [],
  onAddToCart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userSelectedColor, setUserSelectedColor] = useState("");
  const [userSelectedSize, setUserSelectedSize] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const selectedColor = userSelectedColor || availableColors[0]?.name || "";

  // 🔄 Active Variant Selection
  const activeVariant = useMemo(() => {
    const variants = product?.variants;
    if (!variants || !Array.isArray(variants)) return null;

    return (
      variants.find((v) => v?.color?.name === selectedColor) ||
      variants[0] ||
      null
    );
  }, [product, selectedColor]);

  // 📈 View Count API Patch
  useEffect(() => {
    if (product?.id) {
      axios
        .patch(`https://api.titto.com.bd/api/products/${product.id}/view`)
        .catch((err) => {
          console.warn("View tracking failed silently:", err.response?.status);
        });
    }
  }, [product?.id]);

  // 📏 Dynamic Available Sizes
  const modalAvailableSizes = useMemo(() => {
    const extractedSizes = activeVariant?.sizes
      ? activeVariant.sizes.map((s) => s.size)
      : [];
    return extractedSizes.length > 0 ? [...new Set(extractedSizes)] : [];
  }, [activeVariant]);

  const currentSizeToShow = modalAvailableSizes.includes(userSelectedSize)
    ? userSelectedSize
    : "";

  // 🖼️ Display Images Setup
  const displayImages = useMemo(() => {
    if (activeVariant?.images?.length > 0) return activeVariant.images;
    if (product?.images?.length > 0) return product.images;
    return ["https://via.placeholder.com/400x400?text=Product"];
  }, [activeVariant, product]);

  // 💰 Fixed Price & Discount Calculation
  const { finalPrice, originalPrice, discountPercent } = useMemo(() => {
    const basePrice = Number(product?.price) || 0;
    const discount = Number(product?.discount) || 0;
    const calculatedFinal = discount > 0 ? Number((basePrice * (1 - discount / 100)).toFixed(0)) : basePrice;

    return {
      originalPrice: basePrice,
      finalPrice: calculatedFinal,
      discountPercent: discount,
    };
  }, [product?.price, product?.discount]);

  if (!isOpen || !product) return null;

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // 💖 Wishlist Action
  const handleWishlistClick = () => {
    const totalStock =
      product?.variants?.reduce((total, variant) => {
        return (
          total +
          (variant.sizes?.reduce((sTotal, s) => sTotal + s.stock, 0) || 0)
        );
      }, 0) || 0;

    const wishlistPayload = {
      id: product?.id,
      name: product?.name,
      image: displayImages[0] || "",
      price: finalPrice,
      originalPrice: originalPrice,
      inStock: totalStock > 0,
    };

    toast.success("Excellent Taste! ❤️");
    dispatch(addToWishlist(wishlistPayload));
  };

  // 🚀 Cart & Buy Now Action
  const handleAction = (actionType) => {
    if (!currentSizeToShow) {
      toast.error("Please select a size first!");
      return;
    }

    // Selected Size details and stock check
    const sizeObj = activeVariant?.sizes?.find(
      (s) => String(s.size).trim().toLowerCase() === String(currentSizeToShow).trim().toLowerCase()
    );
    const selectedSizeStock = sizeObj ? Number(sizeObj.stock || 0) : Infinity;

    if (selectedSizeStock <= 0) {
      toast.error("Selected size is currently out of stock!");
      return;
    }

    const orderPayload = {
      productId: product?.id,
      variantId: activeVariant?.id,
      name: product?.name,
      quantity,
      size: currentSizeToShow,
      color: selectedColor,
      price: finalPrice,
      originalPrice: originalPrice,
      discount: product?.discount,
      stock: selectedSizeStock, // 🟢 কার্টের সাথে স্টক সমন্বয় করতে স্টক যোগ করে দেওয়া হলো
      image: displayImages[0] || "https://via.placeholder.com/150",
      category: product?.category?.name || "",
    };

    if (actionType === "cart") {
      dispatch(addToCart(orderPayload));
      toast.success(`${quantity}x ${product?.name} added to cart!`);

      if (onAddToCart) {
        onAddToCart({
          quantity,
          size: currentSizeToShow,
          color: selectedColor,
          finalPrice: finalPrice,
          action: actionType,
        });
      }
    } else if (actionType === "buy_now") {
      onClose();
      toast.info(`Proceeding to buy ${quantity}x ${product?.name}!`);
      navigate("/checkout", { state: { checkoutItem: orderPayload } });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-10 relative shadow-2xl flex flex-col md:flex-row gap-8 max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 md:top-6 md:right-6 w-8 h-8 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-800 hover:bg-neutral-100 hover:scale-105 transition-all z-30"
            aria-label="Close modal"
          >
            <FiX className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Left Column: Image Zoom Gallery */}
          <ImageGallery
            displayImages={displayImages}
            activeImageIndex={activeImageIndex}
            setActiveImageIndex={setActiveImageIndex}
            productName={product?.name}
          />

          {/* Right Column: Information Panel */}
          <div className="flex-1 flex flex-col justify-start text-left pt-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
              {product?.category?.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">
              {product.name}
            </h2>

            {/* Pricing Section */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-xl font-black">
                {discountPercent > 0 && originalPrice > 0 && (
                  <span className="text-neutral-400 line-through font-normal mr-3 text-base">
                    ৳{originalPrice.toFixed(0)}
                  </span>
                )}
                <span className="text-2xl">৳{finalPrice.toFixed(0)}</span>
              </div>
            </div>

            <p className="text-neutral-500 text-xs md:text-sm leading-relaxed mb-6 font-normal max-w-md">
              {product.description ||
                "Classic and comfortable premium product built for daily lifestyle and active sports durability."}
            </p>

            {/* Selectors Section */}
            <div className="space-y-4 mb-6">
              {/* SIZE SELECTOR WITH OUT OF STOCK DISABLE */}
              {modalAvailableSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider mb-2.5">
                    Size:{" "}
                    <span className="text-neutral-400 font-normal ml-1">
                      {currentSizeToShow || "Select yours"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {modalAvailableSizes
                      .slice()
                      .sort((a, b) => Number(a) - Number(b))
                      .map((size) => {
                        // 🟢 ১. উক্ত সাইজের অবজেক্ট এবং স্টক চেক
                        const sizeObj = activeVariant?.sizes?.find(
                          (s) => String(s.size).trim().toLowerCase() === String(size).trim().toLowerCase()
                        );
                        const stockCount = sizeObj ? Number(sizeObj.stock || 0) : 0;
                        const isOutOfStock = stockCount <= 0;
                        const isSelected = currentSizeToShow === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={isOutOfStock}
                            title={isOutOfStock ? "Out of Stock" : `Size: ${size}`}
                            onClick={() => {
                              if (!isOutOfStock) {
                                setUserSelectedSize(size);
                              }
                            }}
                            className={`h-10 min-w-10 px-3.5 rounded-lg text-xs font-bold uppercase transition-all duration-150 flex items-center justify-center select-none ${
                              isOutOfStock
                                ? "bg-neutral-100 text-neutral-300 border border-neutral-200 line-through cursor-not-allowed opacity-60"
                                : isSelected
                                ? "bg-neutral-900 text-white border border-neutral-900 shadow-sm cursor-pointer"
                                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 cursor-pointer"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* COLOR SELECTOR */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider mb-2">
                    Color:{" "}
                    <span className="text-neutral-400 font-normal capitalize ml-1">
                      {selectedColor}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-3 py-1">
                    {availableColors.map((colorObj) => {
                      const isSelected = selectedColor === colorObj.name;
                      return (
                        <button
                          key={colorObj.id || colorObj.name}
                          type="button"
                          onClick={() => {
                            setUserSelectedColor(colorObj.name);
                            setActiveImageIndex(0);
                          }}
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
              <span className="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-200 rounded bg-white h-8 overflow-hidden">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-sm border-r border-neutral-200 cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold select-none text-neutral-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 text-neutral-500 text-sm border-l border-neutral-200 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* SIZE GUIDE TRIGGER */}
            <div className="flex gap-5 text-xs font-medium text-neutral-800 mb-4 select-none pt-2">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="cursor-pointer hover:opacity-80 flex items-center gap-1.5 bg-transparent border-0 p-0"
              >
                <LuRuler className="w-4 h-4 text-neutral-800" />
                Size guide
              </button>
            </div>

            {/* LIVE TRACKING DATA BOX */}
            <div className="border border-neutral-300 rounded p-3 bg-white text-xs text-neutral-900 space-y-2.5 mb-5 max-w-md w-full font-normal">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold text-sm select-none">🗹</span>
                <span>
                  <strong>Viewed:</strong> {product.viewed || 0} people recently VIEWED this product.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black font-bold text-sm select-none">🔥</span>
                <span>
                  <strong>Popular:</strong> {product.sold || 0} people have BOUGHT this product.
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
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
                onClick={handleWishlistClick}
                className="w-full cursor-pointer bg-white hover:bg-neutral-900 text-neutral-800 hover:text-white border border-neutral-300 font-medium text-sm py-2.5 rounded transition-colors flex items-center justify-center gap-2"
              >
                Add to Wishlist <FiHeart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SIZE GUIDE POPUP */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
}