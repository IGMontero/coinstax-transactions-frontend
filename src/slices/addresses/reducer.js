import { createSlice } from '@reduxjs/toolkit';
import { getAddressesSuggestions, getAddressesInfo } from './thunk';

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
  isFirstLoad: true,
  addressSummary: {},
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setIsFirstLoad: (state, action) => {
      state.isFirstLoad = action.payload;
    },
    setAddressSummary: (state, action) => {
      state.addressSummary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddressesSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddressesSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAddressesSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAddressesInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddressesInfo.fulfilled, (state, action) => {
        state.error = null;
        state.addressSumamary = action.payload || {};
        state.loading = false;
      })
      .addCase(getAddressesInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsFirstLoad, setAddressSummary } = addressesSlice.actions;
export const selectIsFirstLoad = (state) => state.addresses.isFirstLoad;
export const addressSummary = (state) => state.addresses.addressSumamary;
export default addressesSlice.reducer;
