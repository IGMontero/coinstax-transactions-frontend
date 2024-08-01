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

export const getNFTSPortfolio = createAsyncThunk(
  'portfolio/getNFTSPortfolio',
  async ({ userId, blockchain, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${blockchain}nfts`,
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
  async ({ userId, blockchain, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/${blockchain}balances`,
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
