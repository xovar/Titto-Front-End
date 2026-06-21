import { FaFacebook, FaTwitter, FaInstagram, FaApple, FaGooglePlay } from "react-icons/fa";

export default function FooterNewsletter() {
  return (
    <div className="w-full bg-black text-white pt-16 pb-8 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-300 mx-auto">
        
        {/* PURPLE NEWSLETTER BANNER */}
        <div className="bg-[#b096ea] rounded-[2.5rem] p-10 md:p-16 text-black text-center mb-20 relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Heading with the line */}
            <div className="flex items-center justify-center gap-4 w-full mb-6">
              <h2 className="text-3xl md:text-[2.75rem] font-bold tracking-tight whitespace-nowrap">
                Get discounts instantly
              </h2>
              {/* Decorative line */}
              <div className="hidden md:block h-px bg-black/30 flex-1 mt-2"></div>
            </div>

            <p className="text-[15px] md:text-base font-medium leading-relaxed max-w-150 mb-10 text-black/80">
              To save you just have to log in to your account and look for the experiences with the green or yellow color code. On your first reservation you can enjoy a <span className="font-bold">10% discount</span>.
            </p>

            {/* Email Input Group */}
            <div className="w-full max-w-lg bg-white rounded-full p-1.5 flex items-center shadow-lg focus-within:ring-2 ring-black/20 transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-none focus:outline-none px-6 text-black placeholder-neutral-400 text-sm md:text-base"
              />
              <button className="btn bg-black hover:bg-neutral-800 text-white border-none rounded-full px-8 min-h-0 h-12 font-medium tracking-wide">
                Get started
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER LINKS SECTION */}
        <footer className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16 text-sm">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4 pr-4">
            <h6 className="text-lg font-bold text-white mb-2 tracking-wide">Sign up for our newsletter</h6>
            <p className="text-neutral-400 leading-relaxed">
              Don't worry, we reserve our newsletter for important news so we only send a few updates a year.
            </p>
            <button className="btn btn-outline btn-sm rounded-full text-white border-white hover:bg-white hover:text-black w-max mt-4 px-6 h-10">
              Subscribe
            </button>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h6 className="text-lg font-bold text-white mb-2 tracking-wide">Help and services</h6>
            <a className="link link-hover text-neutral-400">How does it work</a>
            <a className="link link-hover text-neutral-400">FAQS</a>
            <a className="link link-hover text-neutral-400">Contact</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h6 className="text-lg font-bold text-white mb-2 tracking-wide">To explore</h6>
            <a className="link link-hover text-neutral-400">Accommodations</a>
            <a className="link link-hover text-neutral-400">Experiences</a>
            <a className="link link-hover text-neutral-400">Blog</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4">
            <h6 className="text-lg font-bold text-white mb-2 tracking-wide">Other possibilities</h6>
            <a className="link link-hover text-neutral-400">Give away</a>
            <a className="link link-hover text-neutral-400">subscribe</a>
            
            {/* App Store Buttons */}
            <div className="flex flex-col xl:flex-row gap-3 mt-4">
              <button className="btn btn-outline border-neutral-600 hover:border-white text-white rounded-full flex items-center gap-2 px-4 bg-transparent h-12">
                <FaApple size={20} />
                <div className="text-left leading-tight">
                  <span className="block text-[9px] text-neutral-400 uppercase">Download on the</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </div>
              </button>
              <button className="btn btn-outline border-neutral-600 hover:border-white text-white rounded-full flex items-center gap-2 px-4 bg-transparent h-12">
                <FaGooglePlay size={18} />
                <div className="text-left leading-tight">
                  <span className="block text-[9px] text-neutral-400 uppercase">Android App On</span>
                  <span className="block text-sm font-semibold">Google play</span>
                </div>
              </button>
            </div>
          </div>
        </footer>

        {/* BOTTOM BAR */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-sm">© 2026 Tiito</p>
          <div className="flex items-center gap-6 text-white">
            <a href="#" className="hover:text-neutral-400 transition-colors"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-neutral-400 transition-colors"><FaTwitter size={24} /></a>
            <a href="#" className="hover:text-neutral-400 transition-colors"><FaInstagram size={24} /></a>
          </div>
        </div>

      </div>
    </div>
  );
}