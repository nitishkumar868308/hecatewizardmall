import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =============================
// Fetch all promo codes
// =============================
export const fetchPromoCodes = createAsyncThunk(
    "promoCode/fetchPromoCodes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/promo_code");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch promo codes");
        }
    }
);

// =============================
// Create a new promo code
// =============================
export const createPromoCode = createAsyncThunk(
    "promoCode/createPromoCode",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/promo_code", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create promo code");
        }
    }
);

// =============================
// Update a promo code
// =============================
export const updatePromoCode = createAsyncThunk(
    "promoCode/updatePromoCode",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/promo_code", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update promo code");
        }
    }
);

// =============================
// Delete (soft delete) a promo code
// =============================
export const deletePromoCode = createAsyncThunk(
    "promoCode/deletePromoCode",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/promo_code", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete promo code");
        }
    }
);

const promoCodeSlice = createSlice({
    name: "promoCode",
    initialState: {
        promoCodes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchPromoCodes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromoCodes.fulfilled, (state, action) => {
                state.loading = false;
                state.promoCodes = action.payload;
            })
            .addCase(fetchPromoCodes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create
        builder
            .addCase(createPromoCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPromoCode.fulfilled, (state, action) => {
                state.loading = false;
                state.promoCodes.unshift(action.payload);
            })
            .addCase(createPromoCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update
        builder
            .addCase(updatePromoCode.fulfilled, (state, action) => {
                state.loading = false;
                const updatedPromo = action.payload; // action.payload = { id, code, ... }
                if (updatedPromo?.id) {
                    state.promoCodes = state.promoCodes.map((p) =>
                        p.id === updatedPromo.id ? updatedPromo : p
                    );
                }
            });


        // Delete
        builder
            .addCase(deletePromoCode.fulfilled, (state, action) => {
                state.loading = false;
                state.promoCodes = state.promoCodes.filter(
                    (p) => p.id !== action.payload.id
                );
            });
    },
});

export default promoCodeSlice.reducer;
