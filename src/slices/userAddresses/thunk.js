import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const getUserAddresses = createAsyncThunk(
  'userAddresses/getUserAddresses',
  async ({ page, address, networkType }, { rejectWithValue }) => {
    try {
      const url = address
        ? `/admin/addresses/address/${networkType}/${address}`
        : `/admin/addresses/${networkType}`;

      const { data } = await apiClient.get(`${url}?page=${page}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const refreshAllTransactions = createAsyncThunk(
  'userAddresses/refreshAllTransactions',
  async ({ networkType, address }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(
        `/admin/addresses/${networkType}/${address}/refresh`,
        {},
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteUsersAddress = createAsyncThunk(
  'userAddresses/deleteUsersAddress',
  async ({ networkType, address }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(
        `/admin/addresses/${networkType}/${address}`,
        {},
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteHistoricalBalance = createAsyncThunk(
  'userAddresses/deleteHistoricalBalance',
  async ({ networkType, address }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/admin/addresses/${networkType}/${address}/balances/historical`,
      );

      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteNftsForBlockchain = createAsyncThunk(
  'userAddresses/deleteNftsForBlockchain',
  async ({ blockchain, address }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `/admin/addresses/${blockchain}/${address}/nfts`,
      );

      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);