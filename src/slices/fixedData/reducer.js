import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  fixedData: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setFixedData(state, action) {
      state.fixedData = action.payload;
    },
  },
});

export const { setFixedData } = commonSlice.actions;

export default commonSlice.reducer;
