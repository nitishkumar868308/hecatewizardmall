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

// Update Delhi Store Item
export const updateDelhiStore = createAsyncThunk(
    "delhiStore/updateDelhiStore",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/delhiStore", payload); // send payload as-is
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update Delhi Store"
            );
        }
    }
);

export const deleteDelhiStore = createAsyncThunk(
    "delhiStore/deleteDelhiStore",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/delhiStore", { data: { id } }); // <-- body
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete Delhi Store item");
        }
    }
);



const delhiStoreSlice = createSlice({
    name: "delhiStore",
    initialState: {
        store: [],
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
            })

            .addCase(updateDelhiStore.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDelhiStore.fulfilled, (state, action) => {
                state.loading = false;

                // Replace updated item in store list
                state.store = state.store.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(updateDelhiStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(deleteDelhiStore.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDelhiStore.fulfilled, (state, action) => {
                state.loading = false;
                state.store = state.store.filter((item) => item.id !== action.payload.id);
            })
            .addCase(deleteDelhiStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });


    },
});

export const { clearDelhiStoreState } = delhiStoreSlice.actions;
export default delhiStoreSlice.reducer;
