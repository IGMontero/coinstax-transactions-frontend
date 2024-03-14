import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchBlockchainContracts = createAsyncThunk(
  'blockchainContracts/fetchBlockchainContracts',
  async ({ blockchain, page, address }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}`;
      if (address) {
        url += `/${address}`;
      }
      url += `?page=${page}`;

      const response = await fetch(url);
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

export const editBlockChainContract = createAsyncThunk(
  'blockchainContracts/editBlockChainContract',
  async ({ blockchain, address, data }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}/${address}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log('error', error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateTrustedState = createAsyncThunk(
  'blockchainContracts/updateTrustedState',
  async ({ blockchain, address, trustedState }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}/${address}/trusted-state`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trustedState }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const setAllAsDirty = createAsyncThunk(
  'blockchainContracts/setAllAsDirty',
  async ({ blockchain, address, type }, { rejectWithValue }) => {
    try {
      let url = `${API_BASE}/admin/${type}/${blockchain}/${address}/transactions/dirty`;
      const response = await fetch(url, {
        method: 'POST',
      });
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
