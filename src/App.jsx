import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
// ⚡ ১. এখানে setBrands অ্যাকশনটি যোগ করা হলো
import { setProducts, setLoading, setError, setCategories, setColor, setBrands } from './store/features/products/productsSlice';
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
        // ⏳ ডেটা ফেচ শুরু হওয়ার আগে মাত্র একবার গ্লোবাল লোডিং TRUE করা হলো
        dispatch(setLoading(true));

        // 🚀 ২. এখানে brandsData ভ্যারিয়েবলটি অ্যারেতে যোগ করা হলো
        const [productsData, categoriesData, colorsData, brandsData] = await Promise.all([
          products.fetchProducts(),
          products.fetchCategories(),
          products.fetchColors(),
          products.fetchBrands() // এপিআই কল হচ্ছে
        ]);

        // 🎉 ৩. সব ডেটা চলে আসার পর রেডাক্সে সেট করা হলো
        dispatch(setProducts(productsData));
        dispatch(setCategories(categoriesData));
        dispatch(setColor(colorsData));
        dispatch(setBrands(brandsData)); // ⚡ ব্র্যান্ডের ডেটা রেডাক্সে ডিসপ্যাচ করা হলো

      } catch (err) {
        // কোনো একটি এপিআই ফেইল করলেও এরর ক্যাচ হবে এবং স্পিনার বন্ধ হবে
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