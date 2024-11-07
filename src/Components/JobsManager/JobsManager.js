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

        jobsList.forEach((job) => {
            const { id } = job;
            // Check if task is already in the list
            const interval = setInterval(async () => {
                const updatedJob = await getJob(id);

                if (updatedJob?.isCompleted || updatedJob?.isFailed) {
                    clearInterval(interval);
                }

                if (!updatedJob || !updatedJob?.id) {
                    clearInterval(interval);
                }
            }, 2500);
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
                const { message } = job;
                //   if (task.status === 'New' || task.status === 'Started' || task.status === 'Running') {
                toast.loading(message
                    || `Job ${job.id} is running.`
                    , {
                        toastId: job.id,
                        autoClose: false,
                        closeOnClick: false,
                        draggable: false,
                        closeButton: <CustomCloseButton />,
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

const CustomCloseButton = ({ closeToast }) => (
    <button
        onClick={closeToast}
        style={{
            padding: '0px 10px',
            fontSize: '12px',
            // backgroundColor: '#f0f0f0', // Light grey background for light mode
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'center',
            height: 20
        }}
    >
        Hide
    </button>
);

export default JobsManager;
