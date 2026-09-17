import { useSelector as useReduxSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../Shared/ProductCard"; // ⚠️ আপনার সঠিক ফাইল পাথ দিন

export default function CategoryWiseSections() {
  // Redux Store থেকে products, categories এবং loading স্টেট আনা হলো
  const { items: products = [], categories = [], loading } = useReduxSelector(
    (state) => state.products || {}
  );

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#ea4c3b]"></span>
        <p className="text-sm text-neutral-400 font-bold uppercase mt-4 tracking-wider">
          Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-10 space-y-16">
      {categories.map((category) => {
        // ১. প্রতিটি ক্যাটাগরি অনুযায়ী প্রডাক্ট ফিল্টার (Maximum 8 items - 2 Rows)
        const categoryProducts = products
          .filter((product) => {
            return (
              (product.category && String(product.category.id) === String(category.id)) ||
              String(product.category_id) === String(category.id) ||
              (product.category && product.category.name === category.name)
            );
          })
          .slice(0, 8);

        // প্রডাক্ট না থাকলে ক্যাটাগরি সেকশন স্কিপ করবে
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} className="max-w-360 mx-auto px-4 md:px-8">
            
            {/* SECTION HEADING */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                {category.name}
              </h2>
              <div className="w-12 h-1 bg-[#ea4c3b] mx-auto rounded-full mt-2 mb-1"></div>
            </div>

            {/* PRODUCT GRID (4 Columns Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                />
              ))}
            </div>

            {/* LINK TO CATEGORY PRODUCTS PAGE */}
            <div className="mt-8 text-center">
              <Link
                to={`/shop?category=${category.id}`}
                className="inline-block text-xs font-bold text-neutral-600 hover:text-[#ea4c3b] uppercase tracking-widest border-b-2 border-transparent hover:border-[#ea4c3b] pb-1 transition-all"
              >
                View All {category.name} &rarr;
              </Link>
            </div>

          </section>
        );
      })}
    </div>
  );
}