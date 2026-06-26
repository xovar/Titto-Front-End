import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlice'
import cartReducer from './features/cart/cartSlice'

export default configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer
  },
})