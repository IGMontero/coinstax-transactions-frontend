import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchNFTS = createAsyncThunk(
  'transactions/fetchNFTS',
  async ({ address, spam, networkType, signal }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/${networkType}/${address}/nfts?allowSpam=${spam}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const fetchPerformance = createAsyncThunk(
  'transactions/fetchPerformance',
  async ({ address, days, networkType, signal }, { rejectWithValue }) => {
    let url = `${API_BASE}/transactions/${networkType}/${address}/balances/historical`;
    if (days) {
      url += `?days=${days}`;
    }
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const fetchPerformanceToken = createAsyncThunk(
  'transactions/fetchPerformanceToken',
  async ({ address, days, signal }, { rejectWithValue }) => {
    let url = `${API_BASE}/contracts/coin/historical/${address}`;
    if (days) {
      url += `?days=${days}`;
    }
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const fetchAssets = createAsyncThunk(
  'transactions/fetchAssets',
  async ({ address, networkType, signal }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE}/transactions/${networkType}/${address}/balances/current?allowSpam=false`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const fetchHistory = createAsyncThunk(
  'transactions/fetchTransactions',
  async (
    {
      address,
      query = '',
      filters = {},
      page = 0,
      assetsFilters,
      networkType,
      signal,
    },
    { rejectWithValue },
  ) => {
    try {
      let queryString = `page=${page}`;
      if (query) {
        queryString += `&query=${encodeURIComponent(query)}`;
      }

      if (assetsFilters) {
        `${assetsFilters}`;
      } else {
        assetsFilters = '';
      }

      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
          });
        } else if (value) {
          queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }

      const response = await fetch(
        `${API_BASE}/transactions/${networkType}/${address}/new?${queryString}${assetsFilters}`,
        { signal },
      );
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const downloadTransactions = createAsyncThunk(
  'transactions/downloadTransactions',
  async (
    { blockchain, address, query = '', filters = {}, assetsFilters },
    { rejectWithValue },
  ) => {
    const token = getTokenFromCookies();
    try {
      let queryString = '';
      if (query) {
        queryString += `query=${encodeURIComponent(query)}`;
      }

      if (assetsFilters) {
        queryString += `&${assetsFilters}`;
      }

      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
          });
        } else if (value) {
          queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }

      let url = `${API_BASE}/transactions/${blockchain}/${address}/export-csv?${queryString}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      // Check if response is a readable stream

      if (!response.ok) {
        return response.json();
      }

      // Check the Content-Type header to determine the type of response
      const contentType = response.headers.get('Content-Type');

      if (contentType.includes('application/json')) {
        // Response is JSON
        const data = await response.json();
        return data;
      } else if (contentType.includes('text/csv')) {
        // Response is a blob
        const blob = await response.blob();
        // Do something with the blob
        return blob;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getNftsByContractAddress = createAsyncThunk(
  'transactions/getNftsByContractAddress',
  async ({ blockchain, contractAddress, tokenId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/${blockchain}/${contractAddress}/nft?tokenId=${tokenId}`,
      );
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
