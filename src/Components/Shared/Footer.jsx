
import { Link, NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/titto.logo.png"

export default function FooterNewsletter() {
  return (
    <footer className="w-full bg-black text-neutral-300 pt-12 pb-8 px-6 md:px-12 lg:px-20 font-sans border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        
        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <NavLink to="/" className="text-2xl cursor-pointer font-bold text-white tracking-wider">
              <img src={logo} className="h-10" alt="" />
            </NavLink>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Savar Sena Shopping Complex, Level 2, Shop Number 322, Savar, Dhaka.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-[#ea4c3b] cursor-pointer transition-colors w-max">Home</Link>
              <Link to="/men" className="hover:text-[#ea4c3b] cursor-pointer transition-colors w-max">Men</Link>
              <Link to="/women" className="hover:text-[#ea4c3b] cursor-pointer transition-colors w-max">Women</Link>
              <Link to="/discounts" className="hover:text-[#ea4c3b] cursor-pointer transition-colors w-max">Discounts</Link>
              <Link to="/contact" className="hover:text-[#ea4c3b] cursor-pointer transition-colors w-max">Contact Us</Link>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wide">Contact Us</h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#ea4c3b]" /> 01703-305033
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#ea4c3b]" /> support@titto.com.bd
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© 2026 Titto. All rights reserved.</p>
          
          <div className="flex items-center gap-5 text-neutral-400">
            <a href="https://www.facebook.com/Tittofootwear" className="hover:text-[#ea4c3b] cursor-pointer transition-colors"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-[#ea4c3b] cursor-pointer transition-colors"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-[#ea4c3b] cursor-pointer transition-colors"><FaInstagram size={18} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}