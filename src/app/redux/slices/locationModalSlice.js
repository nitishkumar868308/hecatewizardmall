import { createSlice } from "@reduxjs/toolkit";

const locationModalSlice = createSlice({
    name: "locationModal",
    initialState: {
        open: false,
    },
    reducers: {
        openLocationModal: (state) => {
            state.open = true;
        },
        closeLocationModal: (state) => {
            state.open = false;
        },
    },
});

export const { openLocationModal, closeLocationModal } = locationModalSlice.actions;
export default locationModalSlice.reducer;
