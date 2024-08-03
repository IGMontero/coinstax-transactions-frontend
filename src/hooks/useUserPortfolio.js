import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserPortfolioSummary } from '../slices/userWallets/thunk';
import { setLoader } from '../slices/userWallets/reducer';

const usePortfolioData = (userId) => {
  const dispatch = useDispatch();
  const fetchInterval = useRef(null);

  const fetchControllerRef = useRef(new AbortController());
  const shortPollInterval = useRef(null);
  const hasFetched = useRef(false);
  const { loading, error, userPortfolioSummary } = useSelector(
    (state) => state.userWallets,
  );
  const [isComplete, setIsComplete] = useState(false);

  // If portfolio changes, and complete is false, set complete to false again.
  useEffect(() => {
    if (userPortfolioSummary && !userPortfolioSummary?.complete) {
      setIsComplete(false);
    }
  }, [userPortfolioSummary]);


  useEffect(() => {
    if (isComplete) {
      console.log('Portfolio data fetched.');
      dispatch(
        setLoader({
          loader: 'userPortfolioSummary',
          value: false,
        }),
      );
    }
  }, [isComplete]);

  useEffect(() => {
    // Set loader to true
    if (userId && !isComplete) {
      dispatch(
        setLoader({
          loader: 'userPortfolioSummary',
          value: true,
        }),
      );
    }

    const fetchData = async () => {
      try {
        // fetchControllerRef.current.abort();
        fetchControllerRef.current = new AbortController();
        const signal = fetchControllerRef.current.signal;
        console.log('Fetching portfolio data');
        const response = await dispatch(
          getCurrentUserPortfolioSummary({ userId, signal }),
        ).unwrap();

        if (response.complete) {
          setIsComplete(true);
          if (shortPollInterval.current) {
            clearInterval(shortPollInterval.current);
          }
        } else {
          setIsComplete(false);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch failed:', error);
          dispatch(
            setLoader({
              loader: 'userPortfolioSummary',
              value: false,
            }),
          );
        }
      }
    };

    if (userId) {
      if (!hasFetched.current) {
        hasFetched.current = true;
        fetchData();
        fetchInterval.current = setInterval(fetchData, 300000); // 5 minutes
      }

      if (!isComplete) {
        shortPollInterval.current = setInterval(fetchData, 5 * 1000); // 5 seconds
      }
    } else {
      hasFetched.current = false;
      setIsComplete(false);
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
        fetchInterval.current = null;
      }
      if (shortPollInterval.current) {
        clearInterval(shortPollInterval.current);
        shortPollInterval.current = null;
      }
      // dispatch(clearPortfolioData()); // Uncomment if you have a clear action
    }

    return () => {
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
      }
      if (shortPollInterval.current) {
        clearInterval(shortPollInterval.current);
      }
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [dispatch, userId, isComplete, userPortfolioSummary]);

  return { loading, error, userPortfolioSummary };
};

export const useRefreshUserPortfolio = () => {
  const dispatch = useDispatch();

  const refreshPortfolio = async (userId) => {
    try {
      const response = await dispatch(
        getCurrentUserPortfolioSummary({ userId }),
      ).unwrap();
      return response;
    } catch (error) {
      console.error('Failed to refresh portfolio:', error);
      return null;
    }
  };

  return refreshPortfolio;
}

export default usePortfolioData;
