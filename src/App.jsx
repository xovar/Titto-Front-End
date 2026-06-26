import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { setProducts, setLoading, setError } from './store/features/products/productsSlice';
// 1. Import the Toastify components and styles here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';


export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        dispatch(setLoading(true));
        
        const response = await axios.get('http://localhost:5000/api/products');
        
        // রিডাক্স স্টোরে ডাটা সেট করে দিন
        dispatch(setProducts(response.data));
      } catch (err) {
        dispatch(setError(err.message || 'Something went wrong'));
        console.error("Error fetching products:", err);
      }
    };

    fetchInitialProducts();
  }, [dispatch]); //
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