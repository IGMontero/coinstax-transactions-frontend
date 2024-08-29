import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getAgentsByAccountantId = createAsyncThunk(
  'agents/getAgentsByAccountantId',
  async ({ accountantId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/accountants/${accountantId}`,
        {
          headers: {
            'Content-Type': 'application/json',
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
export const getAgentsClients = createAsyncThunk(
  'agents/getAgentsClients',
  async ({ agentId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(`${API_BASE}/agents/${agentId}/clients`, {
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
export const addAgentByAccountantId = createAsyncThunk(
  'agents/addAgentByAccountantId',
  async ({ accountantId, name, email }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/accountants/${accountantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            name,
            email,
          }),
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

export const getAgentById = createAsyncThunk(
  'agents/getAgentById',
  async ({ accountantId, agentId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/accountants/${accountantId}/${agentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
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

export const updateAgentById = createAsyncThunk(
  'agents/updateAgentById',
  async ({ accountantId, agentId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/accountants/${accountantId}/${agentId}`,
        {
          method: 'PUT',
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

export const deleteAgentById = createAsyncThunk(
  'agents/deleteAgentById',
  async ({ accountantId, agentId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/accountants/${accountantId}/${agentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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

export const verifyInviteCodeAA = createAsyncThunk(
  'agents/verifyInviteCodeAA',
  async ({ inviteCode }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/invite-code/${inviteCode}`,
        {
          headers: {
            'Content-Type': 'application/json',
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

export const acceptInviteCodeAA = createAsyncThunk(
  'agents/acceptInviteCodeAA',
  async ({ inviteCode }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/invite-code/${inviteCode}/accept`,
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

export const declineInviteCodeAA = createAsyncThunk(
  'agents/declineAgentInvite',
  async ({ inviteCode }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(
        `${API_BASE}/agents/invite-code/${inviteCode}/decline`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

export const getAgentClients = createAsyncThunk(
  'agents/getAgentClients',
  async ({ agentId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await fetch(`${API_BASE}/agents/${agentId}/clients`, {
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
