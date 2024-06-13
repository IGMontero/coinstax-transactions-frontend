import { createSlice } from '@reduxjs/toolkit';
import { getAddressesSuggestions, getAddressesInfo } from './thunk';

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
  isFirstLoad: true,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setIsFirstLoad: (state, action) => {
      state.isFirstLoad = action.payload;
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
      .addCase(getAddressesInfo.pending, (state) => {})
      .addCase(getAddressesInfo.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(getAddressesInfo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setIsFirstLoad } = addressesSlice.actions;
export const selectIsFirstLoad = (state) => state.addresses.isFirstLoad;
export default addressesSlice.reducer;
