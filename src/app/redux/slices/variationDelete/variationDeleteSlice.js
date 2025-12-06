import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 HARD DELETE Variation
export const deleteVariation = createAsyncThunk(
    "variation/deleteVariation",
    async (variationId, { rejectWithValue }) => {
        try {
            await axios.delete("/api/products/variations", {
                data: { variationId }, // DELETE body
            });

            return { variationId };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete variation"
            );
        }
    }
);

const variationSlice = createSlice({
    name: "variation",
    initialState: {
        variations: [],   // only variations list
        loading: false,
        error: null,
    },
    reducers: {
        clearVariationState: (state) => {
            state.variations = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteVariation.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteVariation.fulfilled, (state, action) => {
                state.loading = false;

                // remove the variation from array
                state.variations = state.variations.filter(
                    (v) => v.id !== action.payload.variationId
                );
            })
            .addCase(deleteVariation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearVariationState } = variationSlice.actions;
export default variationSlice.reducer;
