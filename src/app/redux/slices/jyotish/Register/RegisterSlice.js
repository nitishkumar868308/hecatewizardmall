import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================================================
   FETCH ALL ASTROLOGERS
========================================================= */
export const fetchAstrologers = createAsyncThunk(
    "astrologer/fetchAstrologers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/jyotish/register");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch astrologers"
            );
        }
    }
);

/* =========================================================
   REGISTER ASTROLOGER
========================================================= */
export const registerAstrologer = createAsyncThunk(
    "astrologer/registerAstrologer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/jyotish/register",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to register astrologer"
            );
        }
    }
);

/* =========================================================
   UPDATE ASTROLOGER
========================================================= */
export const updateAstrologer = createAsyncThunk(
    "astrologer/updateAstrologer",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                "/api/jyotish/register",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to update astrologer"
            );
        }
    }
);

/* =========================================================
   DELETE ASTROLOGER
========================================================= */
export const deleteAstrologer = createAsyncThunk(
    "astrologer/deleteAstrologer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                "/api/jyotish/register",
                { data: { id } }
            );
            return { id };
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete astrologer"
            );
        }
    }
);

/* =========================================================
   SLICE
========================================================= */
const astrologerSlice = createSlice({
    name: "astrologer",
    initialState: {
        astrologers: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAstrologerError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* ===== FETCH ===== */
        builder
            .addCase(fetchAstrologers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAstrologers.fulfilled, (state, action) => {
                state.loading = false;
                state.astrologers = action.payload;
            })
            .addCase(fetchAstrologers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ===== REGISTER ===== */
        builder
            .addCase(registerAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.astrologers.unshift(action.payload);
            })
            .addCase(registerAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ===== UPDATE ===== */
        builder
            .addCase(updateAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.astrologers = state.astrologers.map((astro) =>
                    astro.id === action.payload.id ? action.payload : astro
                );
            })
            .addCase(updateAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ===== DELETE ===== */
        builder
            .addCase(deleteAstrologer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAstrologer.fulfilled, (state, action) => {
                state.loading = false;
                state.astrologers = state.astrologers.filter(
                    (astro) => astro.id !== action.payload.id
                );
            })
            .addCase(deleteAstrologer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearAstrologerError } = astrologerSlice.actions;

export default astrologerSlice.reducer;