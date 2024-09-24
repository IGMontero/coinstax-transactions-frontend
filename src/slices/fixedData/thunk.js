import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFixedData = createAsyncThunk(
  'fixedData/getFixedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.bitcoin.tax/api.v3/fixed?format=json`,
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
