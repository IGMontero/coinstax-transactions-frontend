import { createSlice } from '@reduxjs/toolkit';

import { addClient, getClientsByUserId } from './thunk';

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClients: (state) => {
      state.clients = [];
    },
  },
  extraReducers: {
    [addClient.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addClient.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [addClient.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getClientsByUserId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getClientsByUserId.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getClientsByUserId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearClients } = clientsSlice.actions;

export default clientsSlice.reducer;
