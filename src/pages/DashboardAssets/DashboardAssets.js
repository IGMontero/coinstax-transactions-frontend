import React, { useEffect, useState } from 'react';
import AcitvesTable from '../DashboardInfo/components/ActivesTable';
import { fetchAssets } from '../../slices/transactions/thunk';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const DashboardAssets = () => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const [assetsData, setAssetsData] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isUnsupported, setIsUnsupported] = useState(false);

  const fetchDataAssets = () => {
    setLoadingAssets(true);

    dispatch(fetchAssets(address))
      .unwrap()
      .then((response) => {
        if (response.unsupported == true) {
          setIsUnsupported(true);
          setLoadingAssets(false);
        } else {
          setIsUnsupported(false);
        }
        setAssetsData(response);
        setLoadingAssets(false);
      })
      .catch((error) => {
        console.error('Error fetching performance data:', error);
        setLoadingAssets(false);
      });
  };

  useEffect(() => {
    fetchDataAssets();
  }, []);

  return (
    <div className="page-content mt-5">
      <AcitvesTable loading={loadingAssets} data={assetsData} />
    </div>
  );
};

export default DashboardAssets;
