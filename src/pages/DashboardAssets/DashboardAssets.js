import React, { useEffect, useRef, useState } from 'react';
import { fetchAssets } from '../../slices/transactions/thunk';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectNetworkType } from '../../slices/networkType/reducer';
import ActivesTable from '../DashboardInfo/components/ActivesTable';

const DashboardAssets = () => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const networkType = useSelector(selectNetworkType);
  const fetchControllerRef = useRef(new AbortController());

  const [assetsData, setAssetsData] = useState({});
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isUnsupported, setIsUnsupported] = useState(false);

  const fetchDataAssets = async () => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;
    const params = {
      address,
      networkType,
      signal,
    };

    try {
      setLoadingAssets(true);
      const response = await dispatch(fetchAssets(params)).unwrap();
      if (response?.unsupported === true) {
        setIsUnsupported(true);
      } else {
        setIsUnsupported(false);
      }
      setAssetsData(response || {});
      setLoadingAssets(false);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Error fetching performance data:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataAssets();
    return () => {
      fetchControllerRef.current.abort();
    };
  }, [networkType, address]);

  return (
    <div className="page-content ">
      <ActivesTable loading={loadingAssets} data={assetsData} />
    </div>
  );
};

export default DashboardAssets;
