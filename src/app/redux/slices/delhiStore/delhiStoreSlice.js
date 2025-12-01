import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all dispatches for Delhi Store
export const fetchDelhiStore = createAsyncThunk(
    "delhiStore/fetchDelhiStore",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/delhiStore");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch Delhi Store dispatches");
        }
    }
);

const delhiStoreSlice = createSlice({
    name: "delhiStore",
    initialState: {
        store: [], // <-- changed from dispatches to store
        loading: false,
        error: null,
    },
    reducers: {
        clearDelhiStoreState: (state) => {
            state.store = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDelhiStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDelhiStore.fulfilled, (state, action) => {
                state.loading = false;
                state.store = action.payload; // <-- store data in store
            })
            .addCase(fetchDelhiStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearDelhiStoreState } = delhiStoreSlice.actions;
export default delhiStoreSlice.reducer;
