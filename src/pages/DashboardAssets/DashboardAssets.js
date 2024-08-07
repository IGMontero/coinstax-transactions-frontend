import React, { useEffect, useRef, useState } from 'react';
import { fetchAssets } from '../../slices/transactions/thunk';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectNetworkType } from '../../slices/networkType/reducer';
import ActivesTable from '../DashboardInfo/components/ActivesTable';
import Helmet from '../../Components/Helmet/Helmet';
import { fetchAssetsPortfolio } from '../../slices/portfolio/thunk';

const DashboardAssets = () => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const userId = user?.id;

  const networkType = useSelector(selectNetworkType);
  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');
  const fetchControllerRef = useRef(new AbortController());

  const [assetsData, setAssetsData] = useState({});
  // const [loadingAssets, setLoadingAssets] = useState(false);
  const [isUnsupported, setIsUnsupported] = useState(false);

  const [loaderAssets, setLoaderassets] = useState({});

  const loadingAssets = Object.values(loaderAssets).some((loading) => loading);

  const fetchDataAssets = async () => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    const fecthId = Date.now();
    const params = {
      address,
      networkType,
      signal,
    };

    try {
      setLoaderassets((prev) => ({
        ...prev,
        [fecthId]: true,
      }));

      const request = isCurrentUserPortfolioSelected
        ? dispatch(
            fetchAssetsPortfolio({
              userId: userId,
              blockchain: networkType,
              signal,
            }),
          )
        : dispatch(fetchAssets(params)).unwrap();

      const response = await request;

      const res = isCurrentUserPortfolioSelected ? response.payload : response;

      console.log('response assets ', response);
      if (res?.unsupported === true) {
        setIsUnsupported(true);
      } else {
        setIsUnsupported(false);
      }
      setAssetsData(res || {});

      setLoaderassets((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Error fetching performance data:', error);
      }
      setLoaderassets((prev) => ({
        ...prev,
        [fecthId]: false,
      }));
    }
  };

  useEffect(() => {
    fetchDataAssets();
    return () => {
      fetchControllerRef.current.abort();
    };
  }, [networkType, address]);

  return (
    <div>
      <Helmet title="Assets" />
      <ActivesTable
        isDashboardPage={false}
        loading={loadingAssets}
        data={assetsData}
      />
    </div>
  );
};

export default DashboardAssets;
