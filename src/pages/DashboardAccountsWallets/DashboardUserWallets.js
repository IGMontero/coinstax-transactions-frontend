import React from 'react';
import { Container, Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressTable from './components/tables/AddressTable';
import { useSelector } from 'react-redux';
import Header from '../../Layouts/Header';

const DashboardUserWallets = () => {
  const addresses = useSelector((state) => state.addressName.addresses);
  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <div className="page-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
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
          <AddressTable addresses={addresses} user={false} />
          <div className="mt-4">
            <h2>Watchlist</h2>
            <div className="watchlist-placeholder">
              <p>Drag your wallets here</p>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardUserWallets;
