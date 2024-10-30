import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../../common/constants';

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
