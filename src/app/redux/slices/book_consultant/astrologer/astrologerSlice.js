import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetch all astrologers
 */
export const fetchAstrologers = createAsyncThunk(
    "astrologer/fetchAstrologers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/bookConsultant/astrologer");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch astrologers");
        }
    }
);

/**
 * Create new astrologer
 */
export const createAstrologer = createAsyncThunk(
    "astrologer/createAstrologer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/bookConsultant/astrologer", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create astrologer");
        }
    }
);

/**
 * Update astrologer
 */
export const updateAstrologer = createAsyncThunk(
    "astrologer/updateAstrologer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/bookConsultant/astrologer", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update astrologer");
        }
    }
);

/**
 * Delete astrologer (soft delete)
 */
export const deleteAstrologer = createAsyncThunk(
    "astrologer/deleteAstrologer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/bookConsultant/astrologer", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete astrologer");
        }
    }
);

// Toggle active status
export const toggleAstrologerActive = createAsyncThunk(
    "astrologer/toggleActive",
    async (id, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState().astrologers;
            const astro = state.list.find(a => a.id === id);
            if (!astro) throw new Error("Astrologer not found");

            const response = await axios.put("/api/bookConsultant/astrologer", {
                id,
                active: !astro.active,
            });

            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to toggle active status");
        }
    }
);


const astrologerSlice = createSlice({
    name: "astrologer",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch astrologers
        builder
            .addCase(fetchAstrologers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAstrologers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAstrologers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create astrologer
        builder
            .addCase(createAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
            })
            .addCase(createAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update astrologer
        builder
            .addCase(updateAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.map((astro) =>
                    astro.id === action.payload.id ? action.payload : astro
                );
            })
            .addCase(updateAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete astrologer
        builder
            .addCase(deleteAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((astro) => astro.id !== action.payload.id);
            })
            .addCase(deleteAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Toggle Active
        builder
            .addCase(toggleAstrologerActive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleAstrologerActive.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.map(astro =>
                    astro.id === action.payload.id ? action.payload : astro
                );
            })
            .addCase(toggleAstrologerActive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export default astrologerSlice.reducer;
