import React from 'react';

import { useParams } from 'react-router-dom';
import Nfts from './Nfts';

const NFTsPage = () => {
  const { address } = useParams();
  return (
    <div className="page-content mt-5">
      <Nfts address={address} />
    </div>
  );
};

export default NFTsPage;
