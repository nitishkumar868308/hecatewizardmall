import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all
export const fetchShippingPricing = createAsyncThunk(
    "shippingPricing/fetchShippingPricing",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/shipping-pricing");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch shipping pricing");
        }
    }
);


// Fetch Country Wise
export const fetchShippingPricingCountryWise = createAsyncThunk(
    "shippingPricing/fetchShippingPricingCountryWise",
    async (countryCode, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/shipping-pricing/countryWise", {
                headers: {
                    "x-country": countryCode,
                },
            });

            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch shipping pricing"
            );
        }
    }
);


// Create
export const createShippingPricing = createAsyncThunk(
    "shippingPricing/createShippingPricing",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/shipping-pricing", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create shipping pricing");
        }
    }
);

// Update
export const updateShippingPricing = createAsyncThunk(
    "shippingPricing/updateShippingPricing",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/shipping-pricing", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update shipping pricing");
        }
    }
);

// Delete
export const deleteShippingPricing = createAsyncThunk(
    "shippingPricing/deleteShippingPricing",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/shipping-pricing", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete shipping pricing");
        }
    }
);

const shippingPricingSlice = createSlice({
    name: "shippingPricing",
    initialState: {
        shippingPricings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchShippingPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShippingPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingPricings = action.payload;
            })
            .addCase(fetchShippingPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create
        builder
            .addCase(createShippingPricing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createShippingPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingPricings.unshift(action.payload);
            })
            .addCase(createShippingPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update
        builder
            .addCase(updateShippingPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingPricings = state.shippingPricings.map((p) =>
                    p.id === action.payload.id ? action.payload : p
                );
            });

        // Delete
        builder
            .addCase(deleteShippingPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingPricings = state.shippingPricings.filter(
                    (p) => p.id !== action.payload.id
                );
            });

        // Country Wise Fetch
        builder
            .addCase(fetchShippingPricingCountryWise.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShippingPricingCountryWise.fulfilled, (state, action) => {
                state.loading = false;
                state.shippingPricings = action.payload;
            })
            .addCase(fetchShippingPricingCountryWise.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export default shippingPricingSlice.reducer;
