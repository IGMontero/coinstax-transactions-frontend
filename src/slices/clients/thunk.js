import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const addClient = createAsyncThunk(
  'clients/addClient',
  async ({ clientName, email, isShared, userId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/wallet-addresses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ clientName, email, isShared }),
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

export const getClientsByUserId = createAsyncThunk(
  'clients/getClientsByUserId',
  async (userId, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/wallet-addresses`,
        {
          headers: {
            Authorization: `${token}`,
          },
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

export const deleteAddressByUserId = createAsyncThunk(
  'clients/deleteAddressByUserId',
  async ({ userId, addressId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/wallet-addresses/${addressId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
