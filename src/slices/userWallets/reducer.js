import { createSlice } from '@reduxjs/toolkit';

import {
  addUserWallet,
  getUserWallets,
  deleteUserAddressWallet,
  getPortfolioWallets,
} from './thunk';

const userWalletsSlice = createSlice({
  name: 'userWallets',
  initialState: {
    userPortfolio: [],
    status: 'idle',
    error: null,
  },

  extraReducers: {
    [getUserWallets.pending]: (state) => {
      state.status = 'loading';
    },
    [getUserWallets.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userPortfolio = action.payload;
    },
    [getUserWallets.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [addUserWallet.pending]: (state) => {
      state.status = 'loading';
    },
    [addUserWallet.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userPortfolio.push(action.payload);
    },
    [addUserWallet.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [deleteUserAddressWallet.pending]: (state) => {
      state.status = 'loading';
    },
    [deleteUserAddressWallet.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userPortfolio = state.userPortfolio.filter(
        (wallet) => wallet.id !== action.payload.id,
      );
    },
    [deleteUserAddressWallet.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export default userWalletsSlice.reducer;
