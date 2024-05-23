import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  networkType: 'ethereum',
};

const networkTypeSlice = createSlice({
  name: 'networkType',
  initialState,
  reducers: {
    setNetworkType: (state, action) => {
      state.networkType = action.payload;
    },
  },
});

export const { setNetworkType } = networkTypeSlice.actions;

export default networkTypeSlice.reducer;

export const selectNetworkType = (state) => state.networkType.networkType;
