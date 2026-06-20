import { NavLink } from "react-router-dom";
import logo from "../../assets/titto.logo.png";
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingCart, MdOutlinePerson } from "react-icons/md";
import { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controls the mobile menu

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

  // 1. Cleanly handles all text colors without string interpolation bugs
  const getLinkClassName = ({ isActive }) => {
    const baseClass = "block lg:inline-block font-extrabold uppercase transition-colors duration-300 py-4 lg:py-0 lg:mr-5 text-xl lg:text-base";
    
    if (isActive) return `${baseClass} text-red-500`;
    
    // If mobile menu is open OR page is scrolled, text must be white. Otherwise, black.
    return `${baseClass} hover:text-red-500 ${isScrolled || isOpen ? 'text-white' : 'text-black'}`;
  };

  // 2. Icon colors helper
  const iconClass = `cursor-pointer hover:text-red-500 transition-colors ${isScrolled ? 'text-white' : 'text-black'}`;

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

      {/* Navigation Links (Desktop Row & Mobile Overlay) */}
      <div 
        className={`absolute lg:static top-20 lg:top-auto left-0 w-full lg:w-auto bg-black lg:bg-transparent flex-col lg:flex-row items-center justify-center transition-all duration-300 ease-in-out z-40 
        ${isOpen ? "flex h-screen pb-20 opacity-100" : "hidden lg:flex lg:h-auto opacity-0 lg:opacity-100"}`}
      >
        <nav className="flex flex-col lg:flex-row text-center w-full">
          {/* onClick closes the menu when a link is clicked on mobile */}
          <NavLink className={getLinkClassName} to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink className={getLinkClassName} to="/men" onClick={() => setIsOpen(false)}>Men</NavLink>
          <NavLink className={getLinkClassName} to="/women" onClick={() => setIsOpen(false)}>Women</NavLink>
          <NavLink className={getLinkClassName} to="/products" onClick={() => setIsOpen(false)}>Products</NavLink>
          <NavLink className={getLinkClassName} to="/contact" onClick={() => setIsOpen(false)}>Contact Us</NavLink>
        </nav>
      </div>

      {/* Right Actions Wrapper (Icons & Hamburger Menu) */}
      <div className="flex items-center gap-5 text-xl z-50">
        {/* Utility Icons */}
        <FaRegHeart className={iconClass} />
        <MdOutlineShoppingCart className={iconClass} />
        <MdOutlinePerson className={`hidden sm:block ${iconClass}`} /> {/* Hides person icon on very small screens to save space */}

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`lg:hidden focus:outline-none transition-colors ml-2 ${isScrolled || isOpen ? "text-white" : "text-black"}`}
        >
          {isOpen ? <FaTimes size={26} className={`${isScrolled ? 'text-white' : 'text-black'}`} /> : <FaBars size={26} />}
        </button>
      </div>
    </div>
  );
}

export default Navbar;