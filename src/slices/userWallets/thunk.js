import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

export const addCurrentUserWallet = createAsyncThunk(
  'clients/addCurrentUserWallet',
  async ({ address, userId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/users/${userId}/wallet-addresses`, { address });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addUserWallet = createAsyncThunk(
  'clients/addClient',
  async ({ address, userId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/users/${userId}/wallet-addresses`, { address });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to connect wallet');
    }
  },
);

export const getUserWallets = createAsyncThunk(
  'clients/getClientsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/users/${userId}/wallet-addresses`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getCurrentUserPortfolioSummary = createAsyncThunk(
  'clients/getCurrentUserPortfolioSummary',
  async ({ userId, signal }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/users/${userId}/portfolio/summary`, { signal });
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return rejectWithValue('Request was aborted');
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getClientUserPortfolioSummary = createAsyncThunk(
  'clients/getClientUserPortfolioSummary',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/users/${userId}/portfolio/summary`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteUserAddressWallet = createAsyncThunk(
  'clients/deleteUserAddressWallet',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${userId}/wallet-addresses/${addressId}`);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateUserWalletAddress = createAsyncThunk(
  'clients/updateUserWalletAddress',
  async ({ userId, name, addressId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/users/${userId}/wallet-addresses/${addressId}`, { name });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const verifyInviteCodeAU = createAsyncThunk(
  'clients/verifyInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/clients/invite-code/${inviteCode}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const verifyInviteCodeUA = createAsyncThunk(
  'clients/verifyInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/clients/accountants/invite-code/${inviteCode}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const acceptInviteCodeAU = createAsyncThunk(
  'clients/acceptInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/clients/invite-code/${inviteCode}/accept`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const declineInviteCodeAU = createAsyncThunk(
  'clients/declineInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/clients/invite-code/${inviteCode}/decline`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const acceptInviteCodeUA = createAsyncThunk(
  'clients/acceptInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/clients/accountants/invite-code/${inviteCode}/accept`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const declineInviteCodeUA = createAsyncThunk(
  'clients/declineInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/clients/accountants/invite-code/${inviteCode}/decline`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addAccountManager = createAsyncThunk(
  'clients/useClientsInviteCode',
  async ({ userId, email }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/users/${userId}/accountants/invite`, { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createInviteCode = createAsyncThunk(
  'clients/createInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/clients/invite-code/${inviteCode}`, {});
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const reorderUserWallets = createAsyncThunk(
  'clients/reorderUserWallets',
  async ({ userId, addresses }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/users/${userId}/wallet-addresses/reorder`, { addresses });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);