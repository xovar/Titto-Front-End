import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 Live Base API URL
const BASE_URL = "https://api.titto.com.bd/api";
const API_URL = `${BASE_URL}/banners`;

// ==========================================
// 1. Fetch All Banners (GET https://api.titto.com.bd/api/banners)
// ==========================================
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch banners!"
      );
    }
  }
);

// ==========================================
// 2. Fetch Single Banner by ID (GET https://api.titto.com.bd/api/banners/:id)
// ==========================================
export const getBannerById = createAsyncThunk(
  "banner/getBannerById",
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${bannerId}`);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch banner details!"
      );
    }
  }
);

// ==========================================
// 3. Create New Banner (POST https://api.titto.com.bd/api/banners)
// ==========================================
export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, bannerData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create banner!"
      );
    }
  }
);

// ==========================================
// 4. Update Banner (PUT https://api.titto.com.bd/api/banners/:id)
// ==========================================
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bannerData);
      const resData = response.data?.data || response.data;
      return { id, ...(typeof resData === "object" ? resData : {}), ...bannerData };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update banner!"
      );
    }
  }
);

// ==========================================
// 5. Delete Banner (DELETE https://api.titto.com.bd/api/banners/:id)
// ==========================================
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${bannerId}`);
      return bannerId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete banner!"
      );
    }
  }
);

// ==========================================
// SLICE DEFINITION
// ==========================================
const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    items: [],
    selectedBanner: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetBannerState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.selectedBanner = null;
    },
    clearSelectedBanner: (state) => {
      state.selectedBanner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🖼️ FETCH BANNERS
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔍 GET BANNER BY ID
      .addCase(getBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBanner = action.payload;
      })
      .addCase(getBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE BANNER
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ✏️ UPDATE BANNER
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.items.findIndex(
          (item) => String(item.id || item._id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // 🗑️ DELETE BANNER
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => String(item.id || item._id) !== String(action.payload)
        );
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBannerState, clearSelectedBanner } = bannerSlice.actions;
export default bannerSlice.reducer;