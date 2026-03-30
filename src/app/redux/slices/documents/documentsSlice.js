import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Delete document
export const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/documents", {
                data: { id },
            });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete document"
            );
        }
    }
);

const documentsSlice = createSlice({
    name: "documents",
    initialState: {
        documents: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        // 🔥 Delete document
        builder
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.loading = false;

                // remove from state
                state.documents = state.documents.filter(
                    (doc) => doc.id !== action.payload.id
                );
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default documentsSlice.reducer;