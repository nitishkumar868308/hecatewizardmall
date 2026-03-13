import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// CREATE SKU MAPPING
export const createSkuMapping = createAsyncThunk(
    "skuMapping/createSkuMapping",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/sku-mapping", payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to create SKU Mapping"
            );
        }
    }
);


// GET ALL SKU MAPPINGS
export const fetchSkuMappings = createAsyncThunk(
    "skuMapping/fetchSkuMappings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/sku-mapping");
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch SKU Mappings"
            );
        }
    }
);


const skuMappingSlice = createSlice({
    name: "skuMapping",

    initialState: {
        mappings: [],
        loading: false,
        success: false,
        error: null,
    },

    reducers: {
        resetSkuMappingState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // CREATE MAPPING
            .addCase(createSkuMapping.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(createSkuMapping.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                if (action.payload?.data) {
                    state.mappings.push(action.payload.data);
                }
            })

            .addCase(createSkuMapping.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || action.error.message;
            })


            // FETCH MAPPINGS
            .addCase(fetchSkuMappings.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchSkuMappings.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.data) {
                    state.mappings = action.payload.data;
                }
            })

            .addCase(fetchSkuMappings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export const { resetSkuMappingState } = skuMappingSlice.actions;

export default skuMappingSlice.reducer;