import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Delete penalty
export const deletePenalty = createAsyncThunk(
    "penalties/deletePenalty",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/penality", {
                data: { id },
            });

            return response.data; // ✅ expect { id, message }
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete penalty"
            );
        }
    }
);

const penaltiesSlice = createSlice({
    name: "penalties",
    initialState: {
        penalties: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        // 🔥 Delete penalty
        builder
            .addCase(deletePenalty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePenalty.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ remove from state
                state.penalties = state.penalties.filter(
                    (p) => p.id !== action.payload.id
                );
            })
            .addCase(deletePenalty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default penaltiesSlice.reducer;