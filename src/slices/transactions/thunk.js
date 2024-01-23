import { createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchNFTS = createAsyncThunk(
  "transactions/fetchNFTS",
  async (address, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/eth-mainnet/${address}/nfts?allowSpam=false`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPerformance = createAsyncThunk(
  "transactions/fetchPerformance",
  async ({ address, days }, { rejectWithValue }) => {
    let url = `${API_BASE}/transactions/eth-mainnet/${address}/balances/historical`;
    if (days) {
      url += `?days=${days}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssets = createAsyncThunk(
  "transactions/fetchAssets",
  async (address, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/eth-mainnet/${address}/balances/current?allowSpam=false`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "transactions/fetchHistory",
  async ({ address, count = 10, page = 0 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/eth-mainnet/${address}/new?page=${page}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.parsed;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSearchHistoryTable = createAsyncThunk(
  "transactions/fetchSearchHistoryTable",
  async ({ address, query }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/transactions/eth-mainnet/${address}?query=${query}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.parsed;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTransactionsFilter = createAsyncThunk(
  "transactions/fetchTransactionsFilter",
  async ({ address, filters }, { rejectWithValue }) => {
    try {
      const query = Object.entries(filters)
        .filter(([key, value]) => value)
        .map(([key]) => `type=${key}`)
        .join("&");

      const url = `${API_BASE}/transactions/eth-mainnet/${address}/?${query}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
