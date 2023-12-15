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
        `${API_BASE}/transactions/eth-mainnet/${address}/balances/current`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
