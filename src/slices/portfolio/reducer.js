import { createSlice } from '@reduxjs/toolkit';

import {
  getAssetsPortfolio,
  getBalancesPortfolio,
  fetchNFTSPortfolio,
} from './thunk';

const initialState = {
  assets: [],
  balances: [],
  nfts: [],
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearPortfolio: (state) => {
      state.assets = [];
      state.balances = [];
      state.nfts = [];
    },
  },
  extraReducers: {
    [getAssetsPortfolio.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getAssetsPortfolio.fulfilled]: (state, action) => {
      state.assets = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getAssetsPortfolio.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getBalancesPortfolio.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getBalancesPortfolio.fulfilled]: (state, action) => {
      state.balances = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getBalancesPortfolio.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchNFTSPortfolio.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchNFTSPortfolio.fulfilled]: (state, action) => {
      state.nfts = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchNFTSPortfolio.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
