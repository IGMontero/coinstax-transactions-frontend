import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNFTS,
  fetchPerformance,
  fetchAssets,
  fetchHistory,
} from "./thunk";
export const initialState = {
  transactions: [],
  performance: [],
  assets: [],
  history: [],
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
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.error = action.payload.error || null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.error = action.payload.error || null;
      });
  },
});

export default TransactionsSlice.reducer;