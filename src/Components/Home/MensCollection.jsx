import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import ProductCard from "../Shared/ProductCard"; // Home/ থেকে Shared/ এ যেতে ../Shared

const ROWS = 3;
const COLS = 4;
const MAX_PRODUCTS = ROWS * COLS; // 12

export default function MensCollection() {
  const { items: products, loading } = useSelector((state) => state.products);

  const mensProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products
      .filter((product) => Number(product.gender) === 1)
      .slice(0, MAX_PRODUCTS); // ৩ রো x ৪ কলাম = ১২টার বেশি দেখাবে না
  }, [products]);

  if (loading) {
    return (
      <div className="w-full py-16 text-center text-neutral-500">
        Loading Men's Collection...
      </div>
    );
  }

  if (!mensProducts || mensProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 px-4 lg:px-8 font-sans select-none">
      <div className="max-w-360 mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Men's Collection
          </h2>
          <p className="text-neutral-500 text-sm mt-2">
            Elevate your style with our premium men's fashion.
          </p>
        </div>

        {/* PRODUCT GRID — lg:grid-cols-4 দিয়েই 3 row x 4 col বজায় থাকে,
            যতক্ষণ mensProducts.length <= 12 (MAX_PRODUCTS দিয়ে guaranteed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mensProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* SEE MORE BUTTON */}
        <div className="mt-12 flex justify-center">
          <NavLink
            to="/men"
            className="btn btn-outline btn-error hover:text-white hover:bg-red-500 rounded-none px-8"
          >
            SEE MORE
          </NavLink>
        </div>
      </div>
    </div>
  );
}