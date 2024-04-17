import { createSlice } from '@reduxjs/toolkit';
import { getAddressesSuggestions } from './thunk';

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: {
    [getAddressesSuggestions.pending]: (state) => {
      state.loading = true;
    },
    [getAddressesSuggestions.fulfilled]: (state, action) => {
      state.suggestions = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getAddressesSuggestions.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default addressesSlice.reducer;
