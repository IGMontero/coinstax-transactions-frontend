import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';
import axios from 'axios';

export const getAddressesSuggestions = createAsyncThunk(
  'addresses/getAddressesSuggestions',
  async ({ blockchain, query }, { rejectWithValue }) => {
    try {
      const url = `/addresses/${blockchain}/search?query=${query}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAddressesInfo = createAsyncThunk(
  'addresses/getAddressesInfo',
  async ({ address, signal }, { rejectWithValue }) => {
    try {
      const url = `/addresses/${address}/summary`;
      const response = await apiClient.get(url, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue({
          name: 'AbortError',
          message: 'Request was aborted',
        });
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);