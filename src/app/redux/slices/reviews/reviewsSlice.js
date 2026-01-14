import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------- Async Thunks --------------------

// Fetch all reviews (approved only)
export const fetchReviews = createAsyncThunk(
    "reviews/fetchReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/reviews");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch reviews");
        }
    }
);

// Submit new review
export const createReview = createAsyncThunk(
    "reviews/createReview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/reviews", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to submit review");
        }
    }
);

// Update review (admin: approve/decline)
export const updateReview = createAsyncThunk(
    "reviews/updateReview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/reviews", payload);
            return response.data
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update review");
        }
    }
);

// Delete review (soft delete)
export const deleteReview = createAsyncThunk(
    "reviews/deleteReview",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/reviews", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete review");
        }
    }
);

// -------------------- Slice --------------------
const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch reviews
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create review
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.unshift(action.payload); // Add to top
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update review
        builder
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.map((review) =>
                    review.id === action.payload.data.id ? action.payload.data : review
                );
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete review
        builder
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(
                    (review) => review.id !== action.payload.id
                );
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default reviewsSlice.reducer;
