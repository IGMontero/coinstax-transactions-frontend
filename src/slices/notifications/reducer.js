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
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: {
    [fetchNotifications.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchNotifications.fulfilled]: (state, action) => {
      state.notifications = [
        ...state.notifications,
        ...action.payload.notifications,
      ];
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

export const { clearNotifications, setNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
