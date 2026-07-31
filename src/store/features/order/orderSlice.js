import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 Live Base API URL
const BASE_URL = "https://api.titto.com.bd/api";
const API_URL = `${BASE_URL}/orders`;

// ==========================================
// 1. Create New Order (POST https://api.titto.com.bd/api/orders)
// ==========================================
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      // 🔑 ব্যাকএন্ড এখন নিজেই ডাটাবেজ থেকে দাম ও ডিসকাউন্ট হিসেব করবে, 
      // তাই ফ্রন্টএন্ড থেকে সরাসরি ক্লিন পে-লোড পাঠানো হচ্ছে।
      const response = await axios.post(API_URL, orderData);
      return response.data; // { message, orderId }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order placement failed!"
      );
    }
  }
);

// ==========================================
// 2. Get Single Order Details by ID (GET https://api.titto.com.bd/api/orders/:id)
// ==========================================
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`);
      return response.data; // Single Order Object with items
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details!"
      );
    }
  }
);

// ==========================================
// SLICE DEFINITION
// ==========================================
const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🛒 CREATE ORDER CASES
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // 📦 GET ORDER BY ID CASES
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;