import { FiCheck } from "react-icons/fi";
import OrderSummaryContent from "./OrderSummaryContent";
import { useEffect } from "react";

export default function OrderConfirmation({
  formData,
  getPaymentMethodText,
  total,
  billingAddress,
  shippingMethod,
  summaryProps,
  navigate,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* LEFT COLUMN: Success Details */}
        <div className="w-full lg:w-[55%] space-y-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-neutral-900 flex items-center justify-center shrink-0">
              <FiCheck className="w-6 h-6 text-neutral-900" />
            </div>
            <div>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                Confirmation #NDZDUE0G8
              </p>
              <h1 className="text-xl font-semibold text-neutral-900">
                Thank you, {formData.firstName || formData.lastName}!
              </h1>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-5 space-y-1 bg-white">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Your order is confirmed
            </h3>
            <p className="text-xs text-neutral-600">
              Your order has been successfully confirmed.
            </p>
            <p className="text-xs text-neutral-400">-</p>
            <p className="text-xs text-neutral-800 font-medium">
              আপনার অর্ডারটি সফলভাবে কনফার্ম হয়েছে।
            </p>
          </div>

          <div className="border border-neutral-200 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Order details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-xs">
              <div>
                <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">
                  Payment method
                </h4>
                <p className="text-neutral-800 font-medium">
                  {getPaymentMethodText()} · ৳
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  BDT
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">
                  Shipping address
                </h4>
                <div className="text-neutral-700 space-y-0.5 font-medium">
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.cityDistrict} {formData.postalCode}
                  </p>
                  <p>{formData.country}</p>
                  <p>{formData.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">
                  Billing address
                </h4>
                <div className="text-neutral-700 space-y-0.5 font-medium">
                  {billingAddress === "same" ? (
                    <>
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.cityDistrict} {formData.postalCode}
                      </p>
                      <p>{formData.country}</p>
                      <p>{formData.phone}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        {formData.billingFirstName} {formData.billingLastName}
                      </p>
                      <p>{formData.billingAddressInput}</p>
                      <p>
                        {formData.billingCity} {formData.billingPostalCode}
                      </p>
                      <p>{formData.billingCountry}</p>
                      {formData.billingPhone && <p>{formData.billingPhone}</p>}
                    </>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 border-t border-neutral-100 pt-4">
                <h4 className="font-semibold text-neutral-400 mb-1 uppercase tracking-tight">
                  Shipping method
                </h4>
                <p className="text-neutral-800 font-medium">
                  {shippingMethod === "inside"
                    ? "Inside Dhaka (ঢাকার ভিতরে)"
                    : "Outside Dhaka (ঢাকার বাইরে)"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-500">
              Need help?{" "}
              <a
                href="#"
                className="underline text-neutral-700 hover:text-black"
              >
                Contact us
              </a>
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
            >
              Continue shopping
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Box */}
        {/* 💡 top-6 পরিবতে top-28 এবং self-start যোগ করা হয়েছে */}
        <div className="hidden lg:block w-full lg:w-[45%] bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sticky top-28 space-y-6 self-start">
          <OrderSummaryContent {...summaryProps} hideCoupon={true} />
        </div>
      </div>
    </div>
  );
}