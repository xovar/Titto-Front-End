import { FiHelpCircle } from "react-icons/fi";

export default function DeliveryForm({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-neutral-900">Delivery</h2>

      <div>
        <label className="block text-[11px] font-medium text-neutral-500 mb-1">
          Country/Region
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
        >
          <option value="Bangladesh">Bangladesh</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            First Name (Optional)
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Last Name (নাম)
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
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
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            City/District (শহর/জেলা)
          </label>
          <input
            type="text"
            name="cityDistrict"
            value={formData.cityDistrict}
            onChange={handleInputChange}
            className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
            required
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-500 mb-1">
            Postal code (optional)
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black caret-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-neutral-500 mb-1">
          Mobile Number (মোবাইল নম্বর)
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            name="phone"
            placeholder="(01XXXXXXXXX)"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black pl-12 caret-black relative z-10 bg-transparent"
            required
          />
          <div className="absolute left-3 flex items-center gap-1 text-sm text-neutral-500 select-none z-0 pointer-events-none">
            <span className="text-base">🇧🇩</span>
          </div>
          <FiHelpCircle className="absolute right-3 text-neutral-400 w-4 h-4 z-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}