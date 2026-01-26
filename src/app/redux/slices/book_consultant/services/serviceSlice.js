import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetch all services
 */
export const fetchServices = createAsyncThunk(
    "service/fetchServices",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/bookConsultant/services");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch services"
            );
        }
    }
);

/**
 * Create new service
 * payload example:
 * {
 *   title,
 *   shortDesc,
 *   longDesc,
 *   image,
 *   active,
 *   prices: [{ durationId, price }]
 * }
 */
export const createService = createAsyncThunk(
    "service/createService",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/bookConsultant/services",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to create service"
            );
        }
    }
);

/**
 * Update service
 */
export const updateService = createAsyncThunk(
    "service/updateService",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                "/api/bookConsultant/services",
                payload
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to update service"
            );
        }
    }
);

/**
 * Delete service (soft delete)
 */
export const deleteService = createAsyncThunk(
    "service/deleteService",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                "/api/bookConsultant/services",
                { data: { id } }
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete service"
            );
        }
    }
);

const serviceSlice = createSlice({
    name: "service",
    initialState: {
        services: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

        /* ================= FETCH ================= */
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ================= CREATE ================= */
        builder
            .addCase(createService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.loading = false;
                state.services.unshift(action.payload);
            })
            .addCase(createService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ================= UPDATE ================= */
        builder
            .addCase(updateService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.loading = false;
                state.services = state.services.map((service) =>
                    service.id === action.payload.id
                        ? action.payload
                        : service
                );
            })
            .addCase(updateService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        /* ================= DELETE ================= */
        builder
            .addCase(deleteService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.loading = false;
                state.services = state.services.filter(
                    (service) => service.id !== action.payload.id
                );
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default serviceSlice.reducer;
