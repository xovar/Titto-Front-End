import { FaTruck, FaRegCreditCard, FaHeadset } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaTruck className="text-white text-3xl" />,
    title: "Nationwide Delivery",
  },
  {
    id: 2,
    icon: <FaRegCreditCard className="text-white text-3xl" />,
    title: "Safe Payment",
  },
  {
    id: 3,
    icon: <FaHeadset className="text-white text-3xl" />,
    title: "24/7 Support",
  },
];

export default function FeaturesSection() {
  return (
    <div className="w-full bg-white py-16 px-4 md:px-8">
      
      {/* Custom spinning/scaling animation for the dashed border on hover */}
      <style>{`
        @keyframes subtleSpin {
          from { transform: translate(0%, 0%) rotate(0deg); }
          to { transform: translate(0%, 0%) rotate(360deg); }
        }
        .animate-border-spin {
          animation: subtleSpin 20s linear infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {features.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col items-center justify-center cursor-pointer select-none"
          >
            
            {/* ICON CONTAINER WRAPPER */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              
              {/* The Interactive Dashed Outer Ring (Appears smoothly on hover) */}
              <div className="absolute top-1/2 left-1/2 w-full h-full border-2 border-dashed border-red-500 rounded-full opacity-0 scale-75 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-110 pointer-events-none animate-border-spin" />
              
              {/* The Inner Solid Green Circle holding the Icon */}
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-sm relative z-10">
                {item.icon}
              </div>

            </div>

            {/* TEXT STRINGS */}
            <h4 className="font-sans font-medium text-xl text-neutral-800 mb-2 tracking-wide group-hover:text-red-500 transition-colors duration-200">
              {item.title}
            </h4>
            
            

          </div>
        ))}
      </div>
    </div>
  );
}