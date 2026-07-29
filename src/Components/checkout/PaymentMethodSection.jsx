export default function PaymentMethodSection({ paymentMethod, setPaymentMethod }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-neutral-900 mb-1">Payment</h2>
      <div className="border border-neutral-300 rounded-lg overflow-hidden">
        <div>
          <label
            className={`flex items-center p-4 cursor-pointer ${
              paymentMethod === "cod" ? "bg-neutral-50" : ""
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="w-4 h-4 accent-black mr-3 cursor-pointer"
            />
            <span className="text-xs font-medium text-neutral-600">
              Cash On Delivery (ক্যাশ অন ডেলিভারি)
            </span>
          </label>
          {paymentMethod === "cod" && (
            <div className="p-4 bg-neutral-100 border-t border-neutral-200 text-xs text-neutral-700 text-left space-y-1 font-medium pl-10">
              <p>
                After placing your order, it will be automatically confirmed.
              </p>
              <p className="text-neutral-500 font-normal">-</p>
              <p className="text-neutral-900 font-semibold">
                অর্ডারটি প্লেস করার সাথে সাথেই স্বয়ংক্রিয়ভাবে কনফার্ম হবে।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}