import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all countries
export const fetchCountries = createAsyncThunk(
    "countries/fetchCountries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/country");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch countries");
        }
    }
);

// ✅ Create country
export const createCountry = createAsyncThunk(
    "countries/createCountry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/country", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create country");
        }
    }
);

// ✅ Update country
export const updateCountry = createAsyncThunk(
    "countries/updateCountry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/country", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update country");
        }
    }
);

// ✅ Delete country (soft delete)
export const deleteCountry = createAsyncThunk(
    "countries/deleteCountry",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/country", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete country");
        }
    }
);

const countrySlice = createSlice({
    name: "countries",
    initialState: {
        countries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // ✅ Fetch
        builder
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Create
        builder
            .addCase(createCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries.unshift(action.payload);
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Update
        builder
            .addCase(updateCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = state.countries.map((country) =>
                    country.id === action.payload.id ? action.payload : country
                );
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Delete
        builder
            .addCase(deleteCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = state.countries.filter(
                    (country) => country.id !== action.payload.id
                );
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default countrySlice.reducer;