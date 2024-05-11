import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchCoingeckoId = createAsyncThunk(
  'tokens/fetchCoingeckoId',
  async ({ coingeckoId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/contracts/coin/${coingeckoId}`);
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
