import { createSlice } from '@reduxjs/toolkit';

import { fetchNotifications, markNotificationAsRead } from './thunk';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: {
    [fetchNotifications.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchNotifications.fulfilled]: (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
    },
    [fetchNotifications.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [markNotificationAsRead.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [markNotificationAsRead.fulfilled]: (state, action) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification.id === action.payload.id) {
          return action.payload;
        }
        return notification;
      });
      state.loading = false;
      state.error = null;
    },
    [markNotificationAsRead.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
