import { createSlice } from "@reduxjs/toolkit";

// 📦 localStorage থেকে প্রাথমিক ডেটা লোড করার ফাংশন
const loadWishlistFromStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem("wishlist");
    return serializedWishlist ? JSON.parse(serializedWishlist) : [];
  } catch (error) {
    console.error("Could not load wishlist from localStorage:", error);
    return [];
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ➕ উইশলিস্টে প্রোডাক্ট যোগ করা
    addToWishlist: (state, action) => {
      const product = action.payload;
      // চেক করা হচ্ছে প্রোডাক্টটি অলরেডি উইশলিস্টে আছে কি না
      const exists = state.items.some((item) => item.id === product.id);

      if (!exists) {
        state.items.push(product);
        // localStorage আপডেট করা
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },

    // ❌ উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করা
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      // localStorage আপডেট করা
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },

    // 🧹 সম্পূর্ণ উইশলিস্ট ক্লিয়ার করা (ঐচ্ছিক)
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;