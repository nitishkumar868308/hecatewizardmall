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


// UPDATE SKU MAPPING
export const updateSkuMapping = createAsyncThunk(
    "skuMapping/updateSkuMapping",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/sku-mapping", payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to update SKU Mapping"
            );
        }
    }
);


// DELETE SKU MAPPING
export const deleteSkuMapping = createAsyncThunk(
    "skuMapping/deleteSkuMapping",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/sku-mapping", {
                data: payload
            });

            return { ...response.data, id: payload.id };

        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to delete SKU Mapping"
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
            })


            // UPDATE MAPPING
            .addCase(updateSkuMapping.fulfilled, (state, action) => {
                if (action.payload?.data) {

                    const index = state.mappings.findIndex(
                        (item) => item.id === action.payload.data.id
                    );

                    if (index !== -1) {
                        state.mappings[index] = action.payload.data;
                    }
                }
            })


            // DELETE MAPPING
            .addCase(deleteSkuMapping.fulfilled, (state, action) => {

                state.mappings = state.mappings.filter(
                    (item) => item.id !== action.payload.id
                );

            });

    },
});

export const { resetSkuMappingState } = skuMappingSlice.actions;

export default skuMappingSlice.reducer;