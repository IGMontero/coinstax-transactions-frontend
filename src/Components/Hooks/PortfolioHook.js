import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPortfolioSummary } from '../../slices/userWallets/thunk';
import { setLoader } from '../../slices/userWallets/reducer';

const useRefreshPortfolio = (userId) => {
  const dispatch = useDispatch();
  const fetchControllerRef = useRef(new AbortController());
  const [isComplete, setIsComplete] = useState(false);
  const { loading, error, userPortfolio } = useSelector(
    (state) => state.userWallets,
  );

  const refreshPortfolio = useCallback(async () => {
    try {
      // Set loader to true before fetching
      dispatch(setLoader({ loader: 'userPortfolioSummary', value: true }));

      fetchControllerRef.current.abort();
      fetchControllerRef.current = new AbortController();
      const signal = fetchControllerRef.current.signal;

      const response = await dispatch(
        getUserPortfolioSummary({ userId, signal }),
      ).unwrap();

      if (response.complete) {
        setIsComplete(true);
        // Set loader to false when fetch is complete
        dispatch(setLoader({ loader: 'userPortfolioSummary', value: false }));
      } else {
        setIsComplete(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch failed:', error);
        // Set loader to false in case of error
        dispatch(setLoader({ loader: 'userPortfolioSummary', value: false }));
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    return () => fetchControllerRef.current.abort();
  }, []);

  useEffect(() => {
    console.log('Portfolio is complete:', isComplete);

    if (isComplete) {
      console.log('Portfolio data fetched.');
      dispatch(
        setLoader({
          loader: 'userPortfolioSummary',
          value: false,
        }),
      );
    }
  }, [isComplete, dispatch]);

  return { refreshPortfolio, loading, error, userPortfolio };
};

export default useRefreshPortfolio;
