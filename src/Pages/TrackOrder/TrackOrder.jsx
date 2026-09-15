import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBoxOpen, FaShippingFast, FaCheckCircle, FaUndoAlt } from "react-icons/fa";

// মক ডাটা (পরবর্তীতে আপনার API এর সাথে সংযোগ করতে পারবেন)
const MOCK_ORDERS = {
  "12345": {
    orderId: "12345",
    status: "In Transit",
    customerName: "Rahim Ahmed",
    totalAmount: 1450,
    estimatedDelivery: "18 Sep, 2026",
    steps: [
      { title: "Order Placed", date: "15 Sep, 10:30 AM", completed: true },
      { title: "Processing", date: "15 Sep, 02:00 PM", completed: true },
      { title: "Shipped", date: "16 Sep, 09:00 AM", completed: true },
      { title: "Out for Delivery", date: "Pending", completed: false },
      { title: "Delivered", date: "Pending", completed: false },
    ],
  },
};

function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setHasSearched(true);

    // API Call এর অনুকরণে সিমুলেশন
    setTimeout(() => {
      const foundOrder = MOCK_ORDERS[orderNumber.trim()];
      setSearchResult(foundOrder || null);
      setLoading(false);
    }, 600);
  };

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
                placeholder="Enter order number (e.g. 12345)..."
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-gray-100/80 text-gray-900 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-all"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400 text-sm" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50 text-sm shrink-0"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* RESULTS SECTION */}
        {hasSearched && !loading && (
          <div>
            {searchResult ? (
              /* ORDER FOUND STATE */
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-6 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Order ID</span>
                    <h2 className="text-xl font-bold text-gray-800">#{searchResult.orderId}</h2>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Estimated Delivery</span>
                    <p className="text-sm font-bold text-red-500">{searchResult.estimatedDelivery}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Total Amount</span>
                    <p className="text-sm font-bold text-gray-800">৳{searchResult.totalAmount}</p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 font-bold text-xs rounded-full border border-red-200">
                      {searchResult.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-800 mb-6">Shipment Status</h3>
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                    {searchResult.steps.map((step, index) => (
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
              </div>
            ) : (
              /* ORDER NOT FOUND STATE (Matching your Screenshot) */
              <div className="max-w-md mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center animate-fadeIn my-12">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaBoxOpen size={32} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  We couldn't find an order with that number. Please double-check and try again.
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