import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout";
import Men from "../Pages/Men/Men";
import SingleProductDetail from "../Components/Shared/SingleProductDetail";
//import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    //errorElement: <NotFound />, // Catches 404s or rendering crashes
    children: [
      {
        index: true, // This means it's the default page for '/'
        element: <Home />,
      },
      {
        path: "/men", // This creates the '/men' route
        element: <Men />,
      },
      {
        path: "/product/:id", // Dynamic route parameter
        element: <SingleProductDetail />,
      },
    ],
  },
]);
