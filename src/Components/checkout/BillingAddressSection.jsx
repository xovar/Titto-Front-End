
export default function BillingAddressSection({
  billingAddress,
  setBillingAddress,
  formData,
  handleInputChange,
}) {
  return (
    <div>
      <h2 className="text-lg font-medium text-neutral-900 mb-3">Billing address</h2>
      <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white">
        <label
          className={`flex items-center p-4 cursor-pointer border-b border-neutral-200 transition-colors ${
            billingAddress === "same" ? "bg-neutral-50" : ""
          }`}
        >
          <input
            type="radio"
            name="billingAddress"
            value="same"
            checked={billingAddress === "same"}
            onChange={() => setBillingAddress("same")}
            className="w-4 h-4 accent-black mr-3 cursor-pointer"
          />
          <span className="text-sm font-medium text-neutral-800">
            Same as shipping address
          </span>
        </label>

        <label
          className={`flex items-center p-4 cursor-pointer transition-colors ${
            billingAddress === "different" ? "bg-neutral-50" : ""
          }`}
        >
          <input
            type="radio"
            name="billingAddress"
            value="different"
            checked={billingAddress === "different"}
            onChange={() => setBillingAddress("different")}
            className="w-4 h-4 accent-black mr-3 cursor-pointer"
          />
          <span className="text-sm font-medium text-neutral-800">
            Use a different billing address
          </span>
        </label>

        {billingAddress === "different" && (
          <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                Country/Region
              </label>
              <div className="relative">
                <select
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  <option value="Bangladesh">Bangladesh</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  ▼
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Optional Name
                </label>
                <input
                  type="text"
                  name="billingFirstName"
                  placeholder="Md Al"
                  value={formData.billingFirstName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Name (নাম)
                </label>
                <input
                  type="text"
                  name="billingLastName"
                  placeholder="Farhan"
                  value={formData.billingLastName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                Address (ঠিকানা)
              </label>
              <input
                type="text"
                name="billingAddressInput"
                placeholder="Ashulia Savar"
                value={formData.billingAddressInput}
                onChange={handleInputChange}
                className="w-full text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black caret-black"
                required
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}