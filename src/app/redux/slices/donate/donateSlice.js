import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =============================
// Fetch all donation campaigns
// =============================
export const fetchDonations = createAsyncThunk(
    "donation/fetchDonations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/donate");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch donations");
        }
    }
);


// =============================
// Fetch donation campaigns Country Wise
// =============================
export const fetchDonationsCountryWise = createAsyncThunk(
    "donation/fetchDonationsCountryWise",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/donate/countryWise");
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch donations");
        }
    }
);

// =============================
// Create a new donation campaign
// =============================
export const createDonation = createAsyncThunk(
    "donation/createDonation",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/donate", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create donation");
        }
    }
);

// =============================
// Update a donation campaign
// =============================
export const updateDonation = createAsyncThunk(
    "donation/updateDonation",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/donate", payload);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update donation");
        }
    }
);

// =============================
// Delete a donation campaign
// =============================
export const deleteDonation = createAsyncThunk(
    "donation/deleteDonation",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete("/api/donate", { data: { id } });
            return { id }; // return deleted campaign id
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete donation");
        }
    }
);

// =============================
// User donates to a campaign
// =============================
export const donateToCampaign = createAsyncThunk(
    "donation/donateToCampaign",
    async (payload, { rejectWithValue }) => {
        try {
            // payload: { donationCampaignId, userName, amount }
            const response = await axios.post("/api/donate/user", payload);
            return response.data.data; // new UserDonation record
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to donate");
        }
    }
);

export const toggleCampaignStatus = createAsyncThunk(
    "donation/toggleCampaignStatus",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch("/api/donate/toggle", { id });
            return res.data.data;
        } catch (err) {
            return rejectWithValue("Failed to toggle campaign");
        }
    }
);


// =============================
// Fetch user donations
// =============================
export const fetchUserDonations = createAsyncThunk(
    "donation/fetchUserDonations",
    async () => {
        const response = await axios.get("/api/donate/userDonate");
        return response.data.data;
    }
);


const donationSlice = createSlice({
    name: "donation",
    initialState: {
        campaigns: [],
        userDonations: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch campaigns
        builder
            .addCase(fetchDonations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDonations.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload;
            })
            .addCase(fetchDonations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Create campaign
        builder
            .addCase(createDonation.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns.unshift(action.payload);
            });

        // Update campaign
        builder
            .addCase(updateDonation.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.campaigns = state.campaigns.map((c) =>
                    c.id === updated.id ? updated : c
                );
            });

        // Delete campaign
        builder
            .addCase(deleteDonation.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = state.campaigns.filter(
                    (c) => c.id !== action.payload.id
                );
            });

        // User donation
        builder
            .addCase(donateToCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.userDonations.push(action.payload);

                // Update campaigns userDonations array
                const campaign = state.campaigns.find(
                    (c) => c.id === action.payload.donationCampaignId
                );
                if (campaign) {
                    campaign.userDonations.push(action.payload);
                }
            });

        // Fetch user donations
        builder
            .addCase(fetchUserDonations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDonations.fulfilled, (state, action) => {
                state.loading = false;
                state.userDonations = action.payload;
            })
            .addCase(fetchUserDonations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        builder
            .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                state.campaigns = state.campaigns.map(c =>
                    c.id === updated.id ? updated : c
                );
            });

        // Country Wise Fetch
        builder
            .addCase(fetchDonationsCountryWise.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDonationsCountryWise.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload;
            })
            .addCase(fetchDonationsCountryWise.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    },
});

export default donationSlice.reducer;
