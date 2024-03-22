import React from 'react';
import Nfts from '../DashboardInfo/components/Nfts';
import { useParams } from 'react-router-dom';

const NFTsPage = () => {
  const { address } = useParams();
  return (
    <div className="page-content mt-5">
      <Nfts address={address} />
    </div>
  );
};

export default NFTsPage;
