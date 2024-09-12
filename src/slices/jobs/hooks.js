import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchJobById, removeJobFromList } from './reducer';
import { toast } from 'react-toastify';

export const useGetJob = () => {
    const dispatch = useDispatch();

    return useCallback(async (id) => {
        try {
            console.log('Will fetch job by id: ', id);
            const response = await dispatch(fetchJobById(id));

            if (response?.error) {
                return response;
            }

            const data = response.payload;

            console.log("Job data: ", data);

            if (data.isCompleted) {
                console.log('Job is completed: ', id);
                toast.dismiss(id);
                toast.success(`Job ${id} is completed.`, {
                    autoClose: 3000,
                    closeOnClick: true,
                    position: 'bottom-right',
                });

                dispatch(removeJobFromList(id));

                return response.payload;
            } else if (data.isFailed) {
                toast.dismiss(id);
                toast.error(`Job ${id} failed.`, {
                    autoClose: 3000,
                    closeOnClick: true,
                    position: 'bottom-right',
                });

                dispatch(removeJobFromList(id));
            }

            // TODO: Possibly handle case when job is still running. Update percentage, etc.

            return data
        } catch (error) {
            return { error: error.message };
        }
    }, []);
};
