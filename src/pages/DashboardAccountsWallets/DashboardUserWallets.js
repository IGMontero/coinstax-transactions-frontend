import React, { useState } from 'react';
import { Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';

const DashboardUserWallets = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [modalConnectWallet, setModalConnectWallet] = useState(false);

  const toggleModalConnectWallet = () =>
    setModalConnectWallet(!modalConnectWallet);

  return (
    <React.Fragment>
      <Helmet title="Wallets" />

      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h1>Manage Wallets</h1>
        <div className="d-flex ">
          <Button
            className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            Sync Addresses
          </Button>
          <Button
            onClick={toggleModalConnectWallet}
            className="d-flex btn-hover-light  text-dark justify-content-center align-items-center"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
      <AddressesTable
        modalConnectWallet={modalConnectWallet}
        setModalConnectWallet={setModalConnectWallet}
        userId={userId}
      />
      {/* <div className="mt-4">
            <h2>Watchlist</h2>
            <div className="watchlist-placeholder">
              <p>Drag your wallets here</p>
            </div>
          </div> */}
    </React.Fragment>
  );
};

export default DashboardUserWallets;
