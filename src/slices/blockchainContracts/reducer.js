import {
  fetchBlockchainContracts,
  editBlockChainContract,
  updateTrustedState,
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
  },
});

export default blockchainContractsSlice.reducer;
