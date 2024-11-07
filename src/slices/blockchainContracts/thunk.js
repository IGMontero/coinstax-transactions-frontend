import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const fetchBlockchainContracts = createAsyncThunk(
  'blockchainContracts/fetchBlockchainContracts',
  async ({ networkType, page, address }, { rejectWithValue }) => {
    try {
      let url = `/admin/contracts/${networkType}`;
      if (address) {
        url += `/${address}`;
      }
      url += `?page=${page}`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editBlockChainContract = createAsyncThunk(
  'blockchainContracts/editBlockChainContract',
  async ({ networkType, address, data }, { rejectWithValue }) => {
    try {
      const url = `/admin/contracts/${networkType}/${address}`;
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTrustedState = createAsyncThunk(
  'blockchainContracts/updateTrustedState',
  async ({ blockchain, address, trustedState }, { rejectWithValue }) => {
    try {
      const url = `/admin/contracts/${blockchain}/${address}/trusted-state`;
      const response = await apiClient.put(url, { trustedState });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setAllAsDirty = createAsyncThunk(
  'blockchainContracts/setAllAsDirty',
  async ({ networkType, address, type }, { rejectWithValue }) => {
    try {
      const url = `/admin/${type}/${networkType}/${address}/transactions/dirty`;
      const response = await apiClient.post(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setBlockchainContractAsDirty = createAsyncThunk(
  'blockchainContracts/setBlockchainContractAsDirty',
  async ({ networkType, address }, { rejectWithValue }) => {
    try {
      const url = `/admin/contracts/${networkType}/${address}/dirty`;
      const response = await apiClient.post(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBlockchainContract = createAsyncThunk(
  'blockchainContracts/deleteBlockchainContract',
  async ({ address, networkType }, { rejectWithValue }) => {
    try {
      const url = `/admin/contracts/${networkType}/${address}`;
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);