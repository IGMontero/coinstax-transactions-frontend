import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchBlockchainContracts = createAsyncThunk(
  'blockchainContracts/fetchBlockchainContracts',
  async ({ blockchain, page, address }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}`;
      if (address) {
        url += `/${address}`;
      }
      url += `?page=${page}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
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

export const editBlockChainContract = createAsyncThunk(
  'blockchainContracts/editBlockChainContract',
  async ({ blockchain, address, data }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}/${address}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
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
    const token = localStorage.getItem('token');
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}/${address}/trusted-state`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
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
      const token = localStorage.getItem('token');
      let url = `${API_BASE}/admin/${type}/${blockchain}/${address}/transactions/dirty`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
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

export const deleteBlockchainContract = createAsyncThunk(
  'blockchainContracts/deleteBlockchainContract',
  async ({ blockchain, address }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      let url = `${API_BASE}/admin/contracts/${blockchain}/${address}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `${token}`,
        },
        body: JSON.stringify({}),
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
