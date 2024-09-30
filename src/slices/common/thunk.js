import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveCountryInCookies, saveTokenInCookies } from "../../helpers/cookies_helper";
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

            const headers = response.headers;


            // Handle CF-IPCountry header and save int ocookies if present.
            if (headers.has("CF-IPCountry")) {
                const ipCountry = headers.get("CF-IPCountry");

                saveCountryInCookies(ipCountry);
            }

            return { ...data, headers };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserCountry = createAsyncThunk(
    "common/userCountry",
    async (address, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE}/common/country`
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            if (data.country) {
                saveCountryInCookies(data.country);
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);