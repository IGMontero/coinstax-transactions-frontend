import { createSlice } from '@reduxjs/toolkit';

import { fetchCoingeckoId } from './thunk';

const initialState = {
  token: {},
  error: null,
  loading: false,
};

const TokenSlice = createSlice({
  name: 'TokenSlice',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCoingeckoId.pending]: (state) => {
      state.loading = true;
    },
    [fetchCoingeckoId.fulfilled]: (state, action) => {
      state.token = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchCoingeckoId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default TokenSlice.reducer;
