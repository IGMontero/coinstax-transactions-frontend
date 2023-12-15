import { createSlice } from "@reduxjs/toolkit";
import { fetchNFTS } from "./thunk";
export const initialState = {
  transactions: [],
  error: null,
};

const NftsSlice = createSlice({
  name: "NftsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNFTS.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    builder.addCase(fetchNFTS.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });
  },
});

export default NftsSlice.reducer;
