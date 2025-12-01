import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all dispatched units
export const fetchDispatches = createAsyncThunk(
    "dispatch/fetchDispatches",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/dispatchUnitsWareHouse");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch dispatches");
        }
    }
);

// Create new dispatch (multiple units)
export const createDispatch = createAsyncThunk(
    "dispatch/createDispatch",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/dispatchUnitsWareHouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create dispatch");
        }
    }
);

// Update existing dispatch
export const updateDispatch = createAsyncThunk(
    "dispatch/updateDispatch",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/dispatchUnitsWareHouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update dispatch");
        }
    }
);

// Delete dispatch (soft delete)
export const deleteDispatch = createAsyncThunk(
    "dispatch/deleteDispatch",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/dispatchUnitsWareHouse", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete dispatch");
        }
    }
);

export const finalizeDispatch = createAsyncThunk(
    "dispatch/finalizeDispatch",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.patch("/api/dispatchUnitsWareHouse", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to finalize dispatch");
        }
    }
);


const dispatchSlice = createSlice({
    name: "dispatch",
    initialState: {
        dispatches: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch dispatches
        builder
            .addCase(fetchDispatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDispatches.fulfilled, (state, action) => {
                state.loading = false;
                state.dispatches = action.payload;
            })
            .addCase(fetchDispatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create dispatch
        builder
            .addCase(createDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDispatch.fulfilled, (state, action) => {
                state.loading = false;
                state.dispatches.unshift(action.payload); // add new dispatch
            })
            .addCase(createDispatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update dispatch
        builder
            .addCase(updateDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDispatch.fulfilled, (state, action) => {
                state.loading = false;
                state.dispatches = state.dispatches.map((d) =>
                    d.id === action.payload.id ? action.payload : d
                );
            })
            .addCase(updateDispatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete dispatch
        builder
            .addCase(deleteDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDispatch.fulfilled, (state, action) => {
                state.loading = false;
                state.dispatches = state.dispatches.filter(
                    (d) => d.id !== action.payload.id
                );
            })
            .addCase(deleteDispatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        builder
            .addCase(finalizeDispatch.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(finalizeDispatch.fulfilled, (state, action) => {
                state.loading = false;
                state.dispatches = state.dispatches.map(d => d.id === action.payload.id ? action.payload : d);
            })
            .addCase(finalizeDispatch.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message; });
    },
});

export default dispatchSlice.reducer;
