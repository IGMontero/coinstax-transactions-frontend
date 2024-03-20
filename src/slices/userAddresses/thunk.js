import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getUserAddresses = createAsyncThunk(
  'userAddresses/getUserAddresses',
  async ({ page, address, blockchain }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      let url = `${API_BASE}/admin/addresses/${blockchain}`;
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

export const refreshAllTransactions = createAsyncThunk(
  'userAddresses/refreshAllTransactions',
  async ({ blockchain, address }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${blockchain}/${address}/refresh`,
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
  async ({ blockchain, address }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${API_BASE}/admin/addresses/${blockchain}/${address}`,
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
