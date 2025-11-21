import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all states
export const fetchStates = createAsyncThunk(
    "states/fetchStates",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/state");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch states");
        }
    }
);

// Create new state
export const createState = createAsyncThunk(
    "states/createState",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/state", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create state");
        }
    }
);

// Update existing state
export const updateState = createAsyncThunk(
    "states/updateState",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/state", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update state");
        }
    }
);

// Delete state (soft delete)
export const deleteState = createAsyncThunk(
    "states/deleteState",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/state", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete state");
        }
    }
);

const stateSlice = createSlice({
    name: "states",
    initialState: {
        states: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch states
        builder
            .addCase(fetchStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create state
        builder
            .addCase(createState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createState.fulfilled, (state, action) => {
                state.loading = false;
                state.states.unshift(action.payload);
            })
            .addCase(createState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update state
        builder
            .addCase(updateState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateState.fulfilled, (state, action) => {
                state.loading = false;
                state.states = state.states.map((st) =>
                    st.id === action.payload.id ? action.payload : st
                );
            })
            .addCase(updateState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete state
        builder
            .addCase(deleteState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteState.fulfilled, (state, action) => {
                state.loading = false;
                state.states = state.states.filter(
                    (st) => st.id !== action.payload.id
                );
            })
            .addCase(deleteState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default stateSlice.reducer;
