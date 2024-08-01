import { createSlice } from '@reduxjs/toolkit';

import {
  addUserWallet,
  getUserWallets,
  deleteUserAddressWallet,
  getUserPortfolioSummary,
} from './thunk';

const userWalletsSlice = createSlice({
  name: 'userWallets',
  initialState: {
    userPortfolio: [],
    status: 'idle',
    error: null,
    loaders: {
      userWallets: false,
      userPortfolioSummary: false,
    }
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
    [getUserPortfolioSummary.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userPortfolioSummary = action.payload;
      // state.loaders.userPortfolioSummary = false;
    },
    [getUserPortfolioSummary.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      // state.loaders.userPortfolioSummary = false;
    },
    [getUserPortfolioSummary.pending]: (state) => {
      state.status = 'loading';
      // state.loaders.userPortfolioSummary = true;
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

  reducers: {
    setLoader: (state, action) => {
      const { loader, value } = action.payload;
      state.loaders[loader] = value;
    },
  },
});

export const { setLoader } = userWalletsSlice.actions;

export default userWalletsSlice.reducer;
