import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHelpCircle, FiLock, FiChevronDown, FiChevronUp, FiShoppingBag, FiCheck } from "react-icons/fi";
import OrderSummaryContent from "./OrderSummaryContent";

// 📦 ১. রেডাক্স হুক এবং কার্ট স্লাইস থেকে clearCart অ্যাকশনটি ইমপোর্ট করুন
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/features/cart/cartSlice"; // 👈 আপনার প্রজেক্টের সঠিক পাথটি দিন

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ⚡ ২. ডিসপ্যাচ মেথড ইনিশিয়ালাইজ করুন
  
  // 📥 ডাটা রিসিভ
  const cartItems = location.state?.cartItems || [];
  const singleItem = location.state?.checkoutItem;
  const displayItems = cartItems.length > 0 ? cartItems : (singleItem ? [singleItem] : []);

  // 🎯 স্টেটস
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("inside");
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [billingAddress, setBillingAddress] = useState("same");
  const [couponCode, setCouponCode] = useState("");

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    newsletter: false,
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    notes: "",
    cityDistrict: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
    billingCountry: "Bangladesh",
    billingFirstName: "",
    billingLastName: "",
    billingAddressInput: "",
    billingNotes: "",
    billingCity: "",
    billingPostalCode: "",
    billingPhone: "",
  });

  // 🛑 সেফটি গার্ড
  if (displayItems.length === 0 && !isOrderConfirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-neutral-700">No item selected for checkout!</h2>
        <button onClick={() => navigate("/")} className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium">
          Go Shopping
        </button>
      </div>
    );
  }

  // 🧮 ক্যালকুলেশন
  const subtotal = displayItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = 0; 
  const vat = Math.round(subtotal * 0.05); 
  const total = subtotal + shippingCost + vat;
  const totalItemsCount = displayItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // 💾 ৩. অর্ডার কনফার্মেশন সাবমিট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ⚡ 🔥 ম্যাজিক কন্ডিশন: যদি ইউজার কার্ট পেজ থেকে আসে (অর্থাৎ cartItems-এ ডাটা থাকে)
    if (cartItems.length > 0) {
      dispatch(clearCart()); // রেডাক্স স্টেট এবং লোকাল স্টোরেজ দুটোই ফাঁকা হয়ে যাবে
    }

    setIsOrderConfirmed(true);
  };

  const summaryProps = {
    displayItems, couponCode, setCouponCode, totalItemsCount, subtotal, vat, total
  };

  const getPaymentMethodText = () => {
    if (paymentMethod === "cod") return "Cash On Delivery (ক্যাশ অন ডেলিভারি)";
    if (paymentMethod === "sslcommerz") return "SSLCOMMERZ";
    if (paymentMethod === "bkash") return "bKash (বিকাশ)";
    if (paymentMethod === "nagad") return "Nagad (নগদ)";
    return paymentMethod;
  };

  // =========================================================================
  // 🎉 SCREEN 2: ORDER CONFIRMATION SCREEN
  // =========================================================================
  if (isOrderConfirmed) {
    return (
      <div className="min-h-screen bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: Success Details */}
          <div className="w-full lg:w-[55%] space-y-6 text-left">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-neutral-900 flex items-center justify-center shrink-0">
                <FiCheck className="w-6 h-6 text-neutral-900" />
              </div>
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Confirmation #NDZDUE0G8</p>
                <h1 className="text-xl font-semibold text-neutral-900">Thank you, {formData.firstName}!</h1>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl p-5 space-y-1 bg-white">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Your order is confirmed</h3>
              <p className="text-xs text-neutral-600">Your order has been successfully confirmed.</p>
              <p className="text-xs text-neutral-400">-</p>
              <p className="text-xs text-neutral-800 font-medium">আপনার অর্ডারটি সফলভাবে কনফার্ম হয়েছে।</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">Order details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-xs">
                
                <div>
                  <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">Contact information</h4>
                  <p className="text-neutral-800 font-medium">{formData.emailOrMobile}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">Payment method</h4>
                  <p className="text-neutral-800 font-medium">
                    {getPaymentMethodText()} · ৳{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">Shipping address</h4>
                  <div className="text-neutral-700 space-y-0.5 font-medium">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.cityDistrict} {formData.postalCode}</p>
                    <p>{formData.country}</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">Billing address</h4>
                  <div className="text-neutral-700 space-y-0.5 font-medium">
                    {billingAddress === "same" ? (
                      <>
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.cityDistrict} {formData.postalCode}</p>
                        <p>{formData.country}</p>
                        <p>{formData.phone}</p>
                      </                    >
                    ) : (
                      <>
                        <p>{formData.billingFirstName} {formData.billingLastName}</p>
                        <p>{formData.billingAddressInput}</p>
                        <p>{formData.billingCity} {formData.billingPostalCode}</p>
                        <p>{formData.billingCountry}</p>
                        {formData.billingPhone && <p>{formData.billingPhone}</p>}
                      </>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 border-t border-neutral-100 pt-4">
                  <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">Shipping method</h4>
                  <p className="text-neutral-800 font-medium">
                    {shippingMethod === "inside" ? "Inside Dhaka (ঢাকার ভিতরে)" : "Outside Dhaka (ঢাকার বাইরে)"}
                  </p>
                </div>

              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-neutral-500">
                Need help? <a href="#" className="underline text-neutral-700 hover:text-black">Contact us</a>
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
              >
                Continue shopping
              </button>
            </div>

          </div>

          <div className="hidden lg:block w-full lg:w-[45%] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sticky top-6 space-y-6">
            <OrderSummaryContent {...summaryProps} hideCoupon={true} />
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 📝 SCREEN 1: FULL REGULAR CHECKOUT FORM
  // =========================================================================
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
      {/* বাকি JSX ডিজাইন একদম আগের মতোই থাকবে */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 lg:hidden mb-4">
        <div className="font-black tracking-wider text-xl">BRAND LOGO</div>
        <FiShoppingBag className="w-5 h-5 text-neutral-700" />
      </div>

      <div className="lg:hidden w-full bg-neutral-50 border border-neutral-200 rounded-xl mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/70 transition-colors"
        >
          <div className="flex items-center gap-2 text-black font-semibold">
            <span>Order summary</span>
            {isOrderSummaryOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          <span className="text-base font-bold text-neutral-900">৳{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </button>
        
        {isOrderSummaryOpen && (
          <div className="p-4 space-y-6 border-t border-neutral-200 bg-neutral-50 text-left">
            <OrderSummaryContent {...summaryProps} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LEFT COLUMN: Checkout Form */}
        <div className="w-full lg:w-[55%] space-y-8 text-left">
          
          {/* Contact Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-neutral-900">Contact</h2>
              <button type="button" className="text-xs text-neutral-600 underline bg-transparent border-none cursor-pointer">Sign in</button>
            </div>
            <div className="relative">
              <input
                type="text"
                name="emailOrMobile"
                placeholder="Email or Mobile Number"
                value={formData.emailOrMobile}
                onChange={handleInputChange}
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400 caret-black relative z-10 bg-transparent"
                required
              />
              <FiHelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-0 pointer-events-none" />
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black rounded border-neutral-300 cursor-pointer"
              />
              <span className="text-xs text-neutral-600">Email me with news and offers</span>
            </label>
          </div>

          {/* Delivery Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-neutral-900">Delivery</h2>
            
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Country/Region</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">First Name (Optional)</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">Last Name (নাম)</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Address (ঠিকানা)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
                required
              />
            </div>

            <input
              type="text"
              name="notes"
              placeholder="Special notes for delivery (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400 caret-black"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">City/District (শহর/জেলা)</label>
                <input
                  type="text"
                  name="cityDistrict"
                  value={formData.cityDistrict}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">Postal code (optional)</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Mobile Number (মোবাইল নম্বর)</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black pl-12 caret-black relative z-10 bg-transparent"
                  required
                />
                <div className="absolute left-3 flex items-center gap-1 text-sm text-neutral-500 select-none z-0 pointer-events-none">
                  <span className="text-base">🇧🇩</span>
                </div>
                <FiHelpCircle className="absolute right-3 text-neutral-400 w-4 h-4 z-0 pointer-events-none" />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black rounded border-neutral-300 cursor-pointer"
              />
              <span className="text-xs text-neutral-600">Save this information for next time</span>
            </label>
          </div>

          {/* Shipping Method Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-1">Shipping method</h2>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-neutral-200 ${shippingMethod === "inside" ? "bg-neutral-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="inside"
                    checked={shippingMethod === "inside"}
                    onChange={() => setShippingMethod("inside")}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-800">Inside Dhaka (ঢাকার ভিতরে)</span>
                </div>
                <span className="text-xs font-bold text-neutral-900">FREE</span>
              </label>

              <label className={`flex items-center justify-between p-4 cursor-pointer ${shippingMethod === "outside" ? "bg-neutral-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="outside"
                    checked={shippingMethod === "outside"}
                    onChange={() => setShippingMethod("outside")}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-600">Outside Dhaka (ঢাকার বাইরে)</span>
                </div>
                <span className="text-xs font-bold text-neutral-900">FREE</span>
              </label>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-1">Payment</h2>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <div>
                <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-neutral-200 ${paymentMethod === "sslcommerz" ? "bg-neutral-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sslcommerz"
                      checked={paymentMethod === "sslcommerz"}
                      onChange={() => setPaymentMethod("sslcommerz")}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="text-xs font-bold text-neutral-800">SSLCOMMERZ</span>
                  </div>
                </label>
                {paymentMethod === "sslcommerz" && (
                  <div className="p-6 bg-neutral-50 border-b border-neutral-200 text-center text-xs text-neutral-500 space-y-2">
                    <div className="mx-auto w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                      <FiLock />
                    </div>
                    <p>You'll be redirected to SSLCOMMERZ to complete your purchase safely.</p>
                  </div>
                )}
              </div>

              <div>
                <label className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 ${paymentMethod === "cod" ? "bg-neutral-50" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 accent-black mr-3 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-600">Cash On Delivery (ক্যাশ অন ডেলিভারি)</span>
                </label>
                {paymentMethod === "cod" && (
                  <div className="p-4 bg-neutral-100 border-b border-neutral-200 text-xs text-neutral-700 text-left space-y-1 font-medium pl-10">
                    <p>After placing your order, it will be automatically confirmed.</p>
                    <p className="text-neutral-500 font-normal">-</p>
                    <p className="text-neutral-900 font-semibold">অর্ডারটি প্লেস করার সাথে সাথেই স্বয়ংক্রিয়ভাবে কনফার্ম হবে।</p>
                  </div>
                )}
              </div>

              <div>
                <label className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 ${paymentMethod === "bkash" ? "bg-neutral-50" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="w-4 h-4 accent-black mr-3 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-600">bKash (বিকাশ)</span>
                </label>
              </div>

              <div>
                <label className={`flex items-center p-4 cursor-pointer ${paymentMethod === "nagad" ? "bg-neutral-50" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="w-4 h-4 accent-black mr-3 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-600">Nagad (নগদ)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-3">Billing address</h2>
            <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white">
              
              <label className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 transition-colors ${billingAddress === "same" ? "bg-neutral-50" : ""}`}>
                <input
                  type="radio"
                  name="billingAddress"
                  value="same"
                  checked={billingAddress === "same"}
                  onChange={() => setBillingAddress("same")}
                  className="w-4 h-4 accent-black mr-3 cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-800">Same as shipping address</span>
              </label>

              <label className={`flex items-center p-4 cursor-pointer transition-colors ${billingAddress === "different" ? "bg-neutral-50 border-b border-neutral-300" : ""}`}>
                <input
                  type="radio"
                  name="billingAddress"
                  value="different"
                  checked={billingAddress === "different"}
                  onChange={() => setBillingAddress("different")}
                  className="w-4 h-4 accent-black mr-3 cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-800">Use a different billing address</span>
              </label>

              {billingAddress === "different" && (
                <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 space-y-4">
                  
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Country/Region</label>
                    <div className="relative">
                      <select
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Optional Name</label>
                      <input
                        type="text"
                        name="billingFirstName"
                        placeholder="Md Al"
                        value={formData.billingFirstName}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Name (নাম)</label>
                      <input
                        type="text"
                        name="billingLastName"
                        placeholder="Farhan"
                        value={formData.billingLastName}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Address (ঠিকানা)</label>
                    <input
                      type="text"
                      name="billingAddressInput"
                      placeholder="Asulia Savar"
                      value={formData.billingAddressInput}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="billingNotes"
                      placeholder="Special notes for delivery (optional)"
                      value={formData.billingNotes}
                      onChange={handleInputChange}
                      className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400 caret-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">City/District (শহর/জেলা)</label>
                      <input
                        type="text"
                        name="billingCity"
                        placeholder="Dhaka"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Postal code (optional)</label>
                      <input
                        type="text"
                        name="billingPostalCode"
                        placeholder="1344"
                        value={formData.billingPostalCode}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">Phone (optional)</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        name="billingPhone"
                        placeholder="01753628655"
                        value={formData.billingPhone}
                        onChange={handleInputChange}
                        className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black pl-4 pr-16 caret-black relative z-10 "
                      />
                      <div className="absolute right-4 flex items-center gap-2 text-neutral-400 select-none z-0 pointer-events-none">
                        <span className="text-xl">🇧🇩</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-900 text-white text-sm font-semibold py-4 rounded-md transition-all uppercase tracking-wide cursor-pointer"
          >
            Complete order
          </button>
        </div>

        {/* DESKTOP COLUMN: Order Summary */}
        <div className="hidden lg:block w-full lg:w-[45%] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 lg:sticky lg:top-6 space-y-6 text-left">
          <OrderSummaryContent {...summaryProps} />
        </div>

      </form>
    </div>
  );
}