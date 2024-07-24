import { createSlice } from '@reduxjs/toolkit';

import {
  addClientByAccountantId,
  updateClientByAccountantId,
  deleteClientByAccountantId,
  getClientsByAccountantId,
} from './thunk';

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
    [getClientsByAccountantId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getClientsByAccountantId.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getClientsByAccountantId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [addClientByAccountantId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addClientByAccountantId.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [addClientByAccountantId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateClientByAccountantId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateClientByAccountantId.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [updateClientByAccountantId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteClientByAccountantId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteClientByAccountantId.fulfilled]: (state, action) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    [deleteClientByAccountantId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearClients } = clientsSlice.actions;

export default clientsSlice.reducer;
