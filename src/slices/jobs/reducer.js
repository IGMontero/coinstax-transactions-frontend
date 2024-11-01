import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../core/apiClient';

// Initial state
export const initialState = {
    jobsList: [],
    error: null,
    jobDetails: {},
    loading: false,
};

export const fetchJobById = createAsyncThunk(
    'jobs/fetchJobById',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/queues/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
                (job) => job.id !== action.payload,
            );
        },
        handleCompletedJob: (state, action) => {
            // * Do not trigger download anymore.
            // const completedJobData = action.payload;

            // Handle completed job based on job name/id
            // if (completedJobData.name ===
            //     JOB_NAMES.EXPORT_ADDRESS_TRANSACTIONS ||
            //     completedJobData.name === JOB_NAMES.EXPORT_USER_PORTFOLIO
            // ) {
            //     // Handle completed
            //     const { data } = completedJobData;

            //     const fileUrl = data?.fileUrl;
            //     const fileName = data?.fileName;

            //     if (fileUrl) {
            //         // Download file
            //         downloadFileByURL(fileUrl,
            //             fileName || 'export.csv'
            //         );
            //     }
            // }

        }
        // Handle completed}
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

export const { addJobToList, removeJobFromList, handleCompletedJob } = jobsSlice.actions;

export default jobsSlice.reducer;
