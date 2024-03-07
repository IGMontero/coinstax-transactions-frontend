import { createSlice } from '@reduxjs/toolkit';
import { getUserAddresses } from './thunk';

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
  },
});

export const { clearUserAddresses } = userAddressesSlice.actions;

export default userAddressesSlice.reducer;
