import { createSlice } from '@reduxjs/toolkit';

import {
  addUserWallet,
  getUserWallets,
  deleteUserAddressWallet,
  getCurrentUserPortfolioSummary,
} from './thunk';

const userWalletsSlice = createSlice({
  name: 'userWallets',
  initialState: {
    userPortfolio: [],
    userPortfolioSummary: {
      addresses: [],
    },
    status: 'idle',
    error: null,
    loaders: {
      userWallets: false,
      userPortfolioSummary: false,
    },
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
    [getCurrentUserPortfolioSummary.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.userPortfolioSummary = action.payload;
    },
    [getCurrentUserPortfolioSummary.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [getCurrentUserPortfolioSummary.pending]: (state) => {
      state.status = 'loading';
    },
    [addUserWallet.pending]: (state) => {
      state.status = 'loading';
    },
    [addUserWallet.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Asegúrate de que el payload está en el formato correcto
      const newWallet = action.payload;
      state.userPortfolioSummary.addresses.push(newWallet);
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
      state.userPortfolioSummary.addresses =
        state.userPortfolioSummary.addresses.filter(
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
    setUserPortfolioSummary: (state, action) => {
      state.userPortfolioSummary = {
        ...state.userPortfolioSummary,
        addresses: action.payload,
      };
      state.loaders.userPortfolioSummary = false;
    },
  },
});

export const { setLoader, setUserPortfolioSummary } = userWalletsSlice.actions;

export default userWalletsSlice.reducer;
