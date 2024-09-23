import { useDispatch } from 'react-redux';
import { getFixedData } from './_requests';
import { useCallback } from 'react';
import { setFixedData } from '../slices/fixedData/reducer';

export const useGetFixedData = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      // Attempt to get from cache
      const cachedData = JSON.parse(localStorage.getItem('ct_fixed_data'));

      if (cachedData && cachedData.expires > Date.now()) {
        dispatch(setFixedData(cachedData.data));

        return cachedData.data;
      }

      const response = await getFixedData();

      if (response?.error) {
        return response;
      }

      dispatch(setFixedData(response));

      // Cache data
      localStorage.setItem(
        'ct_fixed_data',
        JSON.stringify({
          data: response,
          expires: Date.now() + 1000 * 60 * 60 * 24 * 1, // 1 day
        }),
      );

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }, [dispatch]);
};
