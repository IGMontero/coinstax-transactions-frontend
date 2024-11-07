import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setFixedData } from '../slices/fixedData/reducer';
import { getFixedData } from '../slices/fixedData/thunk';

export const useGetFixedData = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      // Intentar obtener datos del cache
      const cachedData = JSON.parse(localStorage.getItem('ct_fixed_data'));

      if (cachedData && cachedData.expires > Date.now()) {
        dispatch(setFixedData(cachedData.data));
        return cachedData.data;
      }

      // Usar getFixedData para obtener los datos
      const resultAction = await dispatch(getFixedData());

      if (getFixedData.fulfilled.match(resultAction)) {
        const data = resultAction.payload;

        dispatch(setFixedData(data));

        // Almacenar datos en localStorage
        localStorage.setItem(
          'ct_fixed_data',
          JSON.stringify({
            data: data,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 1, // 1 día
          }),
        );

        return data;
      } else {
        console.error('Failed to fetch fixed data:', resultAction.error);
        return { error: resultAction.error };
      }
    } catch (error) {
      return { error: error.message };
    }
  }, [dispatch]);
};
