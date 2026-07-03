import { createSlice } from '@reduxjs/toolkit';

// লোকাল স্টোরেজ থেকে আগের কার্ট ডাটা লোড করা
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
      // 👈 আপনার ডাটা অনুযায়ী এখানে variantColor এর বদলে color এবং selectedSize এর বদলে size হবে
      const { id, color, size, quantity } = action.payload;
      
      // এখন আর undefined আসবে না, পারফেক্ট ইউনিক আইডি তৈরি হবে
      const uniqueCartId = `${id}-${color}-${size}`;
      const existingItem = state.cartItems.find(
        (item) => item.uniqueCartId === uniqueCartId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          uniqueCartId, // নতুন সঠিক আইডি সেভ হচ্ছে
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    incrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.uniqueCartId === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    decrementQuantity: (state, action) => {
      const item = state.cartItems.find((item) => item.uniqueCartId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
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

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;