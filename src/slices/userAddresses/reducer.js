import { createSlice } from '@reduxjs/toolkit';
import {
  getUserAddresses,
  deleteUsersAddress,
  refreshAllTransactions,
} from './thunk';

const initialState = {
  userAddresses: [],
  loading: false,
  error: null,
};

const userAddressesSlice = createSlice({
  name: 'userAddresses',
  initialState,
  reducers: {
    clearUserAddresses: (state) => {
      state.userAddresses = [];
    },
  },
  extraReducers: {
    [getUserAddresses.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getUserAddresses.fulfilled]: (state, action) => {
      state.userAddresses = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getUserAddresses.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [refreshAllTransactions.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [refreshAllTransactions.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [refreshAllTransactions.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteUsersAddress.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteUsersAddress.fulfilled]: (state, action) => {
      state.userAddresses = state.userAddresses.filter(
        (address) => address.id !== action.payload.id,
      );
      state.loading = false;
      state.error = null;
    },
    [deleteUsersAddress.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearUserAddresses } = userAddressesSlice.actions;

export default userAddressesSlice.reducer;
