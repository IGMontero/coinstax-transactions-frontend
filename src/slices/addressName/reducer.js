import { createSlice } from '@reduxjs/toolkit';
import {
  getUserSavedAddresses,
  setUserSavedAddresses,
} from '../../helpers/cookies_helper';

const initialState = {
  addresses: getUserSavedAddresses(),
};

const addressNameSlice = createSlice({
  name: 'addressName',
  initialState,
  reducers: {
    setAddressName: (state, action) => {
      const index = state.addresses.findIndex(
        (addr) => addr.value === action.payload.value,
      );
      if (index !== -1) {
        const [existingAddress] = state.addresses.splice(index, 1);
        state.addresses.unshift({ ...existingAddress, ...action.payload });
      } else {
        state.addresses.unshift(action.payload);
      }
      setUserSavedAddresses(state.addresses);
    },
    removeAddressName: (state, action) => {
      const updatedAddresses = state.addresses.filter(
        (address) => address.value !== action.payload.value,
      );
      state.addresses = updatedAddresses;
      setUserSavedAddresses(updatedAddresses);
    },
  },
});

export const { setAddressName, removeAddressName } = addressNameSlice.actions;
export default addressNameSlice.reducer;
