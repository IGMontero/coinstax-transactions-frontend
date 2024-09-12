import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming you'll use axios for API calls
import { API_BASE } from '../../common/constants';

// Initial state
export const initialState = {
    jobsList: [],
    error: null,
    jobDetails: {},
    loading: false,
};

// Async thunk to fetch job by ID
export const fetchJobById = createAsyncThunk(
    'jobs/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE}/queues/jobs/${jobId}`);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        // Optionally, add reducers if needed for local state management
        addJobToList: (state, action) => {
            state.jobsList.push(action.payload);
        },

        removeJobFromList: (state, action) => {
            state.jobsList = state.jobsList.filter(
                (job) => job !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.jobDetails = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addJobToList, removeJobFromList } = jobsSlice.actions;

export default jobsSlice.reducer;
