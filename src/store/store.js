import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlice'
import cartReducer from './features/cart/cartSlice'
import wishlistReducer from './features/wishlist/wishlistSlice' // 👈 উইশলিস্ট স্লাইসটি ইমপোর্ট করা হলো

export default configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer 
  },
})