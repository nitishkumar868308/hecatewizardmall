import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Increff Order
export const createIncreffOrder = createAsyncThunk(
    "increffOrder/createIncreffOrder",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/xpress-order", payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to create Increff Order"
            );
        }
    }
);

const increffOrderSlice = createSlice({
    name: "increffOrder",
    initialState: {
        order: null,
        loading: false,
        success: false,
        error: null,
    },

    reducers: {
        resetIncreffOrderState: (state) => {
            state.order = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(createIncreffOrder.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(createIncreffOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })

            .addCase(createIncreffOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetIncreffOrderState } = increffOrderSlice.actions;

export default increffOrderSlice.reducer;