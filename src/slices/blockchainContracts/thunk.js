import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
import { API_BASE } from '../../common/constants';

export const fetchBlockchainContracts = createAsyncThunk(
  'blockchainContracts/fetchBlockchainContracts',
  async ({ networkType, page, address }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      let url = `${API_BASE}/admin/contracts/${networkType}`;
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
  async ({ networkType, address, data }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      let url = `${API_BASE}/admin/contracts/${networkType}/${address}`;
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
    const token = getTokenFromCookies();
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
  async ({ networkType, address, type }, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookies();
      let url = `${API_BASE}/admin/${type}/${networkType}/${address}/transactions/dirty`;
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

export const setBlockchainContractAsDirty = createAsyncThunk(
  'blockchainContracts/setBlockchainContractAsDirty',
  async ({ networkType, address }, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookies();
      let url = `${API_BASE}/admin/contracts/${networkType}/${address}/dirty`;
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
  async ({ address, networkType }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      let url = `${API_BASE}/admin/contracts/${networkType}/${address}`;
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
