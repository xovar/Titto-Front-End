import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout";
import Men from "../Pages/Men/Men";
import SingleProductDetail from "../Components/Shared/SingleProductDetail";
import Checkout from "../Components/Shared/Checkout"; 
//import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    //errorElement: <NotFound />, 
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "/men", 
        element: <Men />,
      },
      {
        path: "/product/:id", 
        element: <SingleProductDetail />,
      },
      {
        path: "/checkout", 
        element: <Checkout />,
      },
    ],
  },
]);