import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlice'
import cartReducer from './features/cart/cartSlice'
import wishlistReducer from './features/wishList/wishListSlice' 
import orderReducer from './features/order/orderSlice' // 👈 নতুন অর্ডার স্লাইস ইমপোর্ট করা হলো

export default configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer, // 👈 রেডিউসারে যুক্ত করা হলো
  },
})