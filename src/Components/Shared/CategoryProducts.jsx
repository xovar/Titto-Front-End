
import { useSelector } from "react-redux";
import { useSearchParams, useParams, Link } from "react-router-dom";
import ProductCard from "../Shared/ProductCard"; // ⚠️ আপনার সঠিক ফাইল পাথ দিন
import { useMemo } from "react";

export default function CategoryProducts() {
  // ১. URL Search Params (যেমন: /shop?category=id) এবং Route Params (যেমন: /category/:id) নেওয়া
  const [searchParams] = useSearchParams();
  const { id: routeCategoryId } = useParams();

  // query param অথবা route param থেকে category id নির্ধারণ
  const selectedCategoryId = searchParams.get("category") || routeCategoryId;

  // ২. Redux Store থেকে products এবং categories ডাটা আনা
  const { items: products = [], categories = [], loading } = useSelector(
    (state) => state.products || {}
  );

  // ৩. কারেন্ট সিলেক্টেড ক্যাটাগরির বিস্তারিত তথ্য বের করা
  const currentCategory = useMemo(() => {
    return categories.find(
      (cat) => String(cat.id) === String(selectedCategoryId)
    );
  }, [categories, selectedCategoryId]);

  // ৪. ওই নির্দিষ্ট ক্যাটাগরির সব প্রডাক্ট ফিল্টার করা
  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;

    return products.filter((product) => {
      const matchId =
        (product.category && String(product.category.id) === String(selectedCategoryId)) ||
        String(product.category_id) === String(selectedCategoryId);

      const matchName =
        product.category &&
        product.category.name.toLowerCase() === selectedCategoryId.toLowerCase();

      return matchId || matchName;
    });
  }, [products, selectedCategoryId]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#ea4c3b]"></span>
        <p className="text-sm text-neutral-400 font-bold uppercase mt-4 tracking-wider">
          Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-10 min-h-[80vh]">
      <div className="max-w-360 mx-auto px-4 md:px-8">
        
        {/* BREADCRUMB NAV */}
        <div className="text-xs text-neutral-400 mb-6 uppercase tracking-wider font-semibold">
          <Link to="/" className="hover:text-[#ea4c3b] transition-colors">
            Home
          </Link>{" "}
          / <span className="text-neutral-800">{currentCategory?.name || "Category Products"}</span>
        </div>

        {/* PAGE TITLE & PRODUCT COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-8 gap-2">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 capitalize">
              {currentCategory?.name || "Category Products"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Showing all products under this category
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
            {filteredProducts.length} Items Found
          </span>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          /* NO PRODUCTS FOUND STATE */
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200/60 rounded-2xl my-6">
            <h3 className="text-lg font-bold text-neutral-700 mb-2">
              No Products Available
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
              There are currently no products listed under this category.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#ea4c3b] text-white font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow-md hover:bg-neutral-900 transition-all"
            >
              Back To Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}