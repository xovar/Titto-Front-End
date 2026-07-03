import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHelpCircle, FiLock, FiChevronDown, FiChevronUp, FiShoppingBag } from "react-icons/fi";

// 📦 ১. ফিক্সড (Performance Optimization): 
// OrderSummaryContent-কে মূল কম্পোনেন্টের বাইরে নিয়ে আসা হয়েছে যেন স্টেট চেঞ্জে ফোকাস ড্রপ না করে।
const OrderSummaryContent = ({
  displayItems,
  couponCode,
  setCouponCode,
  totalItemsCount,
  subtotal,
  vat,
  total
}) => (
  <>
    <div className="max-h-[350px] overflow-y-auto space-y-4 pt-2 pr-1">
      {displayItems.map((item) => (
        <div key={item.uniqueCartId || item.id} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white border border-neutral-200 rounded-xl relative p-1 shrink-0 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {item.quantity}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-tight line-clamp-2">
                {item.name}
              </h4>
              <p className="text-[10px] text-neutral-500 mt-1 font-medium">
                Size: <span className="uppercase text-neutral-800 font-bold">{item.size || "N/A"}</span> | Color: <span className="capitalize text-neutral-800 font-bold">{item.color || "Default"}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-neutral-900 shrink-0">
            ৳{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>

    <hr className="border-neutral-200" />

    {/* Coupon Code Input */}
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Discount code or gift card"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="flex-1 text-sm px-3 py-2.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400"
      />
      <button
        type="button"
        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 text-xs font-medium rounded-md transition-colors cursor-pointer"
      >
        Apply
      </button>
    </div>

    <hr className="border-neutral-200" />

    {/* Calculation Block */}
    <div className="space-y-2.5 text-xs">
      <div className="flex justify-between text-neutral-600">
        <span>Subtotal · {totalItemsCount} items</span>
        <span className="font-medium text-neutral-900">৳{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      
      <div className="flex justify-between text-neutral-600 items-center">
        <span className="flex items-center gap-1.5">
          Shipping <span className="text-neutral-400 cursor-help" title="Free Shipping Promotion">ⓘ</span>
        </span>
        <span className="text-neutral-900 font-medium">
          <span className="line-through mr-1 text-neutral-400">৳৮০.০০</span> FREE
        </span>
      </div>

      <div className="text-[11px] text-neutral-500 flex items-center gap-1 font-medium select-none uppercase">
        <span>🏷️</span>
        <span>Enjoy Free Shipping</span>
      </div>

      <div className="flex justify-between text-neutral-600">
        <span className="flex items-center gap-1">
          VAT <span className="text-neutral-400 cursor-help" title="Value Added Tax">ⓘ</span>
        </span>
        <span className="font-medium text-neutral-900">৳{vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>

    <hr className="border-neutral-200" />

    {/* Total */}
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-bold text-neutral-900">Total</span>
        <div className="text-right flex items-baseline gap-1">
          <span className="text-[10px] text-neutral-400 font-medium">BDT</span>
          <span className="text-xl font-bold text-neutral-900">৳{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
      
      <div className="text-[11px] text-neutral-600 flex items-center gap-1 font-medium select-none uppercase">
        <span>🏷️</span>
        <span>Total Savings ৳৮০.০০</span>
      </div>
    </div>
  </>
);

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 📥 ডাটা রিসিভ
  const cartItems = location.state?.cartItems || [];
  const singleItem = location.state?.checkoutItem;
  const displayItems = cartItems.length > 0 ? cartItems : (singleItem ? [singleItem] : []);

  // 🎯 স্টেটস
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("inside");
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [billingAddress, setBillingAddress] = useState("same");
  const [couponCode, setCouponCode] = useState("");

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    newsletter: false,
    country: "Bangladesh",
    firstName: "Md Al",
    lastName: "Farhan",
    address: "Asulia Savar",
    notes: "",
    cityDistrict: "Dhaka",
    postalCode: "1344",
    phone: "+880 1753 628855",
    saveInfo: false,
  });

  // 🛑 সেফটি গার্ড
  if (displayItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-neutral-700">No item selected for checkout!</h2>
        <p className="text-sm text-neutral-500">Please go back to the product page or cart to checkout.</p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-black hover:bg-neutral-900 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout Final Data:", {
      customerInfo: formData,
      productInfo: displayItems,
      shippingMethod,
      paymentMethod,
      billingAddress,
      pricing: { subtotal, vat, total }
    });
  };

  // 📦 চাইল্ড কম্পোনেন্টে পাঠানোর জন্য প্রপস অবজেক্ট তৈরি
  const summaryProps = {
    displayItems,
    couponCode,
    setCouponCode,
    totalItemsCount,
    subtotal,
    vat,
    total
  };

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
      
      {/* 📱 Mobile Logo Header */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 lg:hidden mb-4">
        <div className="font-black tracking-wider text-xl">BRAND LOGO</div>
        <FiShoppingBag className="w-5 h-5 text-neutral-700" />
      </div>

      {/* 📱 Mobile Accordion Dropdown Bar */}
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
                placeholder="Mobile Number (মোবাইল নম্বর)"
                value={formData.emailOrMobile}
                onChange={handleInputChange}
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400"
                required
              />
              <FiHelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black rounded border-neutral-300"
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
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">Optional Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">Name (নাম)</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
                className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <input
              type="text"
              name="notes"
              placeholder="Special notes for delivery (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">City/District (শহর/জেলা)</label>
                <input
                  type="text"
                  name="cityDistrict"
                  value={formData.cityDistrict}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black pl-12"
                  required
                />
                <div className="absolute left-3 flex items-center gap-1 text-sm text-neutral-500 select-none">
                  <span className="text-base">🇧🇩</span>
                </div>
                <FiHelpCircle className="absolute right-3 text-neutral-400 w-4 h-4" />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                className="w-4 h-4 accent-black rounded border-neutral-300"
              />
              <span className="text-xs text-neutral-600">Save this information for next time</span>
            </label>
          </div>

          {/* Shipping Method Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-1">Shipping method</h2>
            <p className="text-xs text-neutral-400 mb-3">Enter your shipping address to view shipping rates.</p>
            
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-neutral-200 ${shippingMethod === "inside" ? "bg-neutral-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="inside"
                    checked={shippingMethod === "inside"}
                    onChange={() => setShippingMethod("inside")}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-medium text-neutral-800">Inside Dhaka (ঢাকার ভিতরে)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] line-through text-neutral-400 block">৳৬০.০০</span>
                  <span className="text-xs font-bold text-neutral-900">FREE</span>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 cursor-pointer ${shippingMethod === "outside" ? "bg-neutral-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="outside"
                    checked={shippingMethod === "outside"}
                    onChange={() => setShippingMethod("outside")}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-xs font-medium text-neutral-600">Outside Dhaka (ঢাকার বাইরে)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] line-through text-neutral-400 block">৳১২০.০০</span>
                  <span className="text-xs font-bold text-neutral-900">FREE</span>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-1">Payment</h2>
            <p className="text-xs text-neutral-400 mb-3">All transactions are secure and encrypted.</p>

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
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-xs font-bold text-neutral-800">SSLCOMMERZ</span>
                  </div>
                  <div className="flex gap-1 text-xs text-neutral-400 select-none">
                    <span className="bg-blue-600 text-white px-1 rounded font-bold text-[8px]">VISA</span>
                    <span className="bg-red-500 text-white px-1 rounded font-bold text-[8px]">MC</span>
                    <span className="bg-orange-500 text-white px-1 rounded font-bold text-[8px]">BKash</span>
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
                    className="w-4 h-4 accent-black mr-3"
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

              <label className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 ${paymentMethod === "bkash" ? "bg-neutral-50" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                  className="w-4 h-4 accent-black mr-3"
                />
                <span className="text-xs font-medium text-neutral-600">Bkash (বিকাশ)</span>
              </label>

              <label className={`flex items-center p-4 cursor-pointer ${paymentMethod === "nagad" ? "bg-neutral-50" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="nagad"
                  checked={paymentMethod === "nagad"}
                  onChange={() => setPaymentMethod("nagad")}
                  className="w-4 h-4 accent-black mr-3"
                />
                <span className="text-xs font-medium text-neutral-600">Nagad (নগদ)</span>
              </label>
            </div>
          </div>

          {/* Billing Address Section */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-3">Billing address</h2>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <label className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 ${billingAddress === "same" ? "bg-neutral-50" : ""}`}>
                <input
                  type="radio"
                  name="billingAddress"
                  value="same"
                  checked={billingAddress === "same"}
                  onChange={() => setBillingAddress("same")}
                  className="w-4 h-4 accent-black mr-3"
                />
                <span className="text-xs font-medium text-neutral-800">Same as shipping address</span>
              </label>
              <label className={`flex items-center p-4 cursor-pointer ${billingAddress === "different" ? "bg-neutral-50" : ""}`}>
                <input
                  type="radio"
                  name="billingAddress"
                  value="different"
                  checked={billingAddress === "different"}
                  onChange={() => setBillingAddress("different")}
                  className="w-4 h-4 accent-black mr-3"
                />
                <span className="text-xs font-medium text-neutral-600">Use a different billing address</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-neutral-900 text-white text-sm font-semibold py-4 rounded-md transition-all tracking-wide cursor-pointer shadow-xs uppercase"
          >
            Complete order
          </button>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-200 text-[10px] text-neutral-500">
            <a href="#" className="underline hover:text-black">Refund policy</a>
            <a href="#" className="underline hover:text-black">Privacy policy</a>
            <a href="#" className="underline hover:text-black">Terms of service</a>
            <a href="#" className="underline hover:text-black">Contact information</a>
          </div>
        </div>

        {/* 📦 DESKTOP COLUMN: Order Summary */}
        <div className="hidden lg:block w-full lg:w-[45%] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 lg:sticky lg:top-6 space-y-6 text-left">
          <OrderSummaryContent {...summaryProps} />
        </div>

      </form>
    </div>
  );
}