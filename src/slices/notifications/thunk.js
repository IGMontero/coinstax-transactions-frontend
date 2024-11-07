import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenFromCookies } from '../../helpers/cookies_helper';
import apiClient from '../../core/apiClient';

// GET /users/notifications No need userId
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.get(`/users/notifications?page=${page}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Mark notification as read:
// PUT /users/notifications/:notificationId/read

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async ({ notificationId }, { rejectWithValue }) => {
    const token = getTokenFromCookies();
    try {
      const response = await apiClient.put(`/users/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);