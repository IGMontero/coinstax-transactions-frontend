import { createSlice } from '@reduxjs/toolkit';
import { removeTokenFromCookies } from '../../helpers/cookies_helper';
import { authMe, login, register, changePassword, changeEmail } from './thunk';


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
      removeTokenFromCookies();
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
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
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
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(changeEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { logout } = auth2Slice.actions;

export default auth2Slice.reducer;
