import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/titto.logo.png";
import { FaRegHeart, FaBars, FaTimes, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 🔍 Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // 🔍 Redux Store থেকে প্রোডাক্ট ডাটা আনা
  const { items: products } = useSelector((state) => state.products);

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  // 🔍 প্রোডাক্ট ফিল্টারিং
  const filteredProducts = searchTerm.trim() === "" 
    ? [] 
    : products?.filter((product) => {
        const productName = typeof product?.name === "object" ? product?.name?.name : product?.name;
        const productTitle = typeof product?.title === "object" ? product?.title?.name : product?.title;
        const term = searchTerm.toLowerCase();

        return (
          productName?.toLowerCase().includes(term) ||
          productTitle?.toLowerCase().includes(term)
        );
      });

  // 🎯 ProductCard-এর সাথে মিল রেখে ইমেজের URL বের করার লজিক
  const getProductImage = (product) => {
    const variantImage = product?.variants?.[0]?.images?.[0];
    const mainImage = product?.images?.[0];
    const singleImage = product?.image || product?.imgUrl || product?.img;

    let rawImg = variantImage || mainImage || singleImage;

    if (typeof rawImg === "object" && rawImg !== null) {
      rawImg = rawImg.url || rawImg.src || rawImg.secure_url;
    }

    if (!rawImg || typeof rawImg !== "string") {
      return "https://via.placeholder.com/100?text=No+Image";
    }

    return rawImg;
  };

  // ড্রপডাউনের বাইরে ক্লিক করলে ক্লোজ হওয়া
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // মোবাইল মেনু স্ক্রোল বন্ধ রাখা
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const getLinkClassName = ({ isActive }) => {
    const baseClass =
      "block lg:inline-block font-extrabold uppercase transition-colors duration-300 py-3 lg:py-0 text-2xl lg:text-base";
    return isActive ? `${baseClass} text-red-500` : `${baseClass} hover:text-red-500 text-white`;
  };

  const iconClass = "cursor-pointer hover:text-red-500 transition-colors text-black";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 🔴 Glow Keyframe Animation CSS */}
      <style>{`
        @keyframes pulseGlowBottom {
          0% { box-shadow: 0 8px 15px -2px rgba(239, 68, 68, 0.4); }
          100% { box-shadow: 0 16px 25px 0px rgba(239, 68, 68, 0.8); }
        }
        .animate-red-glow-mobile {
          animation: pulseGlowBottom 2s infinite alternate ease-in-out;
        }
        @media (min-width: 1024px) {
          .animate-red-glow-mobile {
            animation: none !important;
            box-shadow: none !important;
          }
        }
        .animate-red-glow-desktop {
          animation: pulseGlowBottom 2s infinite alternate ease-in-out;
        }
      `}</style>

      {/* TOP ROW: Logo, Search Bar & Actions */}
      <div className="w-full bg-white border-b border-gray-100 relative z-50 animate-red-glow-mobile">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex justify-between items-center gap-4">
            
            {/* Logo */}
            <NavLink to="/" className="shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logo} width="100px" alt="Titto Logo" />
            </NavLink>

            {/* 🔍 DESKTOP SEARCH BAR WITH DROPDOWN */}
            <div ref={searchRef} className="hidden md:flex items-center flex-1 max-w-xl mx-4 relative">
              <input
                type="text"
                placeholder="Search in..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-gray-100 text-black py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
              <FaSearch className="absolute right-3 text-gray-500 cursor-pointer" />

              {/* LIVE SEARCH RESULT DROPDOWN (DESKTOP) */}
              {isSearchOpen && searchTerm.trim() !== "" && (
                <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-b-md mt-1 max-h-80 overflow-y-auto z-50 border border-gray-100 divide-y divide-gray-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const nameText = typeof product?.name === "object" ? product?.name?.name : product?.name || product?.title;
                      const brandText = typeof product?.brand === "object" ? product?.brand?.name : product?.brand;
                      const categoryText = typeof product?.category === "object" ? product?.category?.name : product?.category;
                      const imageUrl = getProductImage(product);

                      return (
                        <div
                          key={product.id || product._id}
                          onClick={() => {
                            navigate(`/product/${product.id || product._id}`);
                            setIsSearchOpen(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={imageUrl}
                            alt={typeof nameText === "string" ? nameText : "Product"}
                            className="w-12 h-12 object-cover rounded border border-gray-200 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-800 line-clamp-1">
                              {nameText}
                            </span>
                            <span className="text-red-500 font-bold text-xs">
                              ৳{product.price}
                            </span>
                            <span className="text-[10px] text-gray-400 capitalize">
                              {brandText || categoryText || "Titto"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No products found for "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-6 text-xs font-medium shrink-0">
              {/* Track Order */}
              <div className="hidden sm:flex flex-col items-center cursor-pointer hover:text-red-500 transition-colors" onClick={() => navigate("/track-order")}>
                <FaMapMarkerAlt size={20} className={iconClass} />
                <span className="mt-1 text-black">Track Order</span>
              </div>

              {/* Wishlist */}
              <div className="flex flex-col items-center cursor-pointer hover:text-red-500 transition-colors" onClick={() => navigate("/wishlist")}>
                <div className="indicator">
                  {wishlistCount > 0 && (
                    <span className="indicator-item badge bg-red-500 text-white font-black text-[10px] px-1.5 h-4 min-h-4 border-none select-none">
                      {wishlistCount}
                    </span>
                  )}
                  <FaRegHeart size={20} className={iconClass} />
                </div>
                <span className="mt-1 hidden sm:block text-black">Wishlist</span>
              </div>

              {/* Cart */}
              <div className="flex flex-col items-center cursor-pointer hover:text-red-500 transition-colors" onClick={() => navigate("/cart")}>
                <div className="indicator">
                  {cartCount > 0 && (
                    <span className="indicator-item badge bg-red-500 text-white font-black text-[10px] px-1.5 h-4 min-h-4 border-none select-none">
                      {cartCount}
                    </span>
                  )}
                  <MdOutlineShoppingCart size={22} className={iconClass} />
                </div>
                <span className="mt-1 hidden sm:block text-black">Cart</span>
              </div>

              {/* Mobile Hamburger Toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none transition-colors ml-2 text-black">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* 🔍 MOBILE SEARCH BAR (মোবাইল ডিভাইসে দৃশ্যমান থাকবে) */}
          <div className="mt-3 md:hidden relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-gray-100 text-black py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
              />
              <FaSearch className="absolute right-3 text-gray-500" />
            </div>

            {/* LIVE SEARCH RESULT DROPDOWN (MOBILE) */}
            {isSearchOpen && searchTerm.trim() !== "" && (
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-b-md mt-1 max-h-72 overflow-y-auto z-50 border border-gray-100 divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const nameText = typeof product?.name === "object" ? product?.name?.name : product?.name || product?.title;
                    const imageUrl = getProductImage(product);

                    return (
                      <div
                        key={product.id || product._id}
                        onClick={() => {
                          navigate(`/product/${product.id || product._id}`);
                          setIsSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={imageUrl}
                          alt={typeof nameText === "string" ? nameText : "Product"}
                          className="w-10 h-10 object-cover rounded border border-gray-200 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-gray-800 line-clamp-1">
                            {nameText}
                          </span>
                          <span className="text-red-500 font-bold text-xs">
                            ৳{product.price}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500">
                    No products found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION LINKS */}
      <div className="hidden lg:block bg-black py-3 px-4 animate-red-glow-desktop">
        <nav className="flex items-center justify-center gap-8">
          <NavLink className={getLinkClassName} to="/">Home</NavLink>
          <NavLink className={getLinkClassName} to="/men">Men</NavLink>
          <NavLink className={getLinkClassName} to="/women">Women</NavLink>
          <NavLink className={getLinkClassName} to="/discounts">Discounts</NavLink>
          <NavLink className={getLinkClassName} to="/contact">Contact Us</NavLink>
        </nav>
      </div>

      {/* MOBILE FULL SCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-center">
          <NavLink className={getLinkClassName} to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink className={getLinkClassName} to="/men" onClick={() => setIsOpen(false)}>Men</NavLink>
          <NavLink className={getLinkClassName} to="/women" onClick={() => setIsOpen(false)}>Women</NavLink>
          <NavLink className={getLinkClassName} to="/discounts" onClick={() => setIsOpen(false)}>Discounts</NavLink>
          <NavLink className={getLinkClassName} to="/contact" onClick={() => setIsOpen(false)}>Contact Us</NavLink>

          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-800 text-white text-sm">
            <span className="cursor-pointer hover:text-red-500" onClick={() => { navigate("/track-order"); setIsOpen(false); }}>Track Order</span>
            <span className="cursor-pointer hover:text-red-500" onClick={() => { navigate("/login"); setIsOpen(false); }}>Sign In</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;