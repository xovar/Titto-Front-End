import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';

// 1. Import the Toastify components and styles here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
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