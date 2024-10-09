import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTokenFromCookies,
  saveTokenInCookies,
} from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const authMe = createAsyncThunk(
  'auth2/authMe',
  async (_, { getState, rejectWithValue }) => {
    const token = getTokenFromCookies();

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  'auth2/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        saveTokenInCookies(data.token);
        // dispatch(authMe());
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const register = createAsyncThunk(
  'auth2/register',
  async (
    { email, password, role, country, timezone, currency },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
          country,
          timezone,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.token) {
        saveTokenInCookies(data.token);
        dispatch(authMe());
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth2/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const verifyResetPasswordToken = createAsyncThunk(
  'auth2/verifyResetPasswordToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/auth/validate-reset-password-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth2/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeEmail = createAsyncThunk(
  'auth2/changeEmail',
  async ({ newEmail, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({ newEmail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || `Error: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// POST /auth/change-email/resend

export const resendChangeEmail = createAsyncThunk(
  'auth2/resendChangeEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-email/resend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  'auth2/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserInfo = createAsyncThunk(
  'auth2/updateUserInfo',
  async ({ country, timezone, currency }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/user-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({ country, timezone, currency }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateNotificationsPreferences = createAsyncThunk(
  'auth2/updateNotificationsPreferences',
  async ({ emailMarketing }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/auth/notifications-preferences`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenFromCookies()}`,
          },
          body: JSON.stringify({ emailMarketing }),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const resendVerificationEmail = createAsyncThunk(
  'auth2/resendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/auth/resend-verification-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenFromCookies()}`,
          },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeEmailPending = createAsyncThunk(
  'auth2/changeEmailPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-email/pending`, {
        headers: {
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const closeAccount = createAsyncThunk(
  'auth2/closeAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/close-account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Verify email
// POST /auth/verify-email
// { token }

export const verifyEmail = createAsyncThunk(
  'auth2/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const confirmEmailChange = createAsyncThunk(
  'auth2/confirmEmailChange',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/confirm-change-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromCookies()}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
