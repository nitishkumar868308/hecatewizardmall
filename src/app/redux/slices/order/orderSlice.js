import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/orders", orderData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create order");
        }
    }
);

export const fetchOrders = createAsyncThunk(
    "delhiStore/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/orders/`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch Orders");
        }
    }
);

// ✅ Update Order
export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/api/orders`, orderData);
            return res.data.data; // returning updated order
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update order");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: null,
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // 🟢 Create Order
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

        // 🔵 Fetch Orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // 🟠 Update Order
        builder
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific order in orders array
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                // Also update the current order if it matches
                if (state.order?.id === action.payload.id) {
                    state.order = action.payload;
                }
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
