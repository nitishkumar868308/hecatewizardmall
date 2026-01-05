// redux/slices/warehouseSelectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    warehouseId: null,
    warehouseCode: null,
    pincode: null,
};

const warehouseSelectionSlice = createSlice({
    name: "warehouseSelection",
    initialState,
    reducers: {
        setWarehouseSelection: (state, action) => {
            state.warehouseId = action.payload.warehouseId;
            state.warehouseCode = action.payload.warehouseCode;
            state.pincode = action.payload.pincode;
        },
        clearWarehouseSelection: (state) => {
            state.warehouseId = null;
            state.warehouseCode = null;
            state.pincode = null;
        },
    },
});

export const {
    setWarehouseSelection,
    clearWarehouseSelection,
} = warehouseSelectionSlice.actions;

export default warehouseSelectionSlice.reducer;
