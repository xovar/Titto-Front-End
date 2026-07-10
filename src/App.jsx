import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { setProducts, setLoading, setError, setCategories, setColor } from './store/features/products/productsSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { products } from './Api/Products/ProductsApi';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllInitialData = async () => {
      try {
        // ⏳ ১. ডেটা ফেচ শুরু হওয়ার আগে মাত্র একবার গ্লোবাল লোডিং TRUE করা হলো
        dispatch(setLoading(true));

        // 🚀 ২. Promise.all ব্যবহার করে ৩টি এপিআই রিকোয়েস্ট একসাথে (প্যারালালি) পাঠানো হলো
        const [productsData, categoriesData, colorsData] = await Promise.all([
          products.fetchProducts(),
          products.fetchCategories(),
          products.fetchColors()
        ]);

        // 🎉 ৩. সব ডেটা চলে আসার পর রেডাক্সে সেট করা হলো (স্পিনার অটোমেটিক স্টপ হবে)
        dispatch(setProducts(productsData));
        dispatch(setCategories(categoriesData));
        dispatch(setColor(colorsData));

      } catch (err) {
        // ⚠️ কোনো একটি এপিআই ফেইল করলেও এরর ক্যাচ হবে এবং স্পিনার বন্ধ হবে
        dispatch(setError(err.message || 'Something went wrong while loading shop data.'));
        console.error("Error fetching initial shop data:", err);
      }
    };

    fetchAllInitialData();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      
      {/* 2. Place the container here so it's globally active across all routes */}
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        theme="light"
        style={{ zIndex: 99999 }} // Ensures it floats above modals
      />
    </>
  );
}