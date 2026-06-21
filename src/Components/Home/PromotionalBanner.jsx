
export default function PromotionalBanner() {
  return (
    // Main Container
    <div className="relative w-full bg-[#f4f5f7] overflow-hidden min-h-100 flex items-center font-sans select-none my-8">
      
      {/* MOBILE RED BACKGROUND: Only shows on smaller screens, creates an angled top */}
      <div 
        className="block md:hidden absolute bottom-0 right-0 w-full h-[60%] bg-[#ea4c3b] z-0"
        style={{
          clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0% 100%)",
        }}
      />
      
      {/* DESKTOP RED BACKGROUND: Only shows on medium+ screens, creates an angled left side */}
      <div 
        className="hidden md:block absolute bottom-0 right-0 h-full w-[55%] bg-[#ea4c3b] z-0"
        style={{
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />

      {/* HALFTONE DOT PATTERN OVERLAY */}
      <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 z-0 bg-[radial-gradient(circle,black_2px,transparent_2px)] bg-size-[10px_10px]" />

      {/* CONTENT GRID */}
      <div className="relative z-10 max-w-360 mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 py-12 md:py-16">
        
        {/* LEFT COLUMN: TEXT CONTENT */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left z-20">
          <h3 className="text-[#ea4c3b] text-2xl md:text-3xl font-light mb-2">
            Saving 50%
          </h3>
          <h1 className="text-4xl md:text-[3.5rem] leading-tight font-extrabold text-neutral-800 mb-4 tracking-tight">
            All Online Store
          </h1>
          <p className="text-neutral-500 text-sm md:text-sm tracking-wide uppercase font-medium mb-8">
            Offer available all shoes & products
          </p>
          <button className="btn bg-[#ea4c3b] hover:bg-[#d63d2e] text-white border-none rounded-none px-10 font-bold tracking-wide shadow-md">
            Shop Now
          </button>
        </div>

        {/* RIGHT COLUMN: IMAGE & GRAPHICS */}
        <div className="relative flex justify-center items-center h-75 md:h-auto z-20">
          
          {/* "NEW" OUTLINE TEXT */}
          <div 
            className="absolute left-[10%] md:left-[-10%] top-1/2 -translate-y-1/2 rotate-[-65deg] text-6xl md:text-8xl font-black tracking-[0.3em] opacity-80 pointer-events-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #ea4c3b",
            }}
          >
            NEW
          </div>

          {/* MAIN PRODUCT IMAGE */}
          <img
            src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" 
            alt="Running Shoes"
            className="w-[85%] md:w-full max-w-125 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] -rotate-12 hover:scale-105 transition-transform duration-500 z-10 relative"
          />
        </div>

      </div>
    </div>
  );
}