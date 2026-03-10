import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBangaloreInventory = createAsyncThunk(
  "bangaloreInventory/fetch",
  async (locationCode) => {
    const res = await fetch(`/api/increff/inventory?locationCode=${locationCode}`);
    console.log("bangaloreInventory", res)
    return res.json();
  }
);

export const fetchAllInventory = createAsyncThunk(
  "inventory/fetchAll",
  async () => {
    const res = await fetch("/api/increff/all-inventory", {
      headers: {
        username: "hecate_wizard_mall",
        password: "Pratiekajain9@"
      }
    });

    return res.json();
  }
);

const bangaloreInventorySlice = createSlice({
  name: "bangaloreInventory",
  initialState: {
    inventory: [],
    allInventory: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBangaloreInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBangaloreInventory.fulfilled, (state, action) => {
        state.inventory = action.payload;
        state.loading = false;
      })
      .addCase(fetchBangaloreInventory.rejected, (state) => {
        state.loading = false;
      })

      // admin all inventory
      .addCase(fetchAllInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllInventory.fulfilled, (state, action) => {
        state.allInventory = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllInventory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default bangaloreInventorySlice.reducer;