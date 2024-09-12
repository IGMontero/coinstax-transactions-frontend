// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchJobById } from '../../slices/jobs/reducer';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useGetJob } from '../../slices/jobs/hooks';

function JobsManager() {
    const { jobsList } = useSelector((state) => state.jobs);


    const getJob = useGetJob();

    const [jobsIntervals, setJobsIntervals] = useState([]);

    useEffect(() => {
        // Subscribe to tasks update.
        jobsIntervals.forEach((interval) => {
            clearInterval(interval);
        });

        const newIntervals = [];

        jobsList.forEach((jobId) => {
            // Check if task is already in the list
            const interval = setInterval(async () => {
                const job = await getJob(jobId);

                if (job?.isCompleted || job?.isFailed) {
                    clearInterval(interval);
                }
            }, 1000);
            newIntervals.push(interval);
        });

        setJobsIntervals(newIntervals);

        return () => {
            newIntervals.forEach((interval) => {
                clearInterval(interval);
            });
        };
    }, [jobsList]);

    useEffect(() => {
        if (jobsList.length > 0) {
            jobsList.forEach((job) => {
                //   if (task.status === 'New' || task.status === 'Started' || task.status === 'Running') {
                toast.loading(job, {
                    toastId: job,
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    // progress: task.percent ? task.percent / 100 : undefined,
                    position: 'bottom-right',
                });
            });
        }
    }, [jobsList]);

    return (
        <div>
            <ToastContainer />
        </div>
    );
}

export default JobsManager;
