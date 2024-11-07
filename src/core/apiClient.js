// apiClient.js
import axios from 'axios';
import config from '../config';

const API_BASE = config.api.API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE,
    crossDomain: true,
    withCredentials: true, // Always include credentials (cookies)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle errors globally here, e.g., by logging or showing notifications
        return Promise.reject(error.response?.data?.message || 'An error occurred');
    }
);

export default apiClient;