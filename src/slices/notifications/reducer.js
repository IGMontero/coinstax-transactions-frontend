import { createSlice } from '@reduxjs/toolkit';

import { fetchNotifications, markNotificationAsRead } from './thunk';
import { t } from 'i18next';

const initialState = {
  notifications: [],
  notificationsInfo: {
    total: 0,
    hasMore: true,
    unreadCount: 0,
    notifications: [],
  },
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
    setNotificationsInfo: (state, action) => {
      console.log("SETTING NOTIFICATIONS INFO. NEW NOTIFICATIONS INFO: ", action.payload)

      state.notificationsInfo = action.payload;
    },
    markNotificationAsReadAction: (state, action) => {
      const notificationId = action.payload.id;

      // Update notificationsInfo notifications too
      let notifSetAsRead = false;
      state.notificationsInfo.notifications = state.notificationsInfo?.notifications?.map((notification) => {
        if (notification.id === notificationId) {
          notifSetAsRead = true;
          return { ...notification, seen: true };
        }
        return notification;
      });

      // Update unreadCount
      if (notifSetAsRead) {
        state.notificationsInfo.unreadCount = state.notificationsInfo.unreadCount - 1;
      }

      // state.notifications = state.notifications.map((notification) => {
      //   if (notification.id === action.payload.id) {
      //     return { ...notification, seen: true };
      //   }
      //   return notification;
      // });

      // // Update notificationsInfo notifications too 
      // let notifSetAsRead = false
      // state.notificationsInfo.notifications = state.notifications.map((notification) => {
      //   if (notification.id === action.payload.id) {
      //     notifSetAsRead = true
      //     return { ...notification, seen: true };
      //   }
      //   return notification;
      // });

      // // Update unreadCount
      // if (notifSetAsRead) {
      //   state.notificationsInfo.unreadCount = state.notificationsInfo.unreadCount - 1;
      // }

    }


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

export const { clearNotifications, setNotifications, setNotificationsInfo, markNotificationAsReadAction } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
