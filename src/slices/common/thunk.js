import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveCountryInCookies } from "../../helpers/cookies_helper";
import apiClient from "../../core/apiClient";

export const fetchApiVersion = createAsyncThunk(
    "common/version",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/common/version");

            // Check for CF-IPCountry header and save in cookies if present
            const ipCountry = response.headers["cf-ipcountry"];
            if (ipCountry) {
                saveCountryInCookies(ipCountry);
            }

            return { ...response.data, headers: response.headers };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUserCountry = createAsyncThunk(
    "common/userCountry",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/common/country");

            if (response.data.country) {
                saveCountryInCookies(response.data.country);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);