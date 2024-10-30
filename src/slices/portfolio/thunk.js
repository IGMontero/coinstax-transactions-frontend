import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
import { API_BASE } from '../../common/constants';

export const fetchAssetsPortfolio = createAsyncThunk(
  'portfolio/getAssetsPortfolio',
  async ({ userId, blockchain, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${blockchain}/assets`,
        {
          headers: {
            Authorization: `${token}`,
          },
          signal,
        },
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

export const fetchNFTSPortfolio = createAsyncThunk(
  'portfolio/fetchNFTSPortfolio',
  async ({ userId, blockchain, page, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${blockchain}/nfts?page=${page}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          signal,
        },
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

export const getBalancesPortfolio = createAsyncThunk(
  'portfolio/getBalancesPortfolio',
  async ({ userId, blockchain, days, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    let url = `${API_BASE}/users/${userId}/portfolio/${blockchain}/balances`;

    if (days) {
      url += `?days=${days}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
        signal,
      });
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

export const fetchTransactionsPortfolio = createAsyncThunk(
  'portfolio/fetchTransactionsPortfolio',
  async (
    {
      userId,
      networkType,
      query = '',
      filters = {},
      page = 0,
      assetsFilters,
      signal,
    },
    { rejectWithValue },
  ) => {
    const token = getTokenFromCookies();
    try {
      let queryString = `page=${page}`;

      if (query) {
        queryString += `&query=${encodeURIComponent(query)}`;
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

      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${networkType}/transactions?${queryString}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          signal,
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return { error: 'Fetch aborted' };
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const downloadTransactionsPortfolio = createAsyncThunk(
  // GET /users/:userId/portfolio/:blockchain/transactions/export
  'portfolio/downloadTransactionsPortfolio',
  async ({ userId, blockchain, filters = {} }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      let queryString = '';

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
        `${API_BASE}/users/${userId}/portfolio/${blockchain}/transactions/export?${queryString}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      // Check if response is a readable stream

      if (!response.ok) {
        return response.json();
      }

      // Check the Content-Type header to determine the type of response
      const contentType = response.headers.get('Content-Type');

      if (contentType.includes('application/json')) {
        console.log('Response is JSON');
        // Response is JSON
        const data = await response.json();
        return data;
      } else if (contentType.includes('text/csv')) {
        console.log('Response is CSV');
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
