import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all warehouse transfers
export const fetchTransfers = createAsyncThunk(
    "transfers/fetchTransfers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/transfer-warehouse");
            return response.data.data; // { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch transfers");
        }
    }
);

// Create new warehouse transfer
export const createTransfer = createAsyncThunk(
    "transfers/createTransfer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/transfer-warehouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create transfer");
        }
    }
);

// Update transfer (if you need update later)
export const updateTransfer = createAsyncThunk(
    "transfers/updateTransfer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/transfer-warehouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update transfer");
        }
    }
);

// Delete transfer (soft delete)
export const deleteTransfer = createAsyncThunk(
    "transfers/deleteTransfer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/transfer-warehouse", {
                data: { id },
            });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete transfer");
        }
    }
);

const warehouseTransferSlice = createSlice({
    name: "transfers",
    initialState: {
        transfers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch transfers
        builder
            .addCase(fetchTransfers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransfers.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers = action.payload;
            })
            .addCase(fetchTransfers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create transfer
        builder
            .addCase(createTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransfer.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers.unshift(action.payload); // Add new transfer at top
            })
            .addCase(createTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update transfer
        builder
            .addCase(updateTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTransfer.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers = state.transfers.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(updateTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete transfer
        builder
            .addCase(deleteTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTransfer.fulfilled, (state, action) => {
                state.loading = false;
                state.transfers = state.transfers.filter(
                    (item) => item.id !== action.payload.id
                );
            })
            .addCase(deleteTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default warehouseTransferSlice.reducer;
