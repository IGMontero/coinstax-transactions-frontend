import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNFTS,
  fetchPerformance,
  fetchAssets,
  fetchHistory,
  downloadTransactions,
} from './thunk';

export const initialState = {
  transactions: [],
  performance: [],
  assets: [],
  history: [],
  error: null,
  loadingNFTs: false,
  loadingPerformance: false,
  loadingAssets: false,
  loadingHistory: false,
  downloadingTransactions: false,
};

const TransactionsSlice = createSlice({
  name: 'TransactionsSlice',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchNFTS.pending]: (state) => {
      state.loadingNFTs = true;
    },
    [fetchNFTS.fulfilled]: (state, action) => {
      state.transactions = action.payload;
      state.loadingNFTs = false;
      state.error = null;
    },
    [fetchNFTS.rejected]: (state, action) => {
      state.loadingNFTs = false;
      state.error = action.payload;
    },
    [fetchPerformance.pending]: (state) => {
      state.loadingPerformance = true;
    },
    [fetchPerformance.fulfilled]: (state, action) => {
      state.performance = action.payload;
      state.loadingPerformance = false;
      state.error = null;
    },
    [fetchPerformance.rejected]: (state, action) => {
      state.loadingPerformance = false;
      state.error = action.payload;
    },
    [fetchAssets.pending]: (state) => {
      state.loadingAssets = true;
    },
    [fetchAssets.fulfilled]: (state, action) => {
      state.assets = action.payload;
      state.loadingAssets = false;
      state.error = null;
    },
    [fetchAssets.rejected]: (state, action) => {
      state.loadingAssets = false;
      state.error = action.payload;
    },
    [fetchHistory.pending]: (state) => {
      state.loadingHistory = true;
    },
    [fetchHistory.fulfilled]: (state, action) => {
      state.history = action.payload;
      state.loadingHistory = false;
      state.error = null;
    },
    [fetchHistory.rejected]: (state, action) => {
      state.loadingHistory = false;
      state.error = action.payload;
    },
    [downloadTransactions.pending]: (state) => {
      state.downloadingTransactions = true;
    },
    [downloadTransactions.fulfilled]: (state) => {
      state.downloadingTransactions = false;
    },
    [downloadTransactions.rejected]: (state, action) => {
      state.downloadingTransactions = false;
      state.error = action.payload;
    },
  },
});

export default TransactionsSlice.reducer;
