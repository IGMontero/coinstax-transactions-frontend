import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const getFixedData = createAsyncThunk(
  'fixedData/getFixedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/common/fixed-data');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);