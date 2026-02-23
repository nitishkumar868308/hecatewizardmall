import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   Fetch All Adjustments
========================= */
export const fetchOrderAdjustments = createAsyncThunk(
    "orderAdjustments/fetchOrderAdjustments",
    async (orderId) => {
        const res = await fetch(
            `/api/order-adjustments?orderId=${orderId}`
        );
        const data = await res.json();
        return data.data;
    }
);

/* =========================
   Create Adjustment
========================= */
export const createOrderAdjustment = createAsyncThunk(
    "orderAdjustments/createOrderAdjustment",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/order-adjustments",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to create order adjustment"
            );
        }
    }
);

/* =========================
   Mark As Paid
========================= */
export const markAdjustmentPaid = createAsyncThunk(
    "orderAdjustments/markAdjustmentPaid",
    async (paymentTxnId, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/order-adjustments", {
                paymentTxnId,
            });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to mark adjustment as paid"
            );
        }
    }
);

/* =========================
   Cancel Adjustment
========================= */
export const cancelOrderAdjustment = createAsyncThunk(
    "orderAdjustments/cancelOrderAdjustment",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                "/api/order-adjustments",
                { data: { id } }
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to cancel order adjustment"
            );
        }
    }
);

/* =========================
   Slice
========================= */
const orderAdjustmentsSlice = createSlice({
    name: "orderAdjustments",
    initialState: {
        adjustments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        /* Fetch */
        builder
            .addCase(fetchOrderAdjustments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderAdjustments.fulfilled, (state, action) => {
                state.loading = false;
                state.adjustments = action.payload;
            })
            .addCase(fetchOrderAdjustments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* Create */
        builder
            .addCase(createOrderAdjustment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderAdjustment.fulfilled, (state, action) => {
                state.loading = false;
                state.adjustments.unshift(action.payload);
            })
            .addCase(createOrderAdjustment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* Mark Paid */
        builder
            .addCase(markAdjustmentPaid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAdjustmentPaid.fulfilled, (state, action) => {
                state.loading = false;
                state.adjustments = state.adjustments.map((adj) =>
                    adj.id === action.payload.id ? action.payload : adj
                );
            })
            .addCase(markAdjustmentPaid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* Cancel */
        builder
            .addCase(cancelOrderAdjustment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrderAdjustment.fulfilled, (state, action) => {
                state.loading = false;
                state.adjustments = state.adjustments.map((adj) =>
                    adj.id === action.payload.id ? action.payload : adj
                );
            })
            .addCase(cancelOrderAdjustment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default orderAdjustmentsSlice.reducer;