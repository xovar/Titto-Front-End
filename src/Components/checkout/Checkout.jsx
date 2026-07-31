import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/features/cart/cartSlice";
import { createOrder } from "../../store/features/order/orderSlice";

// 🧩 সাব-কম্পোনেন্ট ইমপোর্ট
import DeliveryForm from "./DeliveryForm";
import ShippingMethodSection from "./ShippingMethodSection";
import PaymentMethodSection from "./PaymentMethodSection";
import BillingAddressSection from "./BillingAddressSection";
import OrderConfirmation from "./OrderConfirmation";
import OrderSummaryContent from "./OrderSummaryContent";

// 🛡️ সেফ নম্বর পার্সার
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

  // 🔄 Redux Order State থেকে Loading এবং Error আনা
  const { loading: isSubmitting, error: orderError } = useSelector(
    (state) => state.order
  );

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
  const [placedOrderId, setPlacedOrderId] = useState(null);

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

  // 🧮 ক্লিন ও নির্ভুল ক্যালকুলেশন

  // ১. Gross Subtotal (অরিজিনাল দাম × কোয়ান্টিটি) e.g., 2000 x 2 = 4000
  const subtotal = displayItems.reduce((acc, item) => {
    const qty = cleanNumber(item.quantity || item.qty || 1);
    const regularPrice = cleanNumber(
      item.originalPrice || item.original_price || item.regular_price || item.mrp || item.price
    );
    return acc + regularPrice * qty;
  }, 0);

  // ২. Total Discount (মোট ছাড়) e.g., (2000 - 1600) x 2 = 800
  const totalDiscount = displayItems.reduce((acc, item) => {
    const qty = cleanNumber(item.quantity || item.qty || 1);
    const regularPrice = cleanNumber(
      item.originalPrice || item.original_price || item.regular_price || item.mrp || item.price
    );
    const salePrice = cleanNumber(item.price);
    
    // ডিসকাউন্ট অ্যামাউন্ট বের করা (Regular Price - Sale Price)
    const itemDiscount = Math.max(0, regularPrice - salePrice);
    return acc + itemDiscount * qty;
  }, 0);

  // ৩. নিট প্রোডাক্ট টোটাল (যেটা কাস্টমারকে পে করতে হবে) e.g., 4000 - 800 = 3200
  const netProductTotal = subtotal - totalDiscount;

  // ৪. শিপিং ফি ক্যালকুলেশন
  const baseShippingCost = 150;
  const shippingFee = netProductTotal >= 3500 ? 0 : baseShippingCost;
  const vat = 0;

  // ৫. ফাইনাল গ্র্যান্ড টোটাল
  const total = Math.max(0, netProductTotal + shippingFee + vat);

  const totalItemsCount = displayItems.reduce(
    (acc, item) => acc + cleanNumber(item.quantity || item.qty || 1),
    0
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🚀 অর্ডার সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSameBilling = billingAddress === "same";

    // 📦 ব্যাকএন্ড কন্ট্রোলারের সাথে ১০০% পারফেক্ট পে-লোড
    const orderPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      cityDistrict: formData.cityDistrict,
      postalCode: formData.postalCode,
      phone: formData.phone,
      deliveryCharge: shippingFee,
      
      // Billing Address
      billingFirstName: isSameBilling ? formData.firstName : formData.billingFirstName,
      billingLastName: isSameBilling ? formData.lastName : formData.billingLastName,
      billingAddressInput: isSameBilling ? formData.address : formData.billingAddressInput,
      billingCity: isSameBilling ? formData.cityDistrict : formData.billingCity,
      billingPostalCode: isSameBilling ? formData.postalCode : formData.billingPostalCode,
      billingPhone: isSameBilling ? formData.phone : formData.billingPhone,

      // Items Array
      items: displayItems.map((item) => {
        const regularPrice = cleanNumber(
          item.originalPrice || item.original_price || item.regular_price || item.mrp || item.price
        );
        const salePrice = cleanNumber(item.price);
        const discountVal = Math.max(0, regularPrice - salePrice);

        return {
          productId: item.productId || item.product_id || item.id,
          variantId: item.variantId || item.variant_id || item.variant?.id || null,
          name: item.name || item.product_name,
          category: item.category || null,
          color: item.color || null,
          size: item.size || null,
          price: regularPrice, // 🔑 এখানে Regular/Original Price (২০০0) যাবে
          quantity: cleanNumber(item.quantity || item.qty || 1),
          discount: discountVal, // 🔑 এখানে Discount Amount (৪০০) যাবে
          image: item.image || null,
        };
      }),
    };

    try {
      // Redux Async Thunk এর মাধ্যমে API কল
      const response = await dispatch(createOrder(orderPayload)).unwrap();
      
      if (response?.orderId) {
        setPlacedOrderId(response.orderId);
      }

      if (cartItems.length > 0) {
        dispatch(clearCart());
      }

      setIsOrderConfirmed(true);
    } catch (err) {
      alert(err || "Failed to place order. Please try again.");
    }
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
        orderId={placedOrderId}
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

          {/* ⚠️ এরর মেসেজ */}
          {orderError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {orderError}
            </div>
          )}

          {/* 🟢 সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors text-sm uppercase tracking-wider cursor-pointer disabled:bg-neutral-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Placing Order...
              </>
            ) : (
              "Complete Order"
            )}
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