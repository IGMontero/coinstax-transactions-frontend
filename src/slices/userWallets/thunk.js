import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const addUserWallet = createAsyncThunk(
  'clients/addClient',
  async ({ address, userId }, { rejectWithValue }) => {
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
          body: JSON.stringify({ address }),
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

export const getUserWallets = createAsyncThunk(
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

export const getCurrentUserPortfolioSummary = createAsyncThunk(
  'clients/getCurrentUserPortfolioSummary',
  async ({ userId, signal }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/summary`,
        {
          headers: {
            Authorization: `${token}`,
          },
          signal: signal,
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return rejectWithValue('Request was aborted');
      }
      return rejectWithValue(error.message);
    }
  },
);

export const getClientUserPortfolioSummary = createAsyncThunk(
  'clients/getClientUserPortfolioSummary',
  async (userId, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/portfolio/summary`,
        {
          headers: {
            Authorization: `${token}`,
          },
          // signal: signal,
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return rejectWithValue('Request was aborted');
      }
      return rejectWithValue(error.message);
    }
  },
);

export const deleteUserAddressWallet = createAsyncThunk(
  'clients/deleteUserAddressWallet',
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

export const updateUserWalletAddress = createAsyncThunk(
  'clients/updateUserWalletAddress',
  async ({ userId, name, addressId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/wallet-addresses/${addressId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ name }),
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

export const verifyInviteCode = createAsyncThunk(
  'clients/verifyInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/clients/invite-code/${inviteCode}`,
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

export const reorderUserWallets = createAsyncThunk(
  'clients/reorderUserWallets',
  async ({ userId, addresses }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/users/${userId}/wallet-addresses/reorder`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ addresses }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
