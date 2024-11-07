import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
import config from '../../config';
const API_BASE = config.api.API_URL

export const getClientsByAccountantId = createAsyncThunk(
  'clients/getClientsByAccountantId',
  async (accountantId, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/clients/accountants/${accountantId}`,
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

export const addClientByAccountantId = createAsyncThunk(
  'clients/addClientByAccountantId',
  async ({ name, email, isShared, accountantId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();

    try {
      const response = await fetch(
        `${API_BASE}/clients/accountants/${accountantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ name, email, isShared }),
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

export const updateClientByAccountantId = createAsyncThunk(
  'clients/updateClientByAccountantId',
  async ({ clientId, accountantId, name, email }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/clients/accountants/${accountantId}/${clientId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ name, email }),
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

export const deleteClientByAccountantId = createAsyncThunk(
  'clients/deleteClientByAccountantId',
  async ({ clientId, accountantId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/clients/accountants/${accountantId}/${clientId}`,
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
      return clientId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getInfoClientByAccountantId = createAsyncThunk(
  'clients/getInfoClientByAccountantId',
  async ({ clientId, accountantId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/clients/accountants/${accountantId}/${clientId}`,
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

// ADMIN ENDPOINTS
export const getClientsByAdmin = createAsyncThunk(
  'clients/getClientsByAdmin',
  async ({ page }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(`${API_BASE}/admin/clients?page=${page}`, {
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

export const getUsersByAdmin = createAsyncThunk(
  'clients/getUsersByAdmin',
  async ({ page, accountType }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const url = `${API_BASE}/admin/users?page=${page}${accountType ? `&accountType=${accountType}` : ''
        }`;

      const response = await fetch(url, {
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

export const getUserByIdAdmin = createAsyncThunk(
  // /admin/users/:userId
  'clients/getUserByIdAdmin',
  async (userId, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
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
