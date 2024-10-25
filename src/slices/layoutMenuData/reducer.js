import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  prevAddress: null,
  addressSearched: null,
};

const layoutMenuDataSlice = createSlice({
  name: 'layoutMenuData',
  initialState,
  reducers: {
    setPrevAddress: (state, action) => {
      state.prevAddress = action.payload;
    },
    setAddressSearched: (state, action) => {
      state.addressSearched = action.payload;
    },
  },
});

export const { setPrevAddress, setAddressSearched } =
  layoutMenuDataSlice.actions;

export default layoutMenuDataSlice.reducer;
