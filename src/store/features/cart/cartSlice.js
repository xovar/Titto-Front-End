import { createSlice } from '@reduxjs/toolkit';

// লোকাল স্টোরেজ থেকে আগের কার্ট ডাটা লোড করা (যদি থাকে)
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, variantColor, selectedSize, quantity } = action.payload;
      
      const uniqueCartId = `${id}-${variantColor}-${selectedSize}`;
      const existingItem = state.cartItems.find(
        (item) => item.uniqueCartId === uniqueCartId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          uniqueCartId,
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.uniqueCartId !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.slice ? cartSlice.actions : cartSlice.actions;
export default cartSlice.reducer;