import React, { useState } from 'react';
import AddressTable from './components/tables/AddressTable';
import { Button, Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import UsersTable from './components/tables/UsersTable';
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
              <Button
                className="d-flex btn-hover-light justify-content-center align-items-center"
                color="soft-light"
                style={{
                  borderRadius: '10px',
                  border: '.5px solid grey',
                }}
              >
                <i className="ri-add-line me-2"></i>
                Add Client
              </Button>
              {/* <Button color="primary">Connect Wallet</Button> */}
            </div>
          </div>
          <UsersTable users={fakeUsers} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAccountantWallets;
