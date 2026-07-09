import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../assets/titto.logo.png";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingCart, MdOutlinePerson } from "react-icons/md";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls the mobile menu
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClassName = ({ isActive }) => {
    const baseClass =
      "block lg:inline-block font-extrabold uppercase transition-colors duration-300 py-4 lg:py-0 lg:mr-5 text-xl lg:text-base";
    if (isActive) return `${baseClass} text-red-500`;
    return `${baseClass} hover:text-red-500 ${isScrolled || isOpen ? "text-white" : "text-black"}`;
  };

  const iconClass = `cursor-pointer hover:text-red-500 transition-colors ${isScrolled ? "text-white" : "text-black"}`;

  return (
    <div
      className={`flex justify-between lg:justify-around transition-all duration-200 h-20 items-center px-6 lg:px-4 sticky top-0 z-50 [box-shadow:0_0_15px_rgba(239,68,68,0.4)] animate-[pulse-glow_3s_infinite_alternate] 
      ${isScrolled ? "bg-black" : "bg-white"}`}
    >
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 4px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 20px rgba(239, 68, 68, 0.2); }
          100% { box-shadow: 0 4px 25px 2px rgba(239, 68, 68, 0.6), 0 4px 30px rgba(239, 68, 68, 0.4); }
        }
      `}</style>

      {/* Logo Section */}
      <div className="z-50 shrink-0">
        <img src={logo} width="100px" alt="Titto Logo" />
      </div>

      {/* Navigation Links */}
      <div
        className={`absolute lg:static top-20 lg:top-auto left-0 w-full lg:w-auto bg-black lg:bg-transparent flex-col lg:flex-row items-center justify-center transition-all duration-300 ease-in-out z-40 
        ${isOpen ? "flex h-screen pb-20 opacity-100" : "hidden lg:flex lg:h-auto opacity-0 lg:opacity-100"}`}
      >
        <nav className="flex flex-col lg:flex-row text-center w-full">
          <NavLink
            className={getLinkClassName}
            to="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            className={getLinkClassName}
            to="/men"
            onClick={() => setIsOpen(false)}
          >
            Men
          </NavLink>
          <NavLink
            className={getLinkClassName}
            to="/women"
            onClick={() => setIsOpen(false)}
          >
            Women
          </NavLink>
          <NavLink
            className={getLinkClassName}
            to="/products"
            onClick={() => setIsOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
            className={getLinkClassName}
            to="/contact"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </NavLink>
        </nav>
      </div>

      {/* Right Actions Wrapper */}
      <div className="flex items-center gap-5 text-xl z-50">
        <FaRegHeart className={iconClass}  onClick={() => navigate('/wishlist')} />

        {/* 🛠️ DaisyUI Badge Component Added Here */}
        <div
          className="indicator flex items-center justify-center"
          onClick={() => navigate("/cart")}
        >
          {cartCount > 0 && (
            <span className="indicator-item badge bg-red-500 text-white font-black text-[10px] scale-90 px-1.5 h-4 min-h-4 border-none select-none">
              {cartCount}
            </span>
          )}
          <MdOutlineShoppingCart className={iconClass} />
        </div>

        <MdOutlinePerson className={`hidden sm:block ${iconClass}`} />

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden focus:outline-none transition-colors ml-2 ${isScrolled || isOpen ? "text-white" : "text-black"}`}
        >
          {isOpen ? (
            <FaTimes
              size={26}
              className={`${isScrolled ? "text-white" : "text-black"}`}
            />
          ) : (
            <FaBars size={26} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
