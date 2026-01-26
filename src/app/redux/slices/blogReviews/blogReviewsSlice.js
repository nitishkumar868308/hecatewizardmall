import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------- Async Thunks -------------------- //

// Fetch reviews for a specific blog
export const fetchBlogReviews = createAsyncThunk(
    "blogReviews/fetchBlogReviews",
    async (blogId = null, { rejectWithValue }) => {
        try {
            const url = blogId ? `/api/blog-reviews?blogId=${blogId}` : `/api/blog-reviews`;
            const response = await axios.get(url);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch reviews");
        }
    }
);


// Create new review
export const createBlogReview = createAsyncThunk(
    "blogReviews/createBlogReview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/blog-reviews", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create review");
        }
    }
);

// Update review (admin approve/reject or edit)
export const updateBlogReview = createAsyncThunk(
    "blogReviews/updateBlogReview",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/blog-reviews", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update review");
        }
    }
);

// Delete review (soft delete)
export const deleteBlogReview = createAsyncThunk(
    "blogReviews/deleteBlogReview",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/blog-reviews", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete review");
        }
    }
);

// -------------------- Slice -------------------- //

const blogReviewsSlice = createSlice({
    name: "blogReviews",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchBlogReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchBlogReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create
        builder
            .addCase(createBlogReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlogReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.unshift(action.payload); // add new review at top
            })
            .addCase(createBlogReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update
        builder
            .addCase(updateBlogReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBlogReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.map((rev) =>
                    rev.id === action.payload.id ? action.payload : rev
                );
            })
            .addCase(updateBlogReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete
        builder
            .addCase(deleteBlogReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlogReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(
                    (rev) => rev.id !== action.payload.id
                );
            })
            .addCase(deleteBlogReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default blogReviewsSlice.reducer;
