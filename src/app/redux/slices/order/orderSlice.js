// redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create order and get Cashfree payment token
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/orders", orderData); // Your backend API
            return res.data; // Should return { orderId, cashfreeToken, amount, currency, ... }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create order");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: { order: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
