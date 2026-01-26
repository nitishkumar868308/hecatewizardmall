import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --------------------- Async Thunks ---------------------

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/blog");
            return response.data.data; // API returns { message, data }
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch blogs");
        }
    }
);

// Create new blog
export const createBlog = createAsyncThunk(
    "blogs/createBlog",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/blog", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create blog");
        }
    }
);

// Update existing blog
export const updateBlog = createAsyncThunk(
    "blogs/updateBlog",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/blog", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update blog");
        }
    }
);

// Delete blog (soft delete)
export const deleteBlog = createAsyncThunk(
    "blogs/deleteBlog",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/blog", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete blog");
        }
    }
);

// --------------------- Slice ---------------------

const blogSlice = createSlice({
    name: "blogs",
    initialState: {
        blogs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch blogs
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create blog
        builder
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs.unshift(action.payload); // Add new blog at start
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Update blog
        builder
            .addCase(updateBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.map((blog) =>
                    blog.id === action.payload.id ? action.payload : blog
                );
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Delete blog
        builder
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.filter((blog) => blog.id !== action.payload.id);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default blogSlice.reducer;
