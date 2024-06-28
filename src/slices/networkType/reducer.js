import { createSlice } from '@reduxjs/toolkit';
import { getAppOptions, setAppOptions } from '../../helpers/cookies_helper';

const initialState = {
  networkType: getAppOptions().blockchain || 'ethereum',
};

const networkTypeSlice = createSlice({
  name: 'networkType',
  initialState,
  reducers: {
    setNetworkType: (state, action) => {
      state.networkType = action.payload;
      const appOptions = getAppOptions();
      appOptions.blockchain = action.payload;
      setAppOptions(appOptions);
    },
  },
});

export const { setNetworkType } = networkTypeSlice.actions;

export default networkTypeSlice.reducer;

export const selectNetworkType = (state) => state.networkType.networkType;
