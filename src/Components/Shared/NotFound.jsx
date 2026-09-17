
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] bg-white flex flex-col items-center justify-center px-4 font-sans select-none py-12">
      <div className="max-w-md w-full text-center">
        {/* BIG 404 TEXT */}
        <h1 className="text-8xl md:text-9xl font-black text-neutral-900 tracking-tighter">
          4<span className="text-[#ea4c3b]">0</span>4
        </h1>

        {/* DECORATIVE LINE */}
        <div className="w-16 h-1 bg-[#ea4c3b] mx-auto rounded-full my-4"></div>

        {/* HEADING & SUBTITLE */}
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 uppercase tracking-wide mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto bg-[#ea4c3b] text-white hover:bg-neutral-900 font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto border-2 border-neutral-200 text-neutral-700 hover:border-[#ea4c3b] hover:text-[#ea4c3b] font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 active:scale-95"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}