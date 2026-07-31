import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // এখানে আপনার ফর্ম সাবমিট লজিক বা API কল করতে পারেন
    alert("ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            আপনার কোনো প্রশ্ন বা সাহায্য লাগবে? আমাদের সাথে যোগাযোগ করতে নিচের মাধ্যমগুলো ব্যবহার করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTACT INFO CARDS (Left Side) */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Address Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-red-50 text-[#ea4c3b] rounded-xl shrink-0">
                <FaMapMarkerAlt size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Our Address</h3>
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  Savar Sena Shopping Complex, Level 2, Shop Number 322, Savar, Dhaka.
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-red-50 text-[#ea4c3b] rounded-xl shrink-0">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Phone Number</h3>
                <a
                  href="tel:01831698522"
                  className="mt-1 block text-sm text-neutral-600 hover:text-[#ea4c3b] transition-colors font-medium"
                >
                  01831698522
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-red-50 text-[#ea4c3b] rounded-xl shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Email Address</h3>
                <a
                  href="mailto:support@titto.com.bd"
                  className="mt-1 block text-sm text-neutral-600 hover:text-[#ea4c3b] transition-colors font-medium"
                >
                  support@titto.com.bd
                </a>
              </div>
            </div>

          </div>

          {/* CONTACT FORM (Right Side) */}
          <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#ea4c3b] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#ea4c3b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#ea4c3b] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#ea4c3b] focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#ea4c3b] text-white font-bold text-sm rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <FaPaperPlane size={14} /> Send Message
              </button>
            </form>
          </div>

        </div>

        {/* MAP SECTION (Savar Sena Shopping Complex Embed) */}
        <div className="mt-12 bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden p-2">
          <iframe
            title="Sena Shopping Complex Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.332308722889!2d90.2589578!3d23.9018029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755ebb2f4b4fdbd%3A0x8dd338b2575239e2!2sSena%20Shopping%20Complex!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "0.75rem" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </div>
  );
}