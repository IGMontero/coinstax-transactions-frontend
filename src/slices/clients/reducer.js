import { createSlice } from '@reduxjs/toolkit';

import {
  addUserWallet,
  getUserWallets,
  deleteUserAddressWallet,
} from './thunk';

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClients: (state) => {
      state.clients = [];
    },
  },
  extraReducers: {
    [addUserWallet.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addUserWallet.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [addUserWallet.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getUserWallets.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getUserWallets.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getUserWallets.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [deleteUserAddressWallet.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteUserAddressWallet.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [deleteUserAddressWallet.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearClients } = clientsSlice.actions;

export default clientsSlice.reducer;
