import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getAddressesSuggestions = createAsyncThunk(
  'addresses/getAddressesSuggestions',
  async ({ blockchain, query }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/addresses/${blockchain}/search?query=${query}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
