import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout";
import Men from "../Pages/Men/Men";
import SingleProductDetail from "../Components/Shared/SingleProductDetail";
import Checkout from "../Components/checkout/Checkout";
import Cart from "../Components/Shared/Cart";
import Wishlist from "../Components/Shared/Wishlist";
import Women from "../Pages/Women/Women";
import Discounts from "../Pages/Discount/Discounts";
import ContactUs from "../Pages/Contact/Contact";
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
        path: "/women",
        element: <Women />,
      },
      {
        path: "/discounts",
        element: <Discounts />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/product/:id",
        element: <SingleProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
    ],
  },
]);