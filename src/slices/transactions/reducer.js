import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNFTS,
  fetchPerformance,
  fetchAssets,
  fetchHistory,
} from './thunk';
export const initialState = {
  transactions: [],
  performance: [],
  assets: [],
  history: [],
  error: null,
};

const TransactionsSlice = createSlice({
  name: 'TransactionsSlice',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchNFTS.pending]: (state) => {
      state.loading = true;
    },
    [fetchNFTS.fulfilled]: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchNFTS.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchPerformance.pending]: (state) => {
      state.loading = true;
    },
    [fetchPerformance.fulfilled]: (state, action) => {
      state.performance = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchPerformance.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchAssets.pending]: (state) => {
      state.loading = true;
    },
    [fetchAssets.fulfilled]: (state, action) => {
      state.assets = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchAssets.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchHistory.pending]: (state) => {
      state.loading = true;
    },
    [fetchHistory.fulfilled]: (state, action) => {
      state.history = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchHistory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default TransactionsSlice.reducer;
