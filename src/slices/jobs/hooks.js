import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchJobById, handleCompletedJob, removeJobFromList } from './reducer';
import { toast } from 'react-toastify';

export const useGetJob = () => {
    const dispatch = useDispatch();

    return useCallback(async (id) => {
        try {
            const response = await dispatch(fetchJobById(id));
            const data = response?.payload;

            if (response?.error || !data) {
                toast.error(`There was a problem. Please try again`, {
                    autoClose: 3000,
                    closeOnClick: true,
                    position: 'bottom-right',
                });

                // Remove job from list if it fails
                dispatch(removeJobFromList(id));
                toast.dismiss(id);

                return response;
            }



            if (data.isCompleted) {
                toast.dismiss(id);
                toast.success(data.message ||
                    `Job ${id} completed successfully.`
                    , {
                        autoClose: 3000,
                        closeOnClick: true,
                        position: 'bottom-right',
                    });


                // * Handle completed job action based on job name/id
                dispatch(handleCompletedJob(data));
                dispatch(removeJobFromList(id));

                return response.payload;
            } else if (data.isFailed) {
                toast.dismiss(id);
                toast.error(data.message ||
                    `Job ${id} failed.`
                    , {
                        autoClose: 3000,
                        closeOnClick: true,
                        position: 'bottom-right',
                    });

                dispatch(removeJobFromList(id));

            }
            // else if (data.isPending) {
            //     toast.info(data.message ||
            //         data.message || `Job ${id} is running.`
            //         , {
            //             autoClose: 3000,
            //             closeOnClick: true,
            //             position: 'bottom-right',
            //         });
            // }

            // TODO: Possibly handle case when job is still running. Update percentage, etc.

            return data
        } catch (error) {
            // Remove job from list if it fails
            dispatch(removeJobFromList(id));
            toast.dismiss(id);

            // Show error message
            toast.error(`There was a problem. Please try again`, {
                autoClose: 3000,
                closeOnClick: true,
                position: 'bottom-right',
            });

            return { error: error.message };
        }
    }, []);
};
