
export default function OrderSummaryContent({
  displayItems = [],
  couponCode = "",
  setCouponCode,
  totalItemsCount = 0,
  subtotal = 0,
  discount = 0,
  vat = 0,
  total = 0,
  shippingCost = 150,
  hideCoupon = false,
}) {
  const FREE_SHIPPING_THRESHOLD = 3500;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const originalShippingFee = shippingCost > 0 ? shippingCost : 150;

  // 🎯 মোট কেনাকাটার ওপর % ডিসকাউন্ট হিসাব
  /* const overallDiscountPercent =
    subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0; */

  return (
    <>
      {/* Product List */}
      <div className="max-h-87.5 overflow-y-auto space-y-4 pt-2 pr-1">
        {displayItems.map((item) => {
          const itemQty = Number(item.quantity || item.qty || 1);
          const priceNum = parseFloat(item.price || 0);

          let rawOriginal = parseFloat(
            item.originalPrice || item.original_price || item.regular_price || item.mrp || 0
          );

          const itemDiscountVal = parseFloat(
            item.discountPercent || item.discountAmount || item.discount || 0
          );

          if (!rawOriginal || rawOriginal === priceNum) {
            if (item.discountPercent && item.discountPercent > 0) {
              rawOriginal = priceNum / (1 - item.discountPercent / 100);
            } else if (itemDiscountVal > 0) {
              rawOriginal = priceNum + itemDiscountVal;
            } else {
              rawOriginal = priceNum;
            }
          }

          const hasDiscount = itemDiscountVal > 0 || (rawOriginal > priceNum && priceNum > 0);
          
          // 🎯 একক পণ্যের ক্ষেত্রে % ডিসকাউন্ট বের করা
          const itemDiscountPercent =
            hasDiscount && rawOriginal > 0
              ? Math.round(((rawOriginal - priceNum) / rawOriginal) * 100)
              : 0;

          return (
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
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {itemQty}
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

              {/* Price Display Block */}
              <div className="text-right shrink-0">
                {hasDiscount ? (
                  <div>
                    {/* কাটা আসল দাম */}
                    <span className="text-[11px] text-neutral-400 line-through block font-normal">
                      Tk {(rawOriginal * itemQty).toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    {/* বর্তমান দাম + আইটেম লেভেল % ব্যাজ (Optional) */}
                    <div className="flex items-center gap-1 justify-end">
                      {itemDiscountPercent > 0 && (
                        <span className="text-[9px] bg-green-100 text-green-600 font-bold px-1 rounded">
                          -{itemDiscountPercent}%
                        </span>
                      )}
                      <span className="text-xs font-semibold text-neutral-900">
                        Tk {(priceNum * itemQty).toLocaleString('en-BD', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-neutral-900">
                    Tk {(rawOriginal * itemQty).toLocaleString('en-BD', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
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
              onChange={(e) => setCouponCode && setCouponCode(e.target.value)}
              className="flex-1 text-sm px-3 py-2.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400"
            />
            <button
              type="button"
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          <hr className="border-neutral-200" />
        </>
      )}

      {/* Calculation Summary Block */}
      <div className="space-y-2.5 text-xs text-left">
        {/* Subtotal */}
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal · {totalItemsCount} items</span>
          <span className="font-medium text-neutral-900">
             <span className="mr-1">Tk</span>
            {subtotal.toLocaleString('en-BD', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* 🟢 DISCOUNT ROW (% সহ) */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium items-center">
            <span className="flex items-center gap-1.5">
              Discount
            </span>
            <span>
              <span className="mr-1">- Tk</span> 
              {discount.toLocaleString('en-BD', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        {/* Shipping Row */}
        <div className="flex justify-between text-neutral-600 items-center">
          <span className="flex items-center gap-1.5">
            Shipping{" "}
            <span
              className="text-neutral-400 cursor-help"
              title={
                isFreeDelivery
                  ? "Free Shipping Unlocked!"
                  : "Standard Shipping"
              }
            >
              ⓘ
            </span>
          </span>
          <span className="text-neutral-900 font-medium">
            {isFreeDelivery ? (
              <>
                <span className="line-through mr-1 text-neutral-400">
                  Tk {originalShippingFee.toFixed(2)}
                </span>{" "}
                <span className="text-green-600 font-bold">FREE 🎉</span>
              </>
            ) : (
              `Tk ${originalShippingFee.toLocaleString('en-BD', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </span>
        </div>

        {/* VAT Row */}
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
            Tk 
            {vat.toLocaleString('en-BD', {
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
            <span className="text-[18px] font-bold text-neutral-900">
              {total.toLocaleString('en-BD', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}