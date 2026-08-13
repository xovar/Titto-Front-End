import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";

export default function PromotionalPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Redux Store থেকে সঠিক স্টেট সিলেক্ট করা হলো
  const { items: products, loading } = useSelector((state) => state.products);

  // ডামি CMS ডেটা (Step 2 তে ব্যাকএন্ড API দিয়ে পরিবর্তন হবে)
  const popupData = {
    isActive: true,
    title: "Special Offer Just For You!",
    description: "Get 20% flat discount on your first order. Use coupon code:",
    couponCode: "TITTO20",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/shop",
  };

  useEffect(() => {
    const TWO_MINUTES_MS = 2 * 60 * 1000;
    const popupClosedTime = localStorage.getItem("promoPopupClosedTime");
    const currentTime = new Date().getTime();

    const isTimerExpired =
      !popupClosedTime || currentTime - Number(popupClosedTime) > TWO_MINUTES_MS;

    const isProductsLoaded = Array.isArray(products) && products.length > 0;

    if (!loading && isProductsLoaded && isTimerExpired && popupData.isActive) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [products, loading, popupData.isActive]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("promoPopupClosedTime", new Date().getTime().toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all border border-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {popupData.image && (
          <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-neutral-100">
            <img
              src={popupData.image}
              alt={popupData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 text-center space-y-4">
          <h3 className="text-2xl font-black text-neutral-900 leading-tight">
            {popupData.title}
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {popupData.description}
          </p>

          {popupData.couponCode && (
            <div className="inline-block bg-neutral-100 border border-dashed border-neutral-400 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-neutral-800 uppercase">
              {popupData.couponCode}
            </div>
          )}

          <div className="pt-2">
            <a
              href={popupData.buttonLink}
              onClick={handleClose}
              className="inline-block w-full bg-black hover:bg-neutral-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg text-sm"
            >
              {popupData.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}