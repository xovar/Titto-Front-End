function OrderSummaryContent({
  displayItems,
  couponCode,
  setCouponCode,
  totalItemsCount,
  subtotal,
  vat,
  total,
  shippingCost = 150, // parent component থেকে আসা শিপিং চার্জ (ডিফল্ট ৬০)
  hideCoupon = true,
}) {
  // 🚚 ৩,৫০০ টাকা বা তার বেশি হলে ডাইনামিকালি ফ্রি ডেলিভারি হবে
  const FREE_SHIPPING_THRESHOLD = 3500;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;

  // অরিজিনাল শিপিং ফ্রি থাকলে দেখানোর জন্য ধরে নেওয়া চার্জ (যেমন: ৬০ বা ৮০ টাকা)
  const originalShippingFee = shippingCost > 0 ? shippingCost : 60;

  return (
    <>
      {/* Product List */}
      <div className="max-h-87.5 overflow-y-auto space-y-4 pt-2 pr-1">
        {displayItems.map((item) => (
          <div
            key={item.uniqueCartId || item.id}
            className="flex items-center justify-between gap-4"
          >
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
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-tight line-clamp-2 text-left">
                  {item.name}
                </h4>
                <p className="text-[10px] text-neutral-500 mt-1 font-medium text-left">
                  Size:{" "}
                  <span className="uppercase text-neutral-800 font-bold">
                    {item.size || "N/A"}
                  </span>{" "}
                  | Color:{" "}
                  <span className="capitalize text-neutral-800 font-bold">
                    {item.color || "Default"}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-neutral-900 shrink-0">
              ৳
              {(item.price * item.quantity).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-neutral-200" />

      {/* Coupon Code Input */}
      {!hideCoupon && (
        <>
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
        </>
      )}

      {/* Calculation Block */}
      <div className="space-y-2.5 text-xs text-left">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal · {totalItemsCount} items</span>
          <span className="font-medium text-neutral-900">
            ৳
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Dynamic Shipping Row */}
        <div className="flex justify-between text-neutral-600 items-center">
          <span className="flex items-center gap-1.5">
            Shipping{" "}
            <span
              className="text-neutral-400 cursor-help"
              title={isFreeDelivery ? "Free Shipping Unlocked!" : "Standard Shipping"}
            >
              ⓘ
            </span>
          </span>
          <span className="text-neutral-900 font-medium">
            {isFreeDelivery ? (
              <>
                <span className="line-through mr-1 text-neutral-400">
                  ৳{originalShippingFee.toFixed(2)}
                </span>{" "}
                <span className="text-green-600 font-bold">FREE 🎉</span>
              </>
            ) : (
              `৳${shippingCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </span>
        </div>

        {/* Free Shipping Badge - only shown if subtotal >= 3500 */}
        {!hideCoupon && isFreeDelivery && (
          <div className="text-[11px] text-green-600 flex items-center gap-1 font-semibold select-none uppercase">
            <span>🏷️</span>
            <span>Enjoy Free Shipping</span>
          </div>
        )}

        <div className="flex justify-between text-neutral-600">
          <span className="flex items-center gap-1">
            VAT{" "}
            <span
              className="text-neutral-400 cursor-help"
              title="Value Added Tax"
            >
              ⓘ
            </span>
          </span>
          <span className="font-medium text-neutral-900">
            ৳
            {vat.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <hr className="border-neutral-200" />

      {/* Total Section */}
      <div className="space-y-2 text-left">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-bold text-neutral-900">Total</span>
          <div className="text-right flex items-baseline gap-1">
            <span className="text-[10px] text-neutral-400 font-medium">
              BDT
            </span>
            <span className="text-xl font-bold text-neutral-900">
              ৳
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Dynamic Total Savings Badge */}
        {!hideCoupon && isFreeDelivery && (
          <div className="text-[11px] text-green-600 flex items-center gap-1 font-bold select-none uppercase">
            <span>🏷️</span>
            <span>Total Savings ৳{originalShippingFee.toFixed(2)}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderSummaryContent;