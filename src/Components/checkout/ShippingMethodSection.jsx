export default function ShippingMethodSection({ shippingMethod, setShippingMethod, subtotal }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-neutral-900 mb-1">Shipping method</h2>
      <div className="border border-neutral-300 rounded-lg overflow-hidden">
        <label
          className={`flex items-center justify-between p-4 cursor-pointer border-b border-neutral-200 ${
            shippingMethod === "inside" ? "bg-neutral-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingMethod"
              value="inside"
              checked={shippingMethod === "inside"}
              onChange={() => setShippingMethod("inside")}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="text-xs font-medium text-neutral-800">
              Inside Dhaka (ঢাকার ভিতরে)
            </span>
          </div>
          <span className="text-xs font-bold text-neutral-900">
            {subtotal > 3500 ? "FREE" : "TK 150"}
          </span>
        </label>

        <label
          className={`flex items-center justify-between p-4 cursor-pointer ${
            shippingMethod === "outside" ? "bg-neutral-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shippingMethod"
              value="outside"
              checked={shippingMethod === "outside"}
              onChange={() => setShippingMethod("outside")}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="text-xs font-medium text-neutral-600">
              Outside Dhaka (ঢাকার বাইরে)
            </span>
          </div>
          <span className="text-xs font-bold text-neutral-900">
            {subtotal > 3500 ? "FREE" : "TK 150"}
          </span>
        </label>
      </div>
    </div>
  );
}