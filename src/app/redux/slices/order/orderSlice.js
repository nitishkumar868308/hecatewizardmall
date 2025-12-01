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
            const res = await axios.get(`/api/orders/`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch Orders");
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
    },
});

export default orderSlice.reducer;
