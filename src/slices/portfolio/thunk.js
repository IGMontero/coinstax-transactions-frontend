import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

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
  async ({ userId, blockchain, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${blockchain}/nfts`,
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
