import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const fetchCoingeckoId = createAsyncThunk(
  'tokens/fetchCoingeckoId',
  async ({ coingeckoId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/contracts/coin/${coingeckoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);