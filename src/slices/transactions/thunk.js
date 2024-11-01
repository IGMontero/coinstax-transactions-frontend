import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const fetchNFTS = createAsyncThunk(
  'transactions/fetchNFTS',
  async ({ address, spam, networkType, page, refresh }, { rejectWithValue }) => {
    try {
      const url = `/transactions/${networkType}/${address}/nfts?allowSpam=${spam}&page=${page}${refresh ? '&refresh=true' : ''}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      if (error.message === 'AbortError') console.log('Fetch aborted');
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPerformance = createAsyncThunk(
  'transactions/fetchPerformance',
  async ({ address, days, networkType }, { rejectWithValue }) => {
    try {
      const url = `/transactions/${networkType}/${address}/balances/historical${days ? `?days=${days}` : ''}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchPerformanceToken = createAsyncThunk(
  'transactions/fetchPerformanceToken',
  async ({ address, days }, { rejectWithValue }) => {
    try {
      const url = `/contracts/coin/historical/${address}${days ? `?days=${days}` : ''}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchAssets = createAsyncThunk(
  'transactions/fetchAssets',
  async ({ address, networkType }, { rejectWithValue }) => {
    try {
      const url = `/transactions/${networkType}/${address}/balances/current?allowSpam=false`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchHistory = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ address, query = '', filters = {}, page = 0, assetsFilters, networkType }, { rejectWithValue }) => {
    try {
      let queryString = `page=${page}`;
      if (query) queryString += `&query=${encodeURIComponent(query)}`;
      if (assetsFilters) queryString += `&${assetsFilters}`;

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
        } else if (value) {
          queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      });

      const url = `/transactions/${networkType}/${address}/new?${queryString}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      if (error.message === 'AbortError') console.log('Fetch aborted');
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const downloadTransactions = createAsyncThunk(
  'transactions/downloadTransactions',
  async ({ blockchain, address, query = '', filters = {}, assetsFilters }, { rejectWithValue }) => {
    try {
      let queryString = query ? `query=${encodeURIComponent(query)}` : '';
      if (assetsFilters) queryString += `&${assetsFilters}`;

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
        } else if (value) {
          queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      });

      const url = `/transactions/${blockchain}/${address}/export-csv?${queryString}`;
      const response = await apiClient.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getNftsByContractAddress = createAsyncThunk(
  'transactions/getNftsByContractAddress',
  async ({ blockchain, contractAddress, tokenId }, { rejectWithValue }) => {
    try {
      const url = `/transactions/${blockchain}/${contractAddress}/nft?tokenId=${tokenId}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateNftsSpamStatus = createAsyncThunk(
  'transactions/updateNftsSpamStatus',
  async ({ blockchain, contractAddress, tokenId, spam }, { rejectWithValue }) => {
    try {
      await apiClient.put('/nfts/spam', {
        blockchain,
        contractAddress,
        tokenId,
        spam,
      });
      return { tokenId, spam };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);