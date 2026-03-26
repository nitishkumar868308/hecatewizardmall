import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all cities
export const fetchCities = createAsyncThunk(
    "cities/fetchCities",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/countryCity");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch cities");
        }
    }
);

// ✅ Create city
export const createCity = createAsyncThunk(
    "cities/createCity",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/countryCity", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create city");
        }
    }
);

// ✅ Update city
export const updateCity = createAsyncThunk(
    "cities/updateCity",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/countryCity", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update city");
        }
    }
);

// ✅ Delete city (soft delete)
export const deleteCity = createAsyncThunk(
    "cities/deleteCity",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/countryCity", { data: { id } });
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete city");
        }
    }
);

const citySlice = createSlice({
    name: "cities",
    initialState: {
        cities: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // ✅ Fetch
        builder
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Create
        builder
            .addCase(createCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCity.fulfilled, (state, action) => {
                state.loading = false;
                state.cities.unshift(action.payload);
            })
            .addCase(createCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Update
        builder
            .addCase(updateCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCity.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = state.cities.map((city) =>
                    city.id === action.payload.id ? action.payload : city
                );
            })
            .addCase(updateCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // ✅ Delete
        builder
            .addCase(deleteCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = state.cities.filter(
                    (city) => city.id !== action.payload.id
                );
            })
            .addCase(deleteCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default citySlice.reducer;