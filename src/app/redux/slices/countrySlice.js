import { createSlice } from "@reduxjs/toolkit";

const countrySlice = createSlice({
    name: "country",
    initialState: "IND",
    reducers: {
        setCountry: (state, action) => action.payload,
    },
});

export const { setCountry } = countrySlice.actions;
export default countrySlice.reducer;
