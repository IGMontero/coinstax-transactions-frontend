import { createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE = process.env.REACT_APP_API_URL_BASE;

export const fetchApiVersion = createAsyncThunk(
    "common/version",
    async (address, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE}/common/version`
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);