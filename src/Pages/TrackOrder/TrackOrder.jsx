import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBoxOpen, FaShippingFast, FaCheckCircle, FaUndoAlt, FaTimesCircle } from "react-icons/fa";

// পাথটা আপনার প্রজেক্টের আসল ফোল্ডার স্ট্রাকচার অনুযায়ী ঠিক করে নিন
import { getOrderById, resetOrderState } from "../../store/features/order/orderSlice";

// ব্যাকএন্ড শুধু status/createdAt/updatedAt রিটার্ন করে — ধাপে ধাপে
// timeline UI-র জন্য এখান থেকেই স্টেপগুলো তৈরি করা হচ্ছে।
const STATUS_FLOW = [
  { key: "pending", title: "Order Placed" },
  { key: "processing", title: "Processing" },
  { key: "shipped", title: "Shipped" },
  { key: "delivered", title: "Delivered" },
];

const formatDate = (value) => {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * status থেকে ৪টা ধাপের timeline বানায়।
 * - ধাপ ০ (Order Placed): order.createdAt দিয়ে date বসে
 * - বর্তমান status যেই ধাপে আছে: order.updatedAt দিয়ে date বসে
 * - মাঝের বাকি "completed" ধাপগুলো: exact timestamp DB তে নেই, তাই শুধু "Completed" দেখায়
 * - cancelled হলে timeline দেখানো হয় না, আলাদা ব্যানার দেখানো হয়
 */
const buildTimelineSteps = (order) => {
  if (!order || order.status === "cancelled") return [];

  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === order.status);

  return STATUS_FLOW.map((step, idx) => {
    const completed = currentIndex >= 0 && idx <= currentIndex;
    let date = "Pending";

    if (idx === 0) {
      date = formatDate(order.createdAt);
    } else if (idx === currentIndex) {
      date = formatDate(order.updatedAt);
    } else if (completed) {
      date = "Completed";
    }

    return { title: step.title, date, completed };
  });
};

function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading, error } = useSelector((state) => state.order);

  // এই পেজ ছেড়ে গেলে redux state পরিষ্কার করে দেওয়া — নাহলে অন্য কোথাও
  // (যেমন checkout সাকসেস পেজ) গিয়ে পুরনো currentOrder রয়ে যেতে পারত
  useEffect(() => {
    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setHasSearched(true);
    dispatch(getOrderById(trimmed));
  };

  const steps = buildTimelineSteps(currentOrder);
  const isCancelled = currentOrder?.status === "cancelled";
  const totalAmount =
    currentOrder != null
      ? Number(currentOrder.price || 0) + Number(currentOrder.deliveryCharge || 0)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER & SEARCH SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Order Tracking
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Track Your Order
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time updates on your shipment progress
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Enter order number (e.g. 1737384521931742)..."
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-gray-100/80 text-gray-900 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-all"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400 text-sm" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50 text-sm shrink-0"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* RESULTS SECTION */}
        {hasSearched && !loading && (
          <div>
            {currentOrder && !error ? (
              /* ORDER FOUND STATE */
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-6 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Order ID</span>
                    <h2 className="text-xl font-bold text-gray-800">#{currentOrder.id}</h2>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Order Date</span>
                    <p className="text-sm font-bold text-gray-800">{formatDate(currentOrder.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Total Amount</span>
                    <p className="text-sm font-bold text-gray-800">৳{totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 font-bold text-xs rounded-full border ${
                        isCancelled
                          ? "bg-gray-100 text-gray-500 border-gray-300"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {currentOrder.status?.charAt(0).toUpperCase() + currentOrder.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {isCancelled ? (
                  /* CANCELLED — no progress timeline makes sense here */
                  <div className="mt-8 flex flex-col items-center text-center py-6">
                    <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-4">
                      <FaTimesCircle size={26} />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">This order was cancelled</h3>
                    <p className="text-sm text-gray-400">
                      Last updated {formatDate(currentOrder.updatedAt)}
                    </p>
                  </div>
                ) : (
                  /* Timeline Progress */
                  <div className="mt-8">
                    <h3 className="text-base font-bold text-gray-800 mb-6">Shipment Status</h3>
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                      {steps.map((step, index) => (
                        <div key={index} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-auto">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                              step.completed
                                ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {step.completed ? <FaCheckCircle size={16} /> : index + 1}
                          </div>
                          <div className="md:text-center">
                            <p className={`text-sm font-bold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ORDER NOT FOUND STATE */
              <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center animate-fadeIn my-12">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaBoxOpen size={32} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {error || "We couldn't find an order with that number. Please double-check and try again."}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95 text-sm inline-flex items-center gap-2"
                >
                  <FaUndoAlt size={12} />
                  Back to Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* DEFAULT INITIAL STATE (Before Searching) */}
        {!hasSearched && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center my-12">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaShippingFast size={28} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Enter Your Order ID</h2>
            <p className="text-gray-500 text-sm">
              Please enter your order ID in the search bar above to track your delivery status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;