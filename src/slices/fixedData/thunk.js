import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getFixedData = createAsyncThunk(
  'fixedData/getFixedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/common/fixed-data`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('fixed data ', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);