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
        dispatch(authMe());
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const register = createAsyncThunk(
  'auth2/register',
  async ({ email, password, role }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
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
