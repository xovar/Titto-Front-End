import { useSelector, useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";
import { removeFromWishlist } from "../../store/features/wishList/wishListSlice"; 
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 📥 Redux Store থেকে উইশলিস্টের ডেটা আনা হচ্ছে
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];

  // ❌ উইশলিস্ট থেকে আইটেম রিমুভ করার হ্যান্ডলার (stopPropagation যোগ করা হয়েছে)
  const handleRemove = (e, id) => {
    e.stopPropagation(); // 👈 এই লাইনটি রো-এর ক্লিক ইভেন্টকে (navigate) ট্রিগার করা থেকে আটকাবে
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left">
      <h2 className="text-2xl font-black uppercase tracking-wider mb-8 border-b pb-4">
        My Wishlist ({wishlistItems.length})
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 font-medium">Your wishlist is empty!</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* 💻 Desktop Table View */}
          <table className="w-full hidden md:table border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 text-xs font-bold uppercase tracking-wider text-left">
                <th className="pb-4 w-30">Product</th>
                <th className="pb-4">Details</th>
                <th className="pb-4 w-37.5">Stock Status</th>
                <th className="pb-4 w-37.5 text-right">Price</th>
                <th className="pb-4 w-25 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {wishlistItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="group cursor-pointer hover:bg-neutral-50 transition-colors" 
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {/* Image */}
                  <td className="py-5">
                    <div className="w-24 h-24 border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center p-2">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="object-contain w-full h-full" 
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-5 pr-4 align-middle">
                    <h3 className="font-black text-sm uppercase tracking-wide text-neutral-900 hover:text-red-500 transition-colors">
                      {item.name}
                    </h3>
                  </td>

                  {/* Stock Status */}
                  <td className="py-5 align-middle">
                    {item.inStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Out of Stock
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-5 align-middle text-right font-black text-sm text-neutral-900">
                    Tk {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  {/* Actions */}
                  <td className="py-5 align-middle text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={(e) => handleRemove(e, item.id)} // 👈 ইভেন্ট পাস করা হয়েছে
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer z-10"
                        title="Remove"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📱 Mobile Responsive List View */}
          <div className="md:hidden space-y-4">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="border border-neutral-200 rounded-xl p-4 flex gap-4 relative bg-white cursor-pointer" 
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {/* Remove Button Mobile */}
                <button
                  onClick={(e) => handleRemove(e, item.id)} // 👈 ইভেন্ট পাস করা হয়েছে
                  className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 cursor-pointer z-10"
                >
                  <FiX className="w-5 h-5" />
                </button>

                {/* Image */}
                <div className="w-20 h-20 border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center p-2 shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-contain w-full h-full" 
                  />
                </div>

                {/* Details content */}
                <div className="flex flex-col justify-between w-full pr-6 text-left">
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-wide text-neutral-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="mt-1.5">
                      {item.inStock ? (
                        <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">In Stock</span>
                      ) : (
                        <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-black text-sm text-neutral-900">
                      Tk {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}