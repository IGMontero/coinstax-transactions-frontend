import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveTokenInCookies } from '../../helpers/cookies_helper';
import apiClient from '../../core/apiClient';

export const authMe = createAsyncThunk(
  'auth2/authMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth2/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token } = response.data;

      if (token) {
        saveTokenInCookies(token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth2/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth2/register',
  async ({ email, password, role, country, timezone, currency }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        role,
        country,
        timezone,
        currency,
      });

      const { token } = response.data;
      if (token) {
        saveTokenInCookies(token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth2/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyResetPasswordToken = createAsyncThunk(
  'auth2/verifyResetPasswordToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/validate-reset-password-token', { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth2/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeEmail = createAsyncThunk(
  'auth2/changeEmail',
  async ({ newEmail, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/change-email', { newEmail, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resendChangeEmail = createAsyncThunk(
  'auth2/resendChangeEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/change-email/resend', {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth2/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'auth2/updateUserInfo',
  async ({ country, timezone, currency }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/auth/user-info', { country, timezone, currency });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotificationsPreferences = createAsyncThunk(
  'auth2/updateNotificationsPreferences',
  async ({ emailMarketing }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/notifications-preferences', { emailMarketing });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth2/resendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/resend-verification-email', {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeEmailPending = createAsyncThunk(
  'auth2/changeEmailPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/change-email/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const closeAccount = createAsyncThunk(
  'auth2/closeAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/auth/close-account');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth2/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmEmailChange = createAsyncThunk(
  'auth2/confirmEmailChange',
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/confirm-change-email', { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);