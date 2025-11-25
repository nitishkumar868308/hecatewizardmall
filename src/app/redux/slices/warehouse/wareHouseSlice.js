import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all warehouses
export const fetchWarehouses = createAsyncThunk(
    "warehouses/fetchWarehouses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/warehouse");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch warehouses");
        }
    }
);

// Create new warehouse
export const createWarehouse = createAsyncThunk(
    "warehouses/createWarehouse",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/warehouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create warehouse");
        }
    }
);

// Update existing warehouse
export const updateWarehouse = createAsyncThunk(
    "warehouses/updateWarehouse",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/warehouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update warehouse");
        }
    }
);

// Delete warehouse (soft delete)
export const deleteWarehouse = createAsyncThunk(
    "warehouses/deleteWarehouse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/warehouse", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete warehouse");
        }
    }
);

const warehousesSlice = createSlice({
    name: "warehouses",
    initialState: {
        warehouses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch warehouses
        builder
            .addCase(fetchWarehouses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWarehouses.fulfilled, (state, action) => {
                state.loading = false;
                state.warehouses = action.payload;
            })
            .addCase(fetchWarehouses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create warehouse
        builder
            .addCase(createWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.warehouses.unshift(action.payload); // add new warehouse
            })
            .addCase(createWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update warehouse
        builder
            .addCase(updateWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.warehouses = state.warehouses.map((wh) =>
                    wh.id === action.payload.id ? action.payload : wh
                );
            })
            .addCase(updateWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete warehouse
        builder
            .addCase(deleteWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWarehouse.fulfilled, (state, action) => {
                state.loading = false;
                state.warehouses = state.warehouses.filter(
                    (wh) => wh.id !== action.payload.id
                );
            })
            .addCase(deleteWarehouse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default warehousesSlice.reducer;
