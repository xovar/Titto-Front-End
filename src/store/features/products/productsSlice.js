import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  categories: [],
  colors: [],
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
  },
});

export const { setProducts, setLoading, setError, setCategories, setColor } =
  productSlice.actions;
export default productSlice.reducer;
