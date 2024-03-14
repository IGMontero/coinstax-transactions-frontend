import { login, authMe } from './thunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

const auth2Slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(authMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(authMe.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { logout } = auth2Slice.actions;

export default auth2Slice.reducer;
