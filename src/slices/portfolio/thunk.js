import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
import apiClient from '../../core/apiClient';

// Fetch assets portfolio
export const fetchAssetsPortfolio = createAsyncThunk(
  'portfolio/getAssetsPortfolio',
  async ({ userId, blockchain, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio/${blockchain}/assets`, {
        headers: {
          Authorization: `${token}`,
        },
        signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch NFTs portfolio
export const fetchNFTSPortfolio = createAsyncThunk(
  'portfolio/fetchNFTSPortfolio',
  async ({ userId, blockchain, page, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio/${blockchain}/nfts`, {
        headers: {
          Authorization: `${token}`,
        },
        params: { page },
        signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Get balances portfolio
export const getBalancesPortfolio = createAsyncThunk(
  'portfolio/getBalancesPortfolio',
  async ({ userId, blockchain, days, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio/${blockchain}/balances`, {
        headers: {
          Authorization: `${token}`,
        },
        params: { days },
        signal,
      });
      return response.data;
    } catch (error) {
      if (apiClient.isCancel(error)) {
        console.log('Fetch aborted');
        return { error: 'Fetch aborted' };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch transactions portfolio
export const fetchTransactionsPortfolio = createAsyncThunk(
  'portfolio/fetchTransactionsPortfolio',
  async ({ userId, networkType, query = '', filters = {}, page = 0, assetsFilters, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio/${networkType}/transactions`, {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          page,
          query,
          ...filters,
          assetsFilters,
        },
        signal,
      });
      return response.data;
    } catch (error) {
      if (apiClient.isCancel(error)) {
        console.log('Fetch aborted');
        return { error: 'Fetch aborted' };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Download transactions portfolio
export const downloadTransactionsPortfolio = createAsyncThunk(
  'portfolio/downloadTransactionsPortfolio',
  async ({ userId, blockchain, filters = {} }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio/${blockchain}/transactions/export`, {
        headers: {
          Authorization: `${token}`,
        },
        params: filters,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);