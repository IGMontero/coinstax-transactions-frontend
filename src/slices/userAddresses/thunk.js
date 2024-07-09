import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getUserAddresses = createAsyncThunk(
  'userAddresses/getUserAddresses',
  async ({ page, address, networkType }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      let url;
      if (address) {
        url = `${API_BASE}/admin/addresses/address/${networkType}/${address}`;
      } else {
        url = `${API_BASE}/admin/addresses/${networkType}`;
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

export const refreshAllTransactions = createAsyncThunk(
  'userAddresses/refreshAllTransactions',
  async ({ networkType, address }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${networkType}/${address}/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({}),
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

export const deleteUsersAddress = createAsyncThunk(
  'userAddresses/deleteUsersAddress',
  async ({ networkType, address }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${networkType}/${address}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({}),
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

export const deleteHistoricalBalance = createAsyncThunk(
  'userAddresses/deleteHistoricalBalance',
  async ({ networkType, address }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${networkType}/${address}/balances/historical`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        return data;
      }
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteNftsForBlockchain = createAsyncThunk(
  'userAddresses/deleteNftsForBlockchain',
  async ({ blockchain, address }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${blockchain}/${address}/nfts`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      );

      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        return data;
      }
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
