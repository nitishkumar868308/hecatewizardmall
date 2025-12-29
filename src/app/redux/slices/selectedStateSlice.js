import { createSlice } from "@reduxjs/toolkit";

const initialState = typeof window !== "undefined"
    ? localStorage.getItem("selectedState") || ""  // page reload ke liye
    : "";

const selectedStateSlice = createSlice({
    name: "selectedState",
    initialState,
    reducers: {
        setSelectedState: (state, action) => action.payload,
    },
});

export const { setSelectedState } = selectedStateSlice.actions;
export default selectedStateSlice.reducer;
