import { createSlice } from "@reduxjs/toolkit";
import { fetchNFTS, fetchPerformance } from "./thunk";
export const initialState = {
  transactions: [],
  performance: [],
  error: null,
};

const TransactionsSlice = createSlice({
  name: "TransactionsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNFTS.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(fetchNFTS.rejected, (state, action) => {
        state.error = action.payload.error || null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.error = action.payload.error || null;
      });
  },
});

export default TransactionsSlice.reducer;
