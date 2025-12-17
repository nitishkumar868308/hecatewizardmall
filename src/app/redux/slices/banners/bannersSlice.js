import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all banners
export const fetchBanners = createAsyncThunk(
    "banner/fetchBanners",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/banner");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch banners"
            );
        }
    }
);

// Create banner
export const createBanner = createAsyncThunk(
    "banner/createBanner",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/banner", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to create banner"
            );
        }
    }
);

// Update banner
export const updateBanner = createAsyncThunk(
    "banner/updateBanner",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.put("/api/banner", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update banner"
            );
        }
    }
);

// Delete banner (soft delete)
export const deleteBanner = createAsyncThunk(
    "banner/deleteBanner",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete("/api/banner", {
                data: { id },
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete banner"
            );
        }
    }
);

/* ============================
   SLICE
============================ */

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        banners: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        /* FETCH */
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* CREATE */
        builder
            .addCase(createBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners.unshift(action.payload);
            })
            .addCase(createBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* UPDATE */
        builder
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = state.banners.map((banner) =>
                    banner.id === action.payload.id ? action.payload : banner
                );
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* DELETE */
        builder
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = state.banners.filter(
                    (banner) => banner.id !== action.payload.id
                );
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default bannerSlice.reducer;
