import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../../common/constants';

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

export const getAddressesInfo = createAsyncThunk(
  'addresses/getAddressesInfo',
  async ({ address, signal }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/addresses/${address}/summary`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: signal,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue({
          name: 'AbortError',
          message: 'Request was aborted',
        });
      }
      return rejectWithValue(error.message);
    }
  },
);
