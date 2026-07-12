import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  categories: [],
  colors: [],
  brands: [], // ⚡ ১. ব্র্যান্ডের জন্য খালি অ্যারে যোগ করা হলো
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    setColor: (state, action) => {
      state.colors = action.payload;
      state.loading = false;
    },
    // ⚡ ২. ব্র্যান্ডের ডাটা স্টেটে সেভ করার রিডিউসার
    setBrands: (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    },
  },
});

// ⚡ ৩. অ্যাকশন হিসেবে setBrands-কে এক্সপোর্ট করা হলো
export const { setProducts, setLoading, setError, setCategories, setColor, setBrands } =
  productSlice.actions;
export default productSlice.reducer;