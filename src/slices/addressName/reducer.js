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
      const updatedAddresses = state.addresses.map((address) => {
        if (address.value === action.payload.value) {
          return { ...address, label: action.payload.label };
        }
        return address;
      });
      if (
        !updatedAddresses.some((addr) => addr.value === action.payload.value)
      ) {
        updatedAddresses.unshift(action.payload);
      }
      state.addresses = updatedAddresses;
      setUserSavedAddresses(updatedAddresses);
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