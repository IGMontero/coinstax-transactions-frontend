import { createSlice } from '@reduxjs/toolkit';

import {
  getAgentsByAccountantId,
  addAgentByAccountantId,
  getAgentById,
  updateAgentById,
  deleteAgentById,
  verifyInviteCodeAA,
  acceptInviteCodeAA,
  declineInviteCodeAA,
  getAgentClients,
} from './thunks';

const initialState = {
  agents: [],
  agent: {},
  agentClients: [],
  status: 'idle',
  error: null,
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    clearAgent(state) {
      state.agent = {};
    },
  },
  extraReducers: {
    [getAgentsByAccountantId.pending]: (state) => {
      state.status = 'loading';
    },
    [getAgentsByAccountantId.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agents = action.payload;
    },
    [getAgentsByAccountantId.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addAgentByAccountantId.pending]: (state) => {
      state.status = 'loading';
    },
    [addAgentByAccountantId.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agents.push(action.payload);
    },
    [addAgentByAccountantId.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [getAgentById.pending]: (state) => {
      state.status = 'loading';
    },
    [getAgentById.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agent = action.payload;
    },
    [getAgentById.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [updateAgentById.pending]: (state) => {
      state.status = 'loading';
    },
    [updateAgentById.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agent = action.payload;
    },
    [updateAgentById.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [deleteAgentById.pending]: (state, action) => {
      state.status = 'loading';
    },
    [deleteAgentById.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agents = state.agents.filter(
        (agent) => agent.id !== action.payload,
      );
    },
    [deleteAgentById.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [verifyInviteCodeAA.pending]: (state) => {
      state.status = 'loading';
    },
    [verifyInviteCodeAA.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agent = action.payload;
    },
    [verifyInviteCodeAA.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },

    [acceptInviteCodeAA.pending]: (state) => {
      state.status = 'loading';
    },
    [acceptInviteCodeAA.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agent = action.payload;
    },
    [acceptInviteCodeAA.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },

    [declineInviteCodeAA.pending]: (state) => {
      state.status = 'loading';
    },

    [declineInviteCodeAA.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agent = action.payload;
    },
    [declineInviteCodeAA.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },

    [getAgentClients.pending]: (state) => {
      state.status = 'loading';
    },
    [getAgentClients.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.agentClients = action.payload;
    },
    [getAgentClients.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const { clearAgent } = agentsSlice.actions;

export default agentsSlice.reducer;
