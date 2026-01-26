import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetch all durations
 */
export const fetchDurations = createAsyncThunk(
    "duration/fetchDurations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/bookConsultant/duration");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch durations"
            );
        }
    }
);

/**
 * Create new duration
 */
export const createDuration = createAsyncThunk(
    "duration/createDuration",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/bookConsultant/duration",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to create duration"
            );
        }
    }
);

/**
 * Update duration
 */
export const updateDuration = createAsyncThunk(
    "duration/updateDuration",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                "/api/bookConsultant/duration",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to update duration"
            );
        }
    }
);

/**
 * Delete duration (soft delete)
 */
export const deleteDuration = createAsyncThunk(
    "duration/deleteDuration",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                "/api/bookConsultant/duration",
                { data: { id } }
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete duration"
            );
        }
    }
);

const durationSlice = createSlice({
    name: "duration",
    initialState: {
        durations: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch durations
        builder
            .addCase(fetchDurations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDurations.fulfilled, (state, action) => {
                state.loading = false;
                state.durations = action.payload;
            })
            .addCase(fetchDurations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create duration
        builder
            .addCase(createDuration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDuration.fulfilled, (state, action) => {
                state.loading = false;
                state.durations.unshift(action.payload);
            })
            .addCase(createDuration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update duration
        builder
            .addCase(updateDuration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDuration.fulfilled, (state, action) => {
                state.loading = false;
                state.durations = state.durations.map((duration) =>
                    duration.id === action.payload.id
                        ? action.payload
                        : duration
                );
            })
            .addCase(updateDuration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete duration
        builder
            .addCase(deleteDuration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDuration.fulfilled, (state, action) => {
                state.loading = false;
                state.durations = state.durations.filter(
                    (duration) => duration.id !== action.payload.id
                );
            })
            .addCase(deleteDuration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default durationSlice.reducer;
