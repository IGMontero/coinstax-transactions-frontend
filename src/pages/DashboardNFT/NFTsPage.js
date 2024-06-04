import React from 'react';

import { useParams } from 'react-router-dom';
import Nfts from './Nfts';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';

const NFTsPage = () => {
  const { address } = useParams();
  return (
    <div>
      <Nfts address={address} isDashboardPage={false} />
    </div>
  );
};

export default NFTsPage;
