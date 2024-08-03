import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserPortfolioSummary } from '../../slices/userWallets/thunk';
import { setLoader } from '../../slices/userWallets/reducer';

const useRefreshPortfolio = (userId) => {
  const dispatch = useDispatch();
  const fetchControllerRef = useRef(new AbortController());
  const [isComplete, setIsComplete] = useState(false);
  const { loading, error } = useSelector((state) => state.userWallets);

  const refreshPortfolio = useCallback(async () => {
    try {
      dispatch(setLoader({ loader: 'userPortfolioSummary', value: true }));

      fetchControllerRef.current.abort();
      fetchControllerRef.current = new AbortController();
      const signal = fetchControllerRef.current.signal;

      const response = await dispatch(
        getCurrentUserPortfolioSummary({ userId, signal }),
      ).unwrap();

      if (response.complete) {
        setIsComplete(true);
        dispatch(setLoader({ loader: 'userPortfolioSummary', value: false }));
      } else {
        setIsComplete(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch failed:', error);
        dispatch(setLoader({ loader: 'userPortfolioSummary', value: false }));
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    return () => fetchControllerRef.current.abort();
  }, []);

  useEffect(() => {
    if (isComplete) {
      dispatch(
        setLoader({
          loader: 'userPortfolioSummary',
          value: false,
        }),
      );
    }
  }, [isComplete, dispatch]);

  return { refreshPortfolio, loading, error };
};

export default useRefreshPortfolio;
