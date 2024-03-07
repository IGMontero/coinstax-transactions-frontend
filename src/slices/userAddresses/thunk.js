import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getUserAddresses = createAsyncThunk(
  'userAddresses/getUserAddresses',
  async ({ page, address, blockchain }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/admin/addresses/${blockchain}`;
      if (address) {
        url += `/${address}`;
      }
      url += `?page=${page}`;
      const response = await fetch(url);
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
