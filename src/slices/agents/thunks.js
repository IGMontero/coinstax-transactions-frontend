import { createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const getAgentsByAccountantId = createAsyncThunk(
  'agents/getAgentsByAccountantId',
  async ({ accountantId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/accountants/${accountantId}`, {
        headers: {
          'Content-Type': 'application/json',
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
  async ({ accountantId, agentName, email, isShared }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/accountants/${accountantId}/agents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: agentName,
            email: email,
            sharedAccount: isShared,
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
    try {
      const response = await fetch(
        `${API_BASE}/accountants/${accountantId}/${agentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
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
    try {
      const response = await fetch(
        `${API_BASE}/accountants/${accountantId}/${agentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
    try {
      const response = await fetch(
        `${API_BASE}/accountants/${accountantId}/${agentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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

export const validateAgentInviteCode = createAsyncThunk(
  'agents/validateAgentInviteCode',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/invite/${inviteCode}`, {
        headers: {
          'Content-Type': 'application/json',
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

export const acceptAgentInvite = createAsyncThunk(
  'agents/acceptAgentInvite',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/invite/${inviteCode}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
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

export const declineAgentInvite = createAsyncThunk(
  'agents/declineAgentInvite',
  async ({ inviteCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/invite/${inviteCode}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

export const getAgentClients = createAsyncThunk(
  'agents/getAgentClients',
  async ({ agentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/${agentId}/clients`, {
        headers: {
          'Content-Type': 'application/json',
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
