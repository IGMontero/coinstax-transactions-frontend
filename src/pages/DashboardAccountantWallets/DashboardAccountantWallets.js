import React, { useState } from 'react';
import AddressTable from './components/AddressTable';
import { Button, Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import UsersTable from './components/UsersTable';
import Helmet from '../../Components/Helmet/Helmet';

const DashboardAccountantWallets = () => {
  const addresses = useSelector((state) => state.addressName.addresses);

  // Array with fake users with name, email, address and id
  const [fakeUsers, setFakeUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'JhonDoe@emial.com',
      address: '0x1234567890',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'JaneDoe@email.com',
      address: '0x123456789',
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'JhonSmith@email.com',
      address: '0x123456789',
    },
    {
      id: 4,
      name: 'Jane Smith',
      email: 'JaneSmith@email.com',
      address: '0x123456789',
    },
  ]);

  return (
    <React.Fragment>
      <Helmet title="Clients" />
      <div className="page-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Manage Clients</h1>
            <div>
              <Button color="primary" className="me-2">
                Sync Addresses
              </Button>
              <Button color="primary">Connect Wallet</Button>
            </div>
          </div>
          <UsersTable users={fakeUsers} />
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

export default DashboardAccountantWallets;
