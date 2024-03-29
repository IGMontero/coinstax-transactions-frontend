import {
  fetchBlockchainContracts,
  editBlockChainContract,
  updateTrustedState,
  setAllAsDirty,
  deleteBlockchainContract,
} from './thunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contracts: [],
  loading: false,
  error: null,
};

const blockchainContractsSlice = createSlice({
  name: 'blockchainContracts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchBlockchainContracts.pending]: (state) => {
      state.loading = true;
    },
    [fetchBlockchainContracts.fulfilled]: (state, action) => {
      state.contracts = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchBlockchainContracts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [editBlockChainContract.pending]: (state) => {
      state.loading = true;
    },
    [editBlockChainContract.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [editBlockChainContract.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateTrustedState.pending]: (state) => {
      state.loading = true;
    },
    [updateTrustedState.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [updateTrustedState.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [setAllAsDirty.pending]: (state) => {
      state.loading = true;
    },
    [setAllAsDirty.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [setAllAsDirty.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteBlockchainContract.pending]: (state) => {
      state.loading = true;
    },
    [deleteBlockchainContract.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [deleteBlockchainContract.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default blockchainContractsSlice.reducer;
