import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiShoppingBag } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/features/cart/cartSlice";

// 🧩 সাব-কম্পোনেন্ট ইমপোর্ট
import DeliveryForm from "./DeliveryForm";
import ShippingMethodSection from "./ShippingMethodSection";
import PaymentMethodSection from "./PaymentMethodSection";
import BillingAddressSection from "./BillingAddressSection";
import OrderConfirmation from "./OrderConfirmation";
import OrderSummaryContent from "./OrderSummaryContent";

// 🛡️ সেফ নম্বর পার্সার (যে কোনো স্ট্রিং বা টেক্সট থেকে সঠিক নম্বর বের করবে)
const cleanNumber = (val) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📥 ডাটা রিসিভ
  const cartItems = location.state?.cartItems || [];
  const singleItem = location.state?.checkoutItem;
  const displayItems =
    cartItems.length > 0 ? cartItems : singleItem ? [singleItem] : [];

  // 🎯 স্টেটস
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("inside");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingAddress, setBillingAddress] = useState("same");
  const [couponCode, setCouponCode] = useState("");

  const [formData, setFormData] = useState({
    country: "Bangladesh",
    firstName: "",
    lastName: "",
    address: "",
    cityDistrict: "",
    postalCode: "",
    phone: "",
    billingCountry: "Bangladesh",
    billingFirstName: "",
    billingLastName: "",
    billingAddressInput: "",
    billingCity: "",
    billingPostalCode: "",
    billingPhone: "",
  });

  // 🛑 সেফটি গার্ড
  if (displayItems.length === 0 && !isOrderConfirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-neutral-700">
          No item selected for checkout!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  // 🧮 ক্যালকুলেশন

  // ১. Gross Subtotal (আসল দামের মোট যোগফল)
  const subtotal = displayItems.reduce((acc, item) => {
    const qty = cleanNumber(item.quantity || item.qty || 1);
    const price = cleanNumber(item.price);

    let rawOriginal = cleanNumber(
      item.originalPrice || item.original_price || item.regular_price || item.mrp
    );

    const discountVal = cleanNumber(item.discountPercent || item.discountAmount || item.discount);

    if (!rawOriginal || rawOriginal === price) {
      if (item.discountPercent && cleanNumber(item.discountPercent) > 0) {
        rawOriginal = price / (1 - cleanNumber(item.discountPercent) / 100);
      } else if (discountVal > 0) {
        rawOriginal = price + discountVal;
      } else {
        rawOriginal = price;
      }
    }

    return acc + rawOriginal * qty;
  }, 0);

  // ২. Total Discount
  const totalDiscount = displayItems.reduce((acc, item) => {
    const qty = cleanNumber(item.quantity || item.qty || 1);
    const price = cleanNumber(item.price);

    let rawOriginal = cleanNumber(
      item.originalPrice || item.original_price || item.regular_price || item.mrp
    );

    const discountVal = cleanNumber(item.discountPercent || item.discountAmount || item.discount);

    if (!rawOriginal || rawOriginal === price) {
      if (item.discountPercent && cleanNumber(item.discountPercent) > 0) {
        rawOriginal = price / (1 - cleanNumber(item.discountPercent) / 100);
      } else if (discountVal > 0) {
        rawOriginal = price + discountVal;
      } else {
        rawOriginal = price;
      }
    }

    const discountAmount = Math.max(0, rawOriginal - price);
    return acc + discountAmount * qty;
  }, 0);

  // ৩. শিপিং ও ভ্যাট
  const baseShippingCost = 150;
  const netProductTotal = subtotal - totalDiscount;
  const isFreeShipping = netProductTotal >= 3500 ? 0 : baseShippingCost;
  const vat = 0;

  // ৪. ফাইনাল টোটাল
  const total = Math.max(0, subtotal - totalDiscount + isFreeShipping + vat);

  const totalItemsCount = displayItems.reduce(
    (acc, item) => acc + cleanNumber(item.quantity || 1),
    0
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      dispatch(clearCart());
    }
    setIsOrderConfirmed(true);
  };

  const summaryProps = {
    displayItems,
    couponCode,
    setCouponCode,
    totalItemsCount,
    subtotal,
    discount: totalDiscount,
    vat,
    total,
    shippingCost: baseShippingCost,
  };

  const getPaymentMethodText = () => {
    if (paymentMethod === "cod") return "Cash On Delivery (ক্যাশ অন ডেলিভারি)";
    return paymentMethod;
  };

  // 🎉 SCREEN 2: ORDER CONFIRMATION SCREEN
  if (isOrderConfirmed) {
    return (
      <OrderConfirmation
        formData={formData}
        getPaymentMethodText={getPaymentMethodText}
        total={total}
        billingAddress={billingAddress}
        shippingMethod={shippingMethod}
        summaryProps={summaryProps}
        navigate={navigate}
      />
    );
  }

  // 📝 SCREEN 1: FULL REGULAR CHECKOUT FORM
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-10">
      {/* Mobile Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 lg:hidden mb-4">
        <div className="font-black tracking-wider text-xl">BRAND LOGO</div>
        <FiShoppingBag className="w-5 h-5 text-neutral-700" />
      </div>

      {/* Mobile Order Summary Accordion */}
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
          <span className="text-base font-bold text-neutral-900">
            ৳
            {total.toLocaleString("en-BD", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </button>

        {isOrderSummaryOpen && (
          <div className="p-4 space-y-6 border-t border-neutral-200 bg-neutral-50 text-left">
            <OrderSummaryContent {...summaryProps} />
          </div>
        )}
      </div>

      {/* Main Form + Summary Section */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-12 items-start relative"
      >
        {/* LEFT COLUMN: Checkout Form */}
        <div className="w-full lg:w-[55%] space-y-8 text-left">
          <DeliveryForm
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <ShippingMethodSection
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            subtotal={netProductTotal}
          />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <BillingAddressSection
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <button
            type="submit"
            className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors text-sm uppercase tracking-wider cursor-pointer"
          >
            Complete Order
          </button>
        </div>

        {/* RIGHT COLUMN: Desktop Order Summary */}
        <div className="hidden lg:block w-full lg:w-[45%] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sticky top-28 space-y-6 self-start">
          <OrderSummaryContent {...summaryProps} />
        </div>
      </form>
    </div>
  );
}