import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
// 👈 আপনার কার্ট স্লাইসের সঠিক পাথটি বসাবেন
import { incrementQuantity, decrementQuantity, removeFromCart } from "/src/store/features/cart/cartSlice.js"; 

const FREE_SHIPPING_THRESHOLD = 3500; 

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📥 রেডাক্স স্টোর থেকে কার্ট ডেটা আনা হলো
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log(cartItems);

  const [discountCode, setDiscountCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // 🔄 কোয়ান্টিটি বাড়ানো বা কমানোর হ্যান্ডলার (এখানে uniqueCartId পাঠানো হচ্ছে)
  const updateQuantity = (uniqueCartId, amount) => {
    if (amount > 0) {
      dispatch(incrementQuantity(uniqueCartId));
    } else {
      dispatch(decrementQuantity(uniqueCartId));
    }
  };

  // 🗑️ কার্ট থেকে আইটেম সম্পূর্ণ রিমুভ করার হ্যান্ডলার
  const removeItem = (uniqueCartId) => {
    dispatch(removeFromCart(uniqueCartId));
  };

  // 🧮 ক্যালকুলেশন লজিক
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const total = subtotal ;

  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
  if (!agreedToTerms) {
    alert("Please agree to the Terms and Conditions to proceed.");
    return;
  }
  
  // 🚚 ডেলিভারি ফ্রি কিনা চেক করা
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;

  navigate("/checkout", {
    state: {
      cartItems: cartItems,
      subtotal: subtotal,
      isFreeDelivery: isFreeDelivery, // 👈 এই ডেটাটি পাঠিয়ে দিন
      // আপনি চাইলে ডিফল্ট ডেলিভারি চার্জও হিসাব করে পাঠাতে পারেন:
      // shippingCost: isFreeDelivery ? 0 : 60 
    },
  });
};

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-neutral-700">Your cart is empty 🛒</h2>
        <p className="text-sm text-neutral-400">Add products to your cart to see them here.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[62%] space-y-6">
          <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-xs text-left">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm font-bold text-[#ea4c3b] flex items-center gap-1">
                {subtotal >= FREE_SHIPPING_THRESHOLD 
                  ? "You unlocked free delivery ✓" 
                  : `Spend Tk ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free delivery`
                }
              </span>
              <span className="text-xs font-bold text-neutral-700">Tk {FREE_SHIPPING_THRESHOLD.toLocaleString()}.00</span>
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#ea4c3b] h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-neutral-200 border-b border-neutral-200">
            {cartItems.map((item) => (
              <div key={item.uniqueCartId} className="py-6 flex gap-4 sm:gap-6 items-center justify-between text-left relative group">
                
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight max-w-sm sm:max-w-md line-clamp-2">
                      {item.name}
                    </h3>
                    
                    {/* ডাটার কী (Key) অনুযায়ী পরিবর্তন করা হয়েছে */}
                    <div className="flex gap-2 text-[11px] font-semibold text-neutral-500 uppercase">
                      <span>Size: <strong className="text-neutral-800">{item.size || "N/A"}</strong></span>
                      <span>|</span>
                      <span>Color: <strong className="text-neutral-800">{item.color || "Default"}</strong></span>
                    </div>
                    
                    <div className="flex items-center border border-neutral-300 rounded-md w-max bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.uniqueCartId, -1)}
                        className="px-3 py-1.5 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-neutral-800 min-w-8 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.uniqueCartId, 1)}
                        className="px-3 py-1.5 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-6 self-start pt-1">
                  <button
                    type="button"
                    onClick={() => removeItem(item.uniqueCartId)}
                    className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-neutral-900 tracking-tight whitespace-nowrap">
                    Tk {(item.price * item.quantity).toLocaleString()}.00
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[38%] space-y-5">
          <div className="bg-[#111111] text-white rounded-2xl p-6 text-left space-y-6 shadow-xl">
            <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">
              Order Summary
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 text-sm px-4 py-2.5 bg-neutral-800 border border-transparent rounded-lg focus:outline-none focus:border-neutral-500 text-white placeholder-neutral-500 font-medium"
              />
              <button
                type="button"
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">Tk {subtotal.toLocaleString()}.00 BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-neutral-400 text-[11px] font-normal">Calculated at checkout</span>
              </div>
            </div>

            <hr className="border-neutral-800" />

            <div className="flex justify-between items-baseline py-1">
              <span className="text-base font-black">Total</span>
              <span className="text-2xl font-black tracking-tight">Tk {total.toLocaleString()}.00</span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-normal">
              Cash on delivery available. Shipping and final payment will be confirmed at checkout.
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 accent-[#ea4c3b] mt-0.5"
              />
              <span className="text-[10px] text-neutral-300 leading-normal uppercase tracking-wider">
                I agree with the{" "}
                <a href="#" className="underline font-bold text-white hover:text-neutral-300">Terms and Conditions</a>,{" "}
                <a href="#" className="underline font-bold text-white hover:text-neutral-300">Privacy Policy</a>,{" "}
                <a href="#" className="underline font-bold text-white hover:text-neutral-300">Return Refund Policy</a>.
              </span>
            </label>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-[#ea4c3b] hover:bg-[#d43d2d] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-200 cursor-pointer text-center block shadow-md shadow-[#ea4c3b]/10"
            >
              Checkout now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}