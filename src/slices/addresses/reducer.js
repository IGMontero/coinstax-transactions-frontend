import { createSlice } from '@reduxjs/toolkit';
import { getAddressesSuggestions, getAddressesInfo } from './thunk';

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
  loadingAddressesInfo: false,
  isFirstLoad: true,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setLoadingAddressesInfo: (state, action) => {
      state.loadingAddressesInfo = action.payload;
    },
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
      .addCase(getAddressesInfo.pending, (state) => {
        if (state.isFirstLoad) {
          state.loadingAddressesInfo = true;
        }
      })
      .addCase(getAddressesInfo.fulfilled, (state, action) => {
        state.loadingAddressesInfo = false;
        state.error = null;
      })
      .addCase(getAddressesInfo.rejected, (state, action) => {
        state.loadingAddressesInfo = false;
        state.error = action.payload;
      });
  },
});

export const { setLoadingAddressesInfo, setIsFirstLoad } =
  addressesSlice.actions;

export const selectLoadingAddressesInfo = (state) =>
  state.addresses.loadingAddressesInfo;
export const selectIsFirstLoad = (state) => state.addresses.isFirstLoad;

export default addressesSlice.reducer;
