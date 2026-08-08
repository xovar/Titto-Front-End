import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlice'
import cartReducer from './features/cart/cartSlice'
import wishlistReducer from './features/wishList/wishListSlice' 
import orderReducer from './features/order/orderSlice'
import bannerReducer from './features/banner/bannerSlice' // 👈 ব্যানার স্লাইস ইমপোর্ট করা হলো

export default configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    banner: bannerReducer, // 👈 ব্যানার রিডিউসার স্টোরে যুক্ত করা হলো
  },
})